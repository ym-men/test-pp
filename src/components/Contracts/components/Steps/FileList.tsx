import * as React from 'react';
import { Text } from 'grommet';
import { evolve, pipe, prop } from 'ramda';
import { getNiceSize, roundTo, toStringFileSize } from 'utils';
import { Entities } from '../../../../../entities';
import TDocument = Entities.TDocument;
import { FlexiTable } from 'components/ui/FlexiTable';
import { TCb } from '../../../../interface';

export const FileList: React.FunctionComponent<IPropsFileList> = props => {
  return (
    <FlexiTable
      columns={FILES_LIST_CONFIG({ typeRender: props.typeRender, nameRender: props.nameRender })}
      data={props.documents}
      rowProps={{ clickable: false }}
    />
  );
};

interface IPropsFileList extends IConfigData {
  documents: Array<TDocument>;
}

const FILES_LIST_CONFIG = (data: IConfigData): Array<FlexiTable.IFlexiTableColumn<TDocument>> =>
  [
    {
      property: 'name',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Имя
        </Text>
      ),
      render: data.nameRender,
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
      render: data.typeRender,
    },
  ] as Array<FlexiTable.IFlexiTableColumn<TDocument>>;

interface IConfigData {
  typeRender: TCb<TDocument, React.ReactNode>;
  nameRender?: TCb<TDocument, React.ReactNode>;
}
