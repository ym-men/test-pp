import * as React from 'react';
import { dateFormatToString } from 'utils';
import { Entities } from '../../../../../../../entities';

export const orderInfo = (Component: React.FunctionComponent) => ({
  order,
  ...props
}: {
  order: Entities.TOrder;
}) => {
  const list = [
    {
      title: 'Номер',
      value: order.number,
    },
    {
      title: 'Дата утверждения',
      value: dateFormatToString(order.acceptDate),
    },
    {
      title: 'Толеранс',
      value: `${order.toleranceFrom || 0}-${order.toleranceTo || 0}%`,
    },
  ];

  const myprops = { ...props, list };

  return <Component {...myprops as any} />;
};
