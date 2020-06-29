import * as React from 'react';
import { Text } from 'grommet';
import { FlexiTable, CatalogItem, ContractStatus } from 'components/ui';
import { dateFormat } from 'utils';
import { pipe, prop } from 'ramda';
import * as styles from './styles.styl';
import { Entities } from '../../../../entities';
import TContract = Entities.TContract;
import TOrderMeta = Entities.TOrderMeta;

export const columns: Array<FlexiTable.IFlexiTableColumn<TExtendedContract>> = [
  {
    property: 'number',
    header: (
      <Text size={'small'} color={'Basic600'}>
        №
      </Text>
    ),
    sortable: true,
    width: 100,
  },
  {
    property: 'date',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Составлен
      </Text>
    ),
    render: pipe(
      prop('date'),
      dateFormat
    ),
    sortable: true,
    width: 120,
  },
  {
    property: 'subject',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Предмет договора
      </Text>
    ),
    sortable: true,
    collProps: {
      className: styles.idContract,
    },
    width: 150,
  },
  {
    property: 'supplier',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Поставщик
      </Text>
    ),
    render: contract => (
      <CatalogItem property={'name'} namespace={'organizations'} id={contract.supplier} />
    ),
    sortable: true,
    width: 140,
  },
  {
    property: 'dateTo',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Действует до
      </Text>
    ),
    render: pipe(
      prop('dateTo'),
      dateFormat
    ),
    sortable: true,
    width: 120,
  },
  {
    property: 'ordersCount',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Разнарядки
      </Text>
    ),
    sortable: true,
    width: 80,
  },
  {
    property: 'ordersActiveCount',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Активные
      </Text>
    ),
    sortable: true,
    width: 80,
  },
  {
    property: 'status',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Статус
      </Text>
    ),
    render: contract => <ContractStatus key="status" contract={contract} />,
    sortable: true,
    width: 180,
  },
];

export type TExtendedContract = TContract<Date, TOrderMeta> & {
  ordersActiveCount: number;
  ordersCount: number;
};
