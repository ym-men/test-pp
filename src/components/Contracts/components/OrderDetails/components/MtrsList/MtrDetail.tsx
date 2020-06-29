import * as React from 'react';
import * as styles from './MtrsList.styl';
import * as cn from 'classnames';
import { Box, Text } from 'grommet';
import { CatalogItem } from 'components/ui/CatalogItem';
import { Button } from 'components/ui/Button';
import { hasRole } from 'hocs';
import { OrderRightIcon, If } from 'components/ui';
import { Quantity } from 'components/ui/Quantity';
import { Entities } from '../../../../../../../entities';
import TMTR = Entities.TMTR;
import TOrder = Entities.TOrder;
import { datesToString } from 'utils';

const DeliveryBtn = hasRole(['BUYER_CURATOR', 'CUSTOMER_MANAGER'], Button);
const InspectionBtn = hasRole(
  ['BUYER_CURATOR', 'BUYER_QUALITY_MANAGER', 'OUTSIDE_INSPECTOR', 'CUSTOMER_MANAGER'],
  Button
);

export const MtrInfoConfig = [
  {
    title: 'Позиция:',
    value: (mtr: TMTR, index: number) => `${index}. ${mtr.name || 'Н/З'}`,
  },
  {
    title: 'Объем',
    value: (mtr: TMTR) => <Quantity key="quantity" control={mtr} />,
  },
  {
    title: 'Грузополучатель:',
    value: (mtr: TMTR) => (
      <CatalogItem namespace={'organizations'} id={mtr.receiver as number} property={'name'} />
    ),
  },
  {
    title: 'Код МТР:',
    value: (data: TMTR) => data.code,
  },
  {
    title: 'К дате:',
    value: (mtr: TMTR) => datesToString(mtr.date),
  },
  {
    title: 'Адрес:',
    value: (mtr: TMTR) => mtr.mtrDeliveryAddress || 'Н/З',
  },
];

const row1Config = MtrInfoConfig.slice(0, 3);
const row2Config = MtrInfoConfig.slice(3, 6);

const TableItem: React.FunctionComponent<any> = ({ title, value }) => (
  <Box direction="column" margin={{ horizontal: 'small' }}>
    <Box pad={{ bottom: 'xsmall' }}>
      <Text size="small" color="Basic600">
        {title}
      </Text>
    </Box>
    <Box>
      <Text>{value}</Text>
    </Box>
  </Box>
);

export const MtrDetail: React.FunctionComponent<{
  mtr: TMTR;
  index: number;
  order: TOrder;
}> = ({ mtr, index, order }) => (
  <Box direction="column">
    <Box direction="row">
      {row1Config.map(item => (
        <Box key={`box-${index}-${item.title}`} pad="small" className={styles.cellStyle}>
          <TableItem
            key={`cell-${index}-${item.title}`}
            title={item.title}
            value={item.value(mtr, index)}
          />
        </Box>
      ))}
    </Box>
    <Box direction="row">
      {row2Config.map(item => (
        <Box key={`box-${index}-${item.title}`} pad="small" className={styles.cellStyle}>
          <TableItem
            key={`cell-${index}-${item.title}`}
            title={item.title}
            value={item.value(mtr, index)}
          />
        </Box>
      ))}
    </Box>
    <If condition={order.status === 'approved' && !order.pending}>
      <Box className={styles.lineStyle} />
      <Box direction="row">
        <Box className={styles.cellStyle}>
          <Box pad="small">
            <If condition={!mtr.inspectionNeeded || mtr.controlStatus === 'control_finish'}>
              <DeliveryBtn
                id="contract-mtrsList-link-delivery"
                className={styles.buttonStyle}
                btnType="link"
                small={true}
                to={`${order.id}/mtrs/${mtr.id}/deliveries`}
              >
                Поставки (отгружено)
                <OrderRightIcon className={styles.buttonIconStyle} />
              </DeliveryBtn>
            </If>
          </Box>
        </Box>
        <Box className={styles.cellStyle} />
        <Box className={styles.cellStyle}>
          <Box pad="small">
            <If condition={mtr.inspectionNeeded && mtr.inspectionId}>
              <InspectionBtn
                className={cn(
                  styles.buttonStyle,
                  styles.status,
                  mtr.controlStatus === 'control_finish'
                    ? mtr.hasPermissionToShip && !mtr.hasNotClosedNotify
                      ? styles.green
                      : styles.red
                    : ''
                )}
                btnType="link"
                small={true}
                to={`/contracts/${order.contractId}/orders/${order.id}/mtrs/${mtr.id}/controls/${
                  mtr.inspectionId
                }`}
              >
                Инспекционный контроль
                <OrderRightIcon className={styles.buttonIconStyle} />
              </InspectionBtn>
            </If>
          </Box>
        </Box>
      </Box>
    </If>
  </Box>
);
