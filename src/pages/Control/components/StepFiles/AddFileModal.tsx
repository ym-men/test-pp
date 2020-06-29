import * as React from 'react';
import { Box, Layer } from 'grommet';
import { computed, observable } from 'mobx';
import { Button, If, DropFileSingle } from 'components/ui';
import { Entities } from '../../../../../entities';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import TDocument = Entities.TDocument;

@inject('access', 'activeControl')
@observer
export class AddFileModal extends React.Component<IStores & IProps> {
  @observable
  private doc: TDocument = null;

  @computed
  private get allowedDocumentTypes() {
    const { activeControl, access, mode } = this.props;

    return access.iControl.allowedDocumentTypes.filter(id => {
      switch (mode) {
        case 'files':
          const excluded = [...activeControl.notificationIds, ...activeControl.reportIds];
          return !excluded.includes(id);
        case 'notifications':
          return activeControl.notificationIds.includes(id);
        case 'reports':
          return activeControl.reportIds.includes(id);
      }
    });
  }

  public render() {
    const { isShow } = this.props;
    const disabled = !this.doc || this.doc.type === null;

    return (
      <If condition={isShow}>
        <Layer modal={true} onEsc={() => this.onClose()} style={{ width: 665, height: 390 }}>
          <Box pad={'large'} margin={{ bottom: 'large' }}>
            <DropFileSingle
              onChange={(doc: TDocument) => this.onChange(doc)}
              allowedDocumentTypes={this.allowedDocumentTypes}
              namespace="control"
            />
          </Box>

          <Box direction="row" pad={'large'} justify={'between'}>
            <Button
              id="control-addFileModal-button-add"
              small={true}
              action={true}
              disabled={disabled}
              onClick={() => this.onApply()}
            >
              Добавить
            </Button>
            <Button
              id="control-addFileModal-button-cancel"
              small={true}
              onClick={() => this.onClose()}
            >
              Отмена
            </Button>
          </Box>
        </Layer>
      </If>
    );
  }

  private onChange(doc: TDocument) {
    this.doc = doc;
  }

  private onApply() {
    this.props.onApply(this.doc);
    this.onClose();
  }

  private onClose() {
    this.doc = null;
    this.props.onClose();
  }
}

interface IProps {
  isShow: boolean;
  onClose: () => void;
  onApply: (doc: TDocument) => void;
  mode: 'files' | 'notifications' | 'reports';
}
