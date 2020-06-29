import * as React from 'react';
import * as styles from './StepFiles.styl';
import { Box, Text } from 'grommet';
import { computed, observable } from 'mobx';
import { Button, NoDataIcon } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../../entities';
import { FileList } from './FileList';
import { AddFileModal } from './AddFileModal';
import { EditDocStatusModal } from './EditDocStatusModal';
import TDocument = Entities.TDocument;

type IProps = {
  mode: 'files' | 'notifications' | 'reports';
};
@inject('activeControl', 'catalogs', 'access', 'docStatusManager', 'user')
@observer
export class StepFiles extends React.Component<IStores & IProps> {
  @observable private fileUploadModalVisible: boolean = false;
  @observable private selectDocId: string;

  @computed
  private get access() {
    return this.props.access.components.files;
  }

  // TODO: generate allowed types for AddModal in store
  @computed
  private get isAddButtonShow() {
    const { access, activeControl } = this.props;

    const allowedTypes = access.iControl.allowedDocumentTypes.filter(id => {
      switch (this.props.mode) {
        case 'files':
          const excluded = [...activeControl.notificationIds, ...activeControl.reportIds];
          return !excluded.includes(id);
        case 'notifications':
          return activeControl.notificationIds.includes(id);
        case 'reports':
          return activeControl.reportIds.includes(id);
      }
    });

    return !!allowedTypes.length;
  }

  public render() {
    let documents;

    switch (this.props.mode) {
      case 'files':
        documents = this.props.activeControl.documents;
        break;
      case 'notifications':
        documents = this.props.activeControl.notifications;
        break;
      case 'reports':
        documents = this.props.activeControl.reports;
        break;
    }

    return (
      <Box direction="column">
        <Box direction="row">
          <Text className={styles.docTitle}>Документы</Text>
          {this.access.isEditable && this.isAddButtonShow && (
            <Button
              id="control-stepFiles-button-add"
              label="Добавить"
              small={true}
              action={true}
              style={{ marginLeft: 20 }}
              onClick={() => (this.fileUploadModalVisible = true)}
            />
          )}
        </Box>
        <Box margin={{ top: 'medium' }}>
          {documents.length > 0 ? (
            <FileList
              isEditable={this.access.isEditable}
              stepStatus={this.props.activeControl.status}
              documents={documents.sort((a, b) => (a.status ? 1 : -1))}
              onRemoveDocument={(id: string) => this.onRemoveDocument(id)}
              onDocumentClick={(id: string) => this.onDocumentClick(id)}
              userRole={this.props.user.role}
            />
          ) : (
            <Box className={styles.noDoc}>
              <NoDataIcon className={styles.noData} />
              <Text className={styles.noDocText}>Документов пока нет</Text>
            </Box>
          )}
        </Box>
        <AddFileModal
          isShow={this.fileUploadModalVisible}
          onClose={() => (this.fileUploadModalVisible = false)}
          onApply={(doc: TDocument) => this.onChange(doc)}
          mode={this.props.mode}
        />
        <EditDocStatusModal
          isShow={this.props.docStatusManager.isShow}
          onClose={() => (this.props.docStatusManager.isShow = false)}
          documentId={this.selectDocId}
        />
      </Box>
    );
  }

  private onChange(document: TDocument) {
    const doc = {
      ...document,
      isDraft: true,
    };
    this.props.activeControl.addDocument(doc);
  }

  private onRemoveDocument(id: string) {
    const documents = this.props.activeControl.getDocuments().filter(doc => doc.id !== id);
    this.props.activeControl.setDocuments(documents);
  }

  private onDocumentClick(id: string) {
    const doc = this.props.activeControl.getDocumentById(id);

    if (!doc.status) {
      return;
    }

    this.selectDocId = id;
    this.props.docStatusManager.isShow = true;
  }
}
