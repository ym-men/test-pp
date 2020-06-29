import * as React from 'react';
import * as styles from './StepFiles.styl';
import { Box, Text } from 'grommet';
import { computed } from 'mobx';
import { Button, NoDataIcon } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { FileList } from './FileList';

@inject('activeDelivery', 'user')
@observer
export class StepFiles extends React.Component<IStores> {
  @computed
  private get isEditable() {
    const { activeDelivery, user } = this.props;
    return (
      user.role === 'CUSTOMER_MANAGER' ||
      (user.role === 'BUYER_OPERATOR' && activeDelivery.status === 'accepting')
    );
  }

  @computed
  private get documents() {
    const { activeDelivery } = this.props;
    return activeDelivery.data.documents ? activeDelivery.data.documents : [];
  }

  public render() {
    const { activeDelivery } = this.props;

    return (
      <Box direction="column">
        <Box direction="row">
          <Text className={styles.docTitle}>Документы</Text>
          {this.isEditable && (
            <Button
              id="delivery-stepFiles-button-add"
              label="Добавить"
              small={true}
              action={true}
              style={{ marginLeft: 20 }}
              onClick={activeDelivery.loadDocument}
              isLoading={activeDelivery.pending}
            />
          )}
        </Box>
        <Box margin={{ top: 'medium' }}>
          {this.documents.length > 0 ? (
            <FileList
              isEditable={false}
              documents={this.documents.sort(a => (a.status ? 1 : -1))}
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
