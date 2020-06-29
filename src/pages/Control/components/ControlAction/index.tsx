import * as React from 'react';
import { Box, CheckBox, Text } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Button, DocumentIcon, ClockIcon, CheckIcon, If, CloseIcon, Pending } from 'components/ui';
import * as style from './ControlAction.styl';
import { ErrModal } from './errModal';
import { CommentModal } from './commentModal';
import { TControlAction } from 'mobx-stores/AccessStore';
import { computed } from 'mobx';
import { IC_TEXTS } from './statusInfo';

@inject('access', 'activeControl', 'user')
@observer
export class ControlAction extends React.Component<IStores> {
  @computed
  private get infoStatus() {
    const { activeControl, user } = this.props;

    const status = activeControl.status;
    const role = user.role;

    const UNKNOWN = {
      title: 'UNKNOWN',
      description: 'UNKNOWN',
    };

    return IC_TEXTS[status]
      ? IC_TEXTS[status][role]
        ? IC_TEXTS[status][role]
        : IC_TEXTS[status].DEFAULT
      : UNKNOWN;
  }

  public render() {
    const { access, activeControl } = this.props;
    const icConfig = access.iControl;
    const pending = activeControl.pending;

    const meetingInfoVisible = access.components.meetingNeeded.isEditable
      ? true
      : access.components.meetingNeeded.isVisible && activeControl.data.meetingNeeded;

    return (
      <Box className={style.container}>
        <Box justify={'center'} align={'center'} className={style.oval}>
          {this.renderIcon()}
        </Box>
        <Text className={style.headTitle}>{this.infoStatus.title}</Text>
        <Text className={style.text}>{this.infoStatus.description}</Text>
        <If condition={meetingInfoVisible}>
          <Box
            justify={'center'}
            align={'center'}
            margin={{ vertical: 'medium' }}
            className={style.checkBox}
          >
            <CheckBox
              onChange={(evt: any) => (activeControl.data.meetingNeeded = evt.target.checked)}
              disabled={!access.components.meetingNeeded.isEditable}
              checked={activeControl.data.meetingNeeded}
              label="Необходимо прединспекционное совещание"
            />
          </Box>
        </If>
        <Pending pending={pending}>
          {icConfig.actions.map((action: TControlAction, idx) => {
            return (
              <Button
                id={`controlAction-button-${idx}`}
                key={idx}
                label={action.text}
                isLoading={activeControl.updateStatus === 'fetching'}
                small={true}
                action={action.isActionBtn}
                style={{ marginTop: 10, width: '100%' }}
                onClick={() => access.execAction(action)}
              />
            );
          })}
        </Pending>
        <ErrModal
          isShow={access.errModalVisible}
          errText={access.validationErr}
          onClose={() => (access.errModalVisible = false)}
        />
        <CommentModal
          isShow={access.commentModalVisible}
          title={access.commentModalTitle}
          text={access.commentModalText}
          placeholder={access.commentModalPlaceholder}
          onClose={() => access.rejectComment()}
          onApprove={(comment: string) => access.submitComment(comment)}
        />
      </Box>
    );
  }

  private renderIcon() {
    const { access, activeControl } = this.props;
    const icConfig = access.iControl;
    const hasBadDocs = activeControl.data.documents.some(
      doc => doc.type === 10 && doc.status && doc.status !== 'closed'
    );
    if (activeControl.status === 'control_finish' && !hasBadDocs) {
      return (
        <Box
          round="full"
          width="80px"
          height="80px"
          align="center"
          justify="center"
          background="Green600"
        >
          <CheckIcon color="brand" size={'30px'} />
        </Box>
      );
    } else if (activeControl.status === 'control_finish' && hasBadDocs) {
      return (
        <Box
          round="full"
          width="80px"
          height="80px"
          align="center"
          justify="center"
          background="Red600"
        >
          <CloseIcon color="brand" size={'30px'} />
        </Box>
      );
    } else {
      return icConfig.waiting ? (
        <ClockIcon color="Basic100" className={style.clockIcon} />
      ) : (
        <DocumentIcon color="Basic100" className={style.icon} />
      );
    }
  }
}
