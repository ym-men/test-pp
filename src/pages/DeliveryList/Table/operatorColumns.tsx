import * as React from 'react';
import { Text } from 'grommet';
import { FlexiTable, DeliveryStatus, CatalogItem } from 'components/ui';
import { Entities } from '../../../../entities';
import { dateFormatToString } from 'utils';
import { Quantity } from 'components/ui/Quantity';
import TDelivery = Entities.TDelivery;

export const columns: Array<FlexiTable.IFlexiTableColumn<TDelivery<Date>>> = [
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
    property: 'orderNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер разнарядки
      </Text>
    ),
    sortable: true,
    width: 95,
  },
  {
    property: 'contractNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер договора
      </Text>
    ),
    sortable: true,
    width: 100,
  },
  {
    property: 'quantity',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Объем
      </Text>
    ),
    render: control => <Quantity key="quantity" control={control} />,
    sortable: true,
    width: 70,
  },
  {
    property: 'dateFrom',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Дата отгрузки
      </Text>
    ),
    render: control => <div>{dateFormatToString(control.dateFrom)}</div>,
    sortable: true,
    width: 100,
  },
  {
    property: 'dateTo',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Прогнозируемая дата поставки
      </Text>
    ),
    render: control => <div>{dateFormatToString(control.dateTo)}</div>,
    sortable: true,
    width: 135,
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
    width: 150,
  },
  {
    property: 'transportType',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Тип транспорта
      </Text>
    ),
    render: contract => (
      <CatalogItem property={'name'} namespace={'transportTypes'} id={contract.transportType} />
    ),
    sortable: true,
    width: 100,
  },
  {
    property: 'status',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Статус поставки
      </Text>
    ),
    render: delivery => <DeliveryStatus key="status" delivery={delivery} />,
    sortable: true,
    width: 200,
  },
];
