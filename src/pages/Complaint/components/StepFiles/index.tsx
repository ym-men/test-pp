import * as React from 'react';
import * as styles from './StepFiles.styl';
import { Box, Text } from 'grommet';
import { computed } from 'mobx';
import { NoDataIcon, Button } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { FileList } from './FileList';
import { actionBlocks } from '../Actions/ActionBlocks';
import { TActionBlock } from '../Actions/helpers';
import { Entities } from '../../../../../entities';
import TComplaintStatus = Entities.TComplaintStatus;

@inject('activeComplaint', 'user')
@observer
export class StepFiles extends React.Component<IStores> {
  @computed
  private get isEditable() {
    const status: TComplaintStatus = this.props.activeComplaint.data.status;

    return status !== 'complaint_closed' && status !== 'claim_work_fixed' && !!this.actionBlock;
  }

  @computed
  private get actionBlock() {
    const { activeComplaint, user } = this.props;

    return actionBlocks.find((block: TActionBlock) => block.condition({ activeComplaint, user }));
  }

  @computed
  private get documents() {
    const { activeComplaint } = this.props;
    return activeComplaint.data.documents ? activeComplaint.data.documents : [];
  }

  public render() {
    const { activeComplaint } = this.props;

    return (
      <Box direction="column">
        <Box direction="row">
          <Text className={styles.docTitle}>Документы</Text>
          {this.isEditable && (
            <Button
              id="complaint-stepFiles-button-add"
              label="Добавить"
              small={true}
              action={true}
              style={{ marginLeft: 20 }}
              onClick={activeComplaint.loadDocument}
              isLoading={activeComplaint.pending}
            />
          )}
        </Box>
        <Box margin={{ top: 'medium' }}>
          {this.documents.length > 0 ? (
            <FileList
              isEditable={false}
              documents={this.documents.slice().sort(a => (a.status ? 1 : -1))}
              onRemoveDocument={() => console.log()}
              onDocumentClick={() => console.log()}
              userRole={this.props.user.role}
            />
          ) : (
            <Box className={styles.noDoc}>
              <NoDataIcon className={styles.noData} />
              <Text className={styles.noDocText}>Документов пока нет</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}
