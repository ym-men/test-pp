import * as React from 'react';
import { Box } from 'grommet';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { DashedBox, Text, Button, If, Pending } from 'components/ui';
import { IStores } from 'mobx-stores/stores';
import { actionBlocks } from './ActionBlocks';
import { TActionBlock, TActionButton } from './helpers';
import * as styles from './styles.styl';
import { DocumentIcon, CheckIcon } from 'components/ui';
import cn from 'classnames';
import { COMPLAINT_TEXTS } from './statusInfo';
import { COMPLAINT_STATUSES } from 'components/ui/Statuses/config';

const icons = {
  default: () => (
    <Box className={cn(styles.oval, styles.grey)}>
      <DocumentIcon color="Basic100" className={styles.icon} />
    </Box>
  ),
  accepted: () => (
    <Box className={cn(styles.oval, styles.green)}>
      <CheckIcon color="Basic100" className={styles.icon} />
    </Box>
  ),
  custody: () => (
    <Box className={cn(styles.oval, styles.red)}>
      <CheckIcon color="Basic100" className={styles.icon} />
    </Box>
  ),
};

@inject('activeComplaint', 'user', 'modals', 'catalogs', 'routing')
@observer
export class ActionsBlock extends React.Component<IStores> {
  @computed
  private get actionBlock() {
    const { activeComplaint, user } = this.props;

    const defaultBlock = {
      title: COMPLAINT_STATUSES.texts[activeComplaint.status],
      description: 'Ожидание....',
    };

    return (
      actionBlocks.find((block: TActionBlock) => block.condition({ activeComplaint, user })) ||
      (defaultBlock as TActionBlock)
    );
  }

  @computed
  private get buttons() {
    const { activeComplaint } = this.props;

    return this.actionBlock.buttons
      ? this.actionBlock.buttons.filter(
          button => !button.condition || button.condition({ activeComplaint })
        )
      : [];
  }

  @computed
  private get blockTitle() {
    const { activeComplaint, catalogs } = this.props;

    if (typeof this.actionBlock.title === 'function') {
      return this.actionBlock.title({ activeComplaint, catalogs });
    }

    return this.actionBlock.title;
  }

  @computed
  private get descriptionText() {
    const { activeComplaint, user } = this.props;

    const infoBlock = COMPLAINT_TEXTS[activeComplaint.data.status];

    const description = infoBlock
      ? (infoBlock[user.role] || infoBlock.DEFAULT).description
      : 'Ожидание....';

    if (typeof description === 'function') {
      return description({ activeComplaint });
    }

    return description;
  }

  public render() {
    const { actionBlock } = this;
    const { activeComplaint, modals, routing, catalogs } = this.props;

    if (!actionBlock) {
      return null;
    }

    const ActionIcon = icons[activeComplaint.data.status] || icons.default;

    return (
      <DashedBox align="center" pad={{ vertical: 'medium' }} direction="column" width="100%">
        <ActionIcon />
        <Box margin={{ vertical: 'medium' }}>
          <Text type="title">{this.blockTitle}</Text>
        </Box>
        <If condition={actionBlock.description}>
          <Box direction="row" margin={{ bottom: 'medium' }} style={{ textAlign: 'center' }}>
            <Text>{this.descriptionText}</Text>
          </Box>
        </If>
        <Pending pending={activeComplaint.pending}>
          <If condition={!!actionBlock.buttons}>
            <Box direction="row" margin={{ vertical: 'small' }}>
              {this.buttons.map((button: TActionButton, idx) => {
                return (
                  <Button
                    key={idx}
                    id={`complaint_${idx}`}
                    label={button.text}
                    small={true}
                    action={button.isActionBtn}
                    margin={{ left: 'small' }}
                    onClick={() => button.exec({ activeComplaint, modals, routing, catalogs })}
                  />
                );
              })}
            </Box>
          </If>
        </Pending>
      </DashedBox>
    );
  }
}
