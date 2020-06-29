import * as React from 'react';
import { Box } from 'grommet';
import { evolve, pipe, prop } from 'ramda';
import { observer, inject } from 'mobx-react';
import { CloseIcon, FlexiTable, Text } from 'components/ui';
import { IStores } from 'mobx-stores/stores';
import { InlineSelectForm } from 'components/ui/FormConstructor/components';
import { getNiceSize, roundTo, toStringFileSize } from 'utils';
import { TNullableField, TID } from '../../../interface';
import { Entities } from '../../../../entities';
import TDocument = Entities.TDocument;
import ICatalogs = Entities.ICatalogs;
import ICatalogDocument = Entities.ICatalogDocument;
import { computed } from 'mobx';
import { CatalogItem } from '../CatalogItem';

interface IProps {
  documents: Array<TDocument>;
  onChangeType?: (data: TDocument) => void;
  onRemoveDocument?: (id: string) => void;
  namespace: keyof ICatalogs['documentTypes'];
  allowedDocumentTypes?: number[];
  readOnly?: boolean;
}

@inject('catalogs')
@observer
export class UploadedFileList extends React.Component<IStores & IProps> {
  @computed
  private get filesListConfig() {
    const config = [
      {
        property: 'name',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Имя
          </Text>
        ),
        render: (doc: TDocument) => <Text>{doc.name}</Text>,
        width: 300,
      },
      {
        property: 'size',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Размер
          </Text>
        ),
        render: pipe(
          prop('size'),
          getNiceSize,
          evolve({ size: roundTo(2) }),
          toStringFileSize as any
        ),
        width: 100,
      },
      {
        property: 'type',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Тип
          </Text>
        ),
        render: this.props.readOnly
          ? (doc: TDocument) => (
              <CatalogItem namespace={['documentTypes', this.props.namespace]} id={doc.type} />
            )
          : this.getTypeComponent,
      },
    ];

    if (!this.props.readOnly) {
      config.push({
        property: 'removeBtn',
        header: <Text size={'small'} color={'Basic600'} />,
        render: (doc: TDocument) => (
          <Box
            justify="end"
            direction="row"
            width="100%"
            style={{ paddingRight: '15px' }}
            onClick={() => this.props.onRemoveDocument(doc.id)}
          >
            <CloseIcon hover={true} size={'15px'} />
          </Box>
        ),
      });
    }

    return config as Array<FlexiTable.IFlexiTableColumn<TDocument>>;
  }

  public render() {
    return (
      <FlexiTable
        columns={this.filesListConfig}
        data={this.props.documents}
        rowProps={{ clickable: false }}
      />
    );
  }

  private getDocumentOptions = (
    document: TNullableField<TDocument, 'type'>
  ): Array<{ text: string; value: TID }> => {
    const catalogs = this.props.catalogs.data;
    const allowedDocumentTypes = this.props.allowedDocumentTypes || [];
    const options = (catalogs.documentTypes[this.props.namespace] || [])
      .filter(
        (doc: ICatalogDocument) =>
          allowedDocumentTypes.length === 0 || allowedDocumentTypes.indexOf(Number(doc.id)) > -1
      )
      .map((item: ICatalogDocument) => ({
        text: item.name,
        value: item.id,
      }));

    if (document.type == null) {
      return [{ text: 'Выберите тип', value: null }, ...options];
    }

    return options;
  };

  private getTypeComponent = (document: TDocument) => {
    const changeCb = (type: number) => this.props.onChangeType({ ...document, type });
    const hasNoStatus = !!this.props.documents.filter(doc => doc.type == null).length;
    const showErrors = hasNoStatus && document.type == null ? ['Не выбран тип документа'] : [];

    return (
      <InlineSelectForm
        key={0}
        onChangeData={changeCb}
        errors={showErrors}
        config={{
          inlineSelect: true,
          options: this.getDocumentOptions(document),
          required: true,
          type: 'select',
        }}
        value={document.type}
      />
    );
  };
}
