import * as React from 'react';
import { Text } from 'grommet';
import { FlexiTable, ComplaintStatus, CatalogItem } from 'components/ui';
import { Entities } from '../../../entities';
import { dateFormatToString } from 'utils';
import TComplaint = Entities.TComplaint;

export const columns: Array<FlexiTable.IFlexiTableColumn<TComplaint<Date>>> = [
  {
    property: 'deliveryNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер поставки
      </Text>
    ),
    sortable: true,
    width: 100,
  },
  {
    property: 'orderNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер разнарядки
      </Text>
    ),
    sortable: true,
    width: 120,
  },
  {
    property: 'contractNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер договора
      </Text>
    ),
    sortable: true,
    width: 120,
  },
  {
    property: 'mtrCode',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Код МТР
      </Text>
    ),
    sortable: true,
    width: 80,
  },
  {
    property: 'mtrName',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Позиция
      </Text>
    ),
    sortable: true,
    width: 100,
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
    property: 'receiver',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Грузополучатель
      </Text>
    ),
    render: contract => (
      <CatalogItem property={'name'} namespace={'organizations'} id={contract.receiver} />
    ),
    sortable: true,
    width: 110,
  },
  {
    property: 'comissionDate',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Дата проведения комиссии
      </Text>
    ),
    render: complaint => <div>{dateFormatToString(complaint.comissionDate)}</div>,
    sortable: true,
    width: 100,
  },
  {
    property: 'status',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Статус рекламации
      </Text>
    ),
    render: complaint => <ComplaintStatus key="status" complaint={complaint} />,
    sortable: true,
    width: 220,
  },
];
