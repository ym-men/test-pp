import * as React from 'react';
import { Text } from 'grommet';
import { FlexiTable, MTRStatus } from 'components/ui';
import { datesToString } from 'utils';
import { Entities } from '../../../../../../../entities';
import TMTR = Entities.TMTR;
import { Quantity } from 'components/ui/Quantity';

const columns: Array<FlexiTable.IFlexiTableColumn<TMTR & { index: number }>> = [
  {
    property: 'index',
    header: (
      <Text size={'small'} color={'Basic600'}>
        №
      </Text>
    ),
    width: 50,
  },
  {
    property: 'name',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Позиция
      </Text>
    ),
    width: 350,
  },
  {
    property: 'quantity',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Объем поставки
      </Text>
    ),
    render: mtr => <Quantity control={mtr} />,
    width: 150,
  },
  {
    property: 'date',
    header: (
      <Text size={'small'} color={'Basic600'}>
        К дате
      </Text>
    ),
    render: mtr => datesToString(mtr.date),
    width: 150,
  },
  {
    property: 'status',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Статус поставки
      </Text>
    ),
    render: mtr => <MTRStatus mtr={mtr} />,
    width: 130,
  },
  {
    property: 'inspectionNeeded',
    header: (
      <Text size={'small'} color={'Basic600'}>
        ИК
      </Text>
    ),
    render: mtr => (mtr.inspectionNeeded ? <Text>Да</Text> : <Text>Нет</Text>),
    width: 70,
  },
];

export default columns;
