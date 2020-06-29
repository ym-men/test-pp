import * as React from 'react';
import { If, Text } from 'components/ui';
import { Box, Layer, TextArea } from 'grommet';
import { observer, inject } from 'mobx-react';
import { autorun, computed } from 'mobx';
import { IStores } from 'mobx-stores/stores';
import { CatalogItem } from 'components/ui/CatalogItem';

import { AddFileBlock } from './components/AddFileBlock';
import { FileInfoBlock } from './components/FileInfoBlock';
import { FooterBlock } from './components/FooterBlock';
import { ActionsBlock } from './components/ActionsBlock';

@inject('activeControl', 'catalogs', 'docStatusManager', 'user')
@observer
export class EditDocStatusModal extends React.Component<IStores & IProps> {
  @computed
  private get document() {
    return this.props.activeControl.getDocumentById(this.props.documentId);
  }

  @computed
  private get hasSecondStep() {
    return this.props.docStatusManager.rejectNoticeMode || !!this.document.linkId;
  }

  constructor(props: any) {
    super(props);

    autorun(() => {
      if (this.props.documentId) {
        this.props.docStatusManager.documentId = this.props.documentId;
      }
    });
  }

  public render() {
    const { docStatusManager } = this.props;

    if (!docStatusManager.isShow || !this.document) {
      return null;
    }

    return (
      <Layer modal={true} onEsc={docStatusManager.closeModal} style={{ width: 670 }}>
        <Box pad={'large'}>
          <CatalogItem
            margin={{ bottom: 'small' }}
            type="title"
            namespace={['documentTypes', 'control']}
            id={this.document.type as number}
          />
          <If condition={docStatusManager.isReport}>{this.renderReportBody()}</If>
          <If condition={docStatusManager.isNotice}>{this.renderNoticeBody()}</If>
        </Box>
      </Layer>
    );
  }

  private renderReportBody() {
    const { activeControl, docStatusManager, user } = this.props;
    const showActions =
      user.role === 'BUYER_QUALITY_MANAGER' && this.document.status === 'approving';

    return (
      <>
        <FileInfoBlock document={this.document} />
        <If condition={!docStatusManager.rejectReportMode}>
          <FooterBlock
            buttons={{ approve: showActions, reject: showActions, cancel: true }}
            onApprove={() =>
              activeControl
                .changeDocumentStatus(this.document.id, 'accepted')
                .then(docStatusManager.closeModal)
            }
            onReject={() => (docStatusManager.rejectReportMode = true)}
            onCancel={docStatusManager.closeModal}
            disabled={false}
            approveText="Принять"
          />
        </If>
        <If condition={docStatusManager.rejectReportMode}>
          <Box margin={{ vertical: 'medium' }}>
            <Text type="title">Отклонение</Text>
            <Box margin={{ vertical: 'medium' }}>
              <Text>Укажите причину отклонения</Text>
            </Box>
            <TextArea
              resize={'vertical'}
              value={docStatusManager.rejectReportText}
              placeholder="Причина отклонения"
              onChange={(event: any) => (docStatusManager.rejectReportText = event.target.value)}
            />
            <FooterBlock
              buttons={{
                approve: !!docStatusManager.rejectReportText ? 'visible' : 'disabled',
                reject: false,
                cancel: true,
              }}
              approveText="Отправить"
              onApprove={() =>
                activeControl
                  .changeDocumentStatus(
                    this.document.id,
                    'rejected',
                    docStatusManager.rejectReportText
                  )
                  .then(docStatusManager.closeModal)
              }
              onCancel={() => (docStatusManager.rejectReportMode = false)}
              disabled={false}
            />
          </Box>
        </If>
      </>
    );
  }

  private renderNoticeBody() {
    const { activeControl, docStatusManager } = this.props;
    const linkedDoc = activeControl.getDocumentById(this.document.linkId);
    return (
      <>
        <FileInfoBlock document={this.document} />
        <If condition={!docStatusManager.rejectNoticeMode}>
          <ActionsBlock actions={docStatusManager.actions} showClose={!this.hasSecondStep} />
        </If>
        <If condition={this.hasSecondStep}>
          <If condition={!docStatusManager.rejectNoticeMode}>
            <Box margin={{ vertical: 'medium' }}>
              <Text type="title">{docStatusManager.actionInfo.title}</Text>
              <FileInfoBlock document={linkedDoc} />
              <ActionsBlock actions={docStatusManager.actions} showClose={true} />
            </Box>
          </If>
          <If condition={docStatusManager.rejectNoticeMode}>
            <Box margin={{ vertical: 'medium' }}>
              <Text type="title">{docStatusManager.actionInfo.title}</Text>
              <Box margin={{ vertical: 'medium' }}>
                <Text>{docStatusManager.actionInfo.description}</Text>
              </Box>
              <AddFileBlock onChange={doc => (docStatusManager.loadedDoc = doc)} />
              <TextArea
                resize={'vertical'}
                value={docStatusManager.text}
                placeholder="Комментарий"
                onChange={(event: any) => (docStatusManager.text = event.target.value)}
              />
              <FooterBlock
                buttons={{
                  approve: !!(docStatusManager.text && docStatusManager.loadedDoc)
                    ? 'visible'
                    : 'disabled',
                  reject: false,
                  cancel: true,
                }}
                approveText="Отправить"
                onApprove={() => {
                  docStatusManager.loadedDoc.type = docStatusManager.loadedDocType;

                  if ([10, 12].indexOf(docStatusManager.loadedDoc.type) > -1) {
                    docStatusManager.loadedDoc.status = 'approving';
                  }

                  docStatusManager.loadedDoc.parentId = this.document.id;

                  activeControl.addDocument(docStatusManager.loadedDoc);

                  activeControl.changeDocumentStatus(
                    this.document.id,
                    docStatusManager.newDocStatus,
                    docStatusManager.text
                  );

                  docStatusManager.closeModal();
                }}
                onCancel={() => (docStatusManager.rejectNoticeMode = false)}
                disabled={false}
              />
            </Box>
          </If>
        </If>
      </>
    );
  }
}

interface IProps {
  isShow: boolean;
  onClose: () => void;
  documentId: string;
}
