import * as React from 'react';
import { Box } from 'grommet';
import * as cn from 'classnames';
import { Button, Text, CloseIcon, If } from 'components/ui';
import { file } from 'services/files';
import IFileData = file.IFileData;
import { Entities } from '../../../../entities';
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import { inject } from 'mobx-react';
import { SelectForm } from 'components/ui/FormConstructor/components';
import { TID, TWithout } from '../../../interface';
import { getNiceSize, roundTo, toStringFileSize } from 'utils';
import { IStores } from 'mobx-stores/stores';
import TDocument = Entities.TDocument;
import ICatalogDocument = Entities.ICatalogDocument;
import * as styles from './DropFileSingle.styl';

type namespaces = 'contract' | 'order' | 'control' | 'delivery';

const UploadedDocument: React.FunctionComponent<{ doc: TDocument; onRemove: () => void }> = ({
  doc,
  onRemove,
}) => {
  const filSize = getNiceSize(doc.size);
  filSize.size = roundTo(2, filSize.size);
  const niceSize = toStringFileSize(filSize);

  return (
    <Box direction="row" width="100%" className={styles.fileRow}>
      <Box className={styles.fileInfo}>
        {doc.name}, {niceSize}
      </Box>
      <Box
        margin={{ right: 'small' }}
        className={cn(styles.closeIcon, 'rowHoverIcon')}
        onClick={onRemove}
      >
        <CloseIcon size={'15px'} />
      </Box>
    </Box>
  );
};

const UploadBlock: React.FunctionComponent<{
  onChangeFiles: (list: IFileData[]) => void;
}> = ({ onChangeFiles }) => {
  return (
    <>
      <Button
        id="dropFileSingle-file-overview"
        onChange={(list: IFileData[]) => onChangeFiles(list)}
        accept={'image/*,application/pdf'}
        small={true}
        btnType={'file'}
      >
        Обзор
      </Button>
      <Text margin={{ horizontal: 'medium' }} size={'small'} color={'Basic600'}>
        Добавьте файл в одном из следующих форматов:
        <br />
        PDF, JPG, PNG, GIF, TIF
      </Text>
    </>
  );
};

const SelectType: React.FunctionComponent<{
  doc: TDocument;
  options: { text: string; value: TID }[];
  onChangeType: (type: number) => void;
  disabled?: boolean;
}> = props => (
  <Box direction="column" margin={{ top: 'large' }} align={'start'} width={'100%'}>
    <Text color="Basic600" margin={{ bottom: 'xxsmall' }}>
      Тип файла
    </Text>
    <SelectForm
      key={0}
      onChangeData={props.onChangeType}
      config={{
        inlineSelect: true,
        options: props.options,
        required: true,
        type: 'select',
        className: styles.selectType,
        props: {
          disabled: props.disabled,
        },
      }}
      value={props.doc && props.doc.type}
    />
  </Box>
);

@inject('catalogs', 'user')
@observer
export class DropFileSingle extends React.Component<IStores & DropFileSingleProps> {
  @observable
  private doc: TDocument = null;

  @computed
  private get documentOptions(): { text: string; value: TID }[] {
    const catalogs = this.props.catalogs.data;
    const { namespace, allowedDocumentTypes } = this.props;

    const options = (catalogs.documentTypes[namespace] || [])
      .filter(
        (doc: ICatalogDocument) =>
          !allowedDocumentTypes || allowedDocumentTypes.indexOf(Number(doc.id)) > -1
      )
      .map((item: ICatalogDocument) => ({
        text: item.name,
        value: item.id,
      }));

    if (!this.doc || this.doc.type == null) {
      return [{ text: 'Выберите тип', value: null }, ...options];
    }

    return options;
  }

  public render() {
    return (
      <Box>
        <If condition={!this.props.hideTitle}>
          <Text margin={{ bottom: 'small' }} type="title">
            Добавление файла
          </Text>
        </If>
        {this.doc === null ? (
          <Box direction={'row'} alignSelf={'start'} align={'start'}>
            <UploadBlock onChangeFiles={(list: IFileData[]) => this.onChangeFiles(list)} />
          </Box>
        ) : (
          <Box direction={'column'} align={'start'}>
            <UploadedDocument doc={this.doc} onRemove={() => this.onRemove()} />
          </Box>
        )}
        <If condition={!this.props.hideTypeOptions}>
          <SelectType
            doc={this.doc}
            onChangeType={this.onChangeType}
            options={this.documentOptions}
            disabled={this.doc === null}
          />
        </If>
      </Box>
    );
  }

  private onChangeFiles = (list: IFileData[]) => {
    this.doc = (this.fileToDoc(list[0]) as any) as TDocument;
    this.props.onChange(this.doc);
  };

  private onRemove = () => {
    this.doc = null;
    this.props.onRemove();
  };

  private onChangeType = (type: number) => {
    if (!this.doc) {
      return;
    }
    const REPORTS = [7, 8, 9, 10, 12];
    this.doc.type = type;
    this.doc.status = REPORTS.indexOf(this.doc.type) > -1 ? 'approving' : null;
    this.props.onChange(this.doc);
  };

  private fileToDoc(item: file.IFileData): TWithout<TDocument, 'type'> & { type: string | null } {
    const user = this.props.user;
    const doc: any = {
      date: item.date,
      id: item.id,
      name: item.name,
      size: item.size,
      type: this.props.documentType,
      author: user.userInfo.displayName,
    };

    return doc;
  }
}

export type DropFileSingleProps = {
  onChange: (doc: TDocument | null) => void;
  onRemove?: () => void;
  allowedDocumentTypes?: number[];
  documentType?: number;
  namespace: namespaces;
  hideTitle?: boolean;
  hideTypeOptions?: boolean;
};
