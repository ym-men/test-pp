import * as React from 'react';
import * as styles from './Statuses.styl';
import * as cn from 'classnames';
import { Box, TextProps } from 'grommet';
import { Entities } from '../../../../entities';
import { Pending, If, IfElse, Text } from 'components/ui';
import TContract = Entities.TContract;
import TControl = Entities.TControl;
import TDelivery = Entities.TDelivery;
import TComplaint = Entities.TComplaint;
import TOrder = Entities.TOrder;
import TMTR = Entities.TMTR;
import TDocument = Entities.TDocument;

import {
  CONTRACT_STATUSES,
  DOCUMENT_STATUSES,
  DELIVERY_STATUSES,
  COMPLAINT_STATUSES,
  CONTROL_STATUSES,
  ORDER_STATUSES,
  MTR_STATUSES,
} from './config';

type TCommonStatus<T extends keyof any> = {
  texts: Record<T, string>;
  icons?: Record<T, any> | { ANYCASE: any };
  colors?: Record<T, any> | { ANYCASE: any };
};

const statusHOC: React.FunctionComponent<{
  object: any;
  className?: string;
  statusClassName?: string;
  statuses?: TCommonStatus<any>;
}> = ({ object, ...props }) => {
  const className = cn(
    props.statusClassName ? props.statusClassName : styles.status,
    props.className,
    styles[object.status]
  );
  const text = props.statuses && props.statuses.texts ? props.statuses.texts[object.status] : '';
  const icon =
    props.statuses && props.statuses.icons
      ? 'ANYCASE' in props.statuses.icons
        ? props.statuses.icons.ANYCASE
        : props.statuses.icons[object.status]
      : '';
  const color =
    props.statuses && props.statuses.colors
      ? 'ANYCASE' in props.statuses.colors
        ? props.statuses.colors.ANYCASE
        : props.statuses.colors[object.status]
      : '';

  return (
    <Box
      className={className}
      direction={'row'}
      align={'center'}
      {...props}
      style={{ whiteSpace: 'normal' }}
    >
      <Box className={cn(icon ? styles.statusIconContainer : '')}>
        <If condition={object.pending}>
          <Pending pending={true} size="small" margin={{ right: 'small' }} />
        </If>
        <IfElse condition={object.pending}>
          <If condition={icon}>
            <Box className={styles.icon} justify={'center'} align={'center'}>
              {icon}
            </Box>
          </If>
        </IfElse>
      </Box>
      <Box align="start" margin={{ right: 'small' }}>
        <Text color={color}>{text}</Text>
      </Box>
    </Box>
  );
};

export const ContractStatus: React.FunctionComponent<{
  contract: Pick<TContract, 'status'> & Pick<TContract, 'pending'>;
  className?: string;
}> = ({ contract, ...props }) =>
  statusHOC({
    object: contract,
    statuses: CONTRACT_STATUSES,
    ...props,
  });

export const ControlStatus: React.FunctionComponent<{
  control: Pick<TControl, 'status'> & Pick<TControl, 'pending'>;
  className?: string;
  showIcon?: boolean;
}> = ({ control, ...props }) =>
  statusHOC({
    object: control,
    statuses: CONTROL_STATUSES,
    ...props,
  });

export const ControlVolume: React.FunctionComponent<{
  control: Pick<TControl, 'volume'>;
  className?: string;
}> = ({ control, ...props }) => {
  return (
    <Box {...props} direction={'row'} align={'center'}>
      <Text>{control.volume} шт.</Text>
    </Box>
  );
};

export const DeliveryStatus: React.FunctionComponent<{
  delivery: Pick<TDelivery, 'status'> & Pick<TControl, 'pending'>;
  className?: string;
}> = ({ delivery, ...props }) =>
  statusHOC({
    object: delivery,
    statuses: DELIVERY_STATUSES,
    ...props,
  });

export const ComplaintStatus: React.FunctionComponent<{
  complaint: Pick<TComplaint, 'status'>;
  className?: string;
}> = ({ complaint, ...props }) =>
  statusHOC({
    object: complaint,
    statuses: COMPLAINT_STATUSES,
    statusClassName: styles.orderStatus,
    ...props,
  });

export const OrderStatus: React.FunctionComponent<
  { order: Pick<TOrder, 'status'> & Pick<TOrder, 'pending'>; className?: string } & Pick<
    TextProps,
    'size'
  >
> = ({ order, ...props }) =>
  statusHOC({
    object: order,
    statuses: ORDER_STATUSES,
    ...props,
  });

export const DocumentStatus: React.FunctionComponent<
  { doc: Pick<TDocument, 'status'>; className?: string } & Pick<TextProps, 'size'>
> = ({ doc, ...props }) =>
  statusHOC({
    object: doc,
    statuses: DOCUMENT_STATUSES,
    statusClassName: styles.orderStatus,
    ...props,
  });

export const MTRStatus: React.FunctionComponent<{
  mtr: Pick<TMTR, 'status'>;
  className?: string;
}> = ({ mtr, ...props }) =>
  statusHOC({
    object: mtr,
    statuses: MTR_STATUSES,
    statusClassName: styles.orderStatus,
    ...props,
  });
