import * as React from 'react';
import { Box, Text } from 'grommet';
import { FlexiTable, CatalogItem, ControlStatus, ControlVolume, AlertIcon } from 'components/ui';
import { dateFormatToString } from 'utils';
import { Entities } from '../../../../entities';
import TControl = Entities.TControl;
import * as styles from '../list.styl';
import * as ReactTooltip from 'react-tooltip';
import { Quantity } from 'components/ui/Quantity';

export const columns: Array<FlexiTable.IFlexiTableColumn<TControl<Date> & { index: number }>> = [
  {
    property: 'mtrCode',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Код МТР
      </Text>
    ),
    sortable: true,
    width: 60,
  },
  {
    property: 'mtrName',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Позиция
      </Text>
    ),
    sortable: true,
    width: 80,
  },
  {
    property: 'orderNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер разнарядки
      </Text>
    ),
    sortable: true,
    width: 100,
  },
  {
    property: 'contractNumber',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Номер договора
      </Text>
    ),
    sortable: true,
    width: 80,
  },
  {
    property: 'volume',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Объем
      </Text>
    ),
    render: control =>
      control.quantity ? (
        <Quantity control={control} />
      ) : (
        <ControlVolume key="volume" control={control} />
      ),
    sortable: true,
    width: 40,
  },
  {
    property: 'dateEnd',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Даты
      </Text>
    ),
    render: control => (
      <Box align="center">
        <Box>{dateFormatToString(control.dateStart)}</Box>
        <Box>-</Box>
        <Box>{dateFormatToString(control.dateEnd)}</Box>
      </Box>
    ),
    sortable: true,
    width: 60,
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
    property: 'status',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Статус контроля
      </Text>
    ),
    render: control => <ControlStatus key="status" control={control} />,
    sortable: true,
    width: 140,
  },
  {
    property: 'index',
    header: (
      <Text size={'small'} color={'Basic600'}>
        Несоответствия
      </Text>
    ),
    width: 80,
    render: control => {
      const alerts = [];

      if (
        ['control_shipment', 'control_finish', 'delivery_spoiled'].indexOf(control.status) > -1 &&
        control.documents.every(doc => doc.type !== 14)
      ) {
        alerts.push(
          <AlertIcon color="Red600" data-type="error" data-tip="Отгрузка без разрешения" />
        );
      }

      if (
        control.documents.some(doc => doc.type === 12 && doc.status && doc.status === 'approving')
      ) {
        alerts.push(
          <AlertIcon color="#ef833a" data-type="error" data-tip="Запрос на отклонение" />
        );
      }

      if (control.documents.some(doc => doc.type === 10 && doc.status && doc.status !== 'closed')) {
        alerts.push(
          <AlertIcon color="Yellow600" data-type="error" data-tip="Уведомление о несоответствии" />
        );
      }

      return (
        <Box direction="row" className={styles.alertContainer}>
          {alerts}
          <ReactTooltip place="top" effect="solid" />
        </Box>
      );
    },
  },
];
