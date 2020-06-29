import { Text } from 'grommet';
import { FlexiTable, FormConstructor } from 'components/ui';
import { pipe, prop, evolve } from 'ramda';
import { Entities } from '../../../../../entities';
import { getNiceSize, ISizeData, roundTo, toStringFileSize } from 'utils';
import { TCb, TFunc, TID, TNullableField } from 'interface';
import * as styles from './ContractForm.styl';
import * as React from 'react';
import TDocument = Entities.TDocument;
import ICatalogs = Entities.ICatalogs;

function getDocumentOptions(
  document: TNullableField<TDocument, 'type'>,
  catalogs: ICatalogs
): Array<{ text: string; value: TID | null }> {
  const options = ((catalogs.documentTypes && catalogs.documentTypes.contract) || []).map(item => ({
    text: item.name,
    value: item.id,
  }));
  if (document.type == null) {
    return [{ text: 'Выберите тип', value: null }, ...options];
  }
  return options;
}

function getDocumentSelectData(
  document: TNullableField<TDocument, 'type'>,
  catalogs: ICatalogs
): any {
  return [
    {
      type: 'select',
      field: 'type',
      required: true,
      className: styles.groupInput,
      options: getDocumentOptions(document, catalogs),
    },
  ];
}

export function getColumns(
  onChangeType: TFunc<[number, number | string], void>,
  catalogs: ICatalogs
): Array<FlexiTable.IFlexiTableColumn<TDocument>> {
  return [
    {
      property: 'name',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Имя
        </Text>
      ),
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
        evolve({ size: roundTo(2) }) as TCb<ISizeData, ISizeData>,
        toStringFileSize
      ),
    },
    {
      property: 'type',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Тип
        </Text>
      ),
      render: document => (
        <FormConstructor
          onChangeData={(value: any) => onChangeType(value, document.id)}
          formOptions={getDocumentSelectData(document, catalogs)}
          errors={{}}
          data={document}
        />
      ),
    },
  ];
}
