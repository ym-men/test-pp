import * as React from 'react';
import * as style from './OrderInfo.styl';
import { Box } from 'grommet';
import { Text } from 'components/ui';
import { dateFormatToString } from 'utils';
import { OrderStatus } from 'components/ui/Statuses';
import { Entities } from '../../../../../../../entities';
import TOrder = Entities.TOrder;

const getText = (t: any) => (t ? t : 'Не заполнено');

const Item: React.FunctionComponent<{ text: any }> = props => (
  <Box className={style.item}>
    <Text className={style.title}>{props.text}</Text>
    <Text className={style.text} overflow="ellipsis">
      {props.children}
    </Text>
  </Box>
);

export const OrderInfo: React.FunctionComponent<IProps> = ({ order, ...props }) => {
  return (
    <Box className={style.container} {...props}>
      <Text className={style.headTitle}>Данные разнарядки</Text>
      <Item text="Статус">
        <OrderStatus order={order} size={'small'} />
      </Item>
      <Item text="Номер разнарядки">{getText(order.number)}</Item>
      <Item text="Толеранс">
        {getText(`${order.toleranceFrom || 0}-${order.toleranceTo || 0}%`)}
      </Item>
      <Item text="Дата подтверждения">
        {dateFormatToString(new Date(order.acceptDate as Date))}
      </Item>
      <Item text="Позиций">{(order.mtrs && order.mtrs.length) || 0}</Item>
    </Box>
  );
};

interface IProps {
  order: TOrder<any>;
}
