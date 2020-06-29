import * as React from 'react';
import { Text } from 'grommet';
import { FlexiTable, DeliveryStatus, CatalogItem } from 'components/ui';
import { Entities } from '../../../../entities';
import { dateFormatToString } from 'utils';
import { Quantity } from 'components/ui/Quantity';
import TDelivery = Entities.TDelivery;

export const deliverListColumns: Array<FlexiTable.IFlexiTableColumn<TDelivery<Date>>> = [
  {
    property: 'number',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер поставки
      </Text>
    ),
    sortable: true,
    width: 70,
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
    width: 150,
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
        Статус контроля
      </Text>
    ),
    render: delivery => <DeliveryStatus key="status" delivery={delivery} />,
    sortable: true,
    width: 250,
  },
];
