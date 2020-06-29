import * as React from 'react';
import { Button, CheckIcon, CloseIcon, DocumentIcon, InfoStatusBar, Pending } from 'components/ui';
import { Box, BoxProps } from 'grommet';
import { Entities } from '../../../../../../../entities';
import TOrder = Entities.TOrder;
import { last, prop, pipe, defaultTo } from 'ramda';
import { dateFormatToString } from 'utils';
import { hasRole } from 'hocs';
import TContract = Entities.TContract;

const getLastComment = pipe(
  prop('comments'),
  defaultTo([]),
  last
);
const getCommentText = pipe(
  prop('text'),
  defaultTo('')
);
const getDate = pipe(
  prop('date'),
  defaultTo('')
);

const ManagerBtn = hasRole(['CUSTOMER_MANAGER'], Button);
const BuyerBtn = hasRole(['BUYER_CURATOR'], Button);

const documentIcon = (
  <Box
    round="full"
    width={'80px'}
    height={'80px'}
    align="center"
    justify="center"
    background="Basic600"
  >
    <DocumentIcon color="brand" size={'30px'} />
  </Box>
);

export const OrderApprove: React.FunctionComponent<IApprove> = props => (
  <Box align="center" {...props.boxProps}>
    <InfoStatusBar
      icon={documentIcon}
      color={'Basic1000'}
      title="Получена разнарядка"
      text="Проверьте вложения и корректность данных о разнарядке"
    >
      <Box direction="row" justify="center">
        <Pending pending={props.pending}>
          <ManagerBtn
            id="order-orderApprove-button-accept"
            action={true}
            small={true}
            onClick={props.onApprove}
          >
            Принять
          </ManagerBtn>
          <ManagerBtn
            id="order-orderApprove-button-reject"
            small={true}
            margin={{ left: 'small' }}
            onClick={props.onReject}
          >
            Отклонить
          </ManagerBtn>
        </Pending>
      </Box>
    </InfoStatusBar>
  </Box>
);

export const OrderEdit: React.FunctionComponent<IEdit> = props => {
  const icon = (
    <Box
      round="full"
      width="80px"
      height="80px"
      align="center"
      justify="center"
      background="Red600"
    >
      <CloseIcon color="brand" size={'30px'} />
    </Box>
  );

  const { myOrder, myContract } = props;
  const comment = getLastComment(myOrder) as any;
  const text = getCommentText(comment);
  const date = getDate(comment);
  return (
    <Box align="center" {...props.boxProps}>
      <InfoStatusBar
        icon={icon}
        color="Red600"
        label={dateFormatToString(date as Date)}
        title="Разнарядка отклонена"
        text={text as string}
      >
        <Box direction="row" justify="center">
          <Pending pending={myOrder.pending}>
            <BuyerBtn
              id="order-orderApprove-button-edit"
              small={true}
              btnType="link"
              to={`/contracts/${prop('id', myContract)}/orders/${prop('id', myOrder)}/edit`}
            >
              Редактировать
            </BuyerBtn>
          </Pending>
        </Box>
      </InfoStatusBar>
    </Box>
  );
};

export const OrderApproved: React.FunctionComponent<IEdit> = props => {
  const icon = (
    <Box
      round="full"
      width="80px"
      height="80px"
      align="center"
      justify="center"
      background="Green600"
    >
      <CheckIcon color="brand" size={'30px'} />
    </Box>
  );

  const { myOrder } = props;

  const date = getDate(myOrder);
  return (
    <Box align="center" {...props.boxProps}>
      <InfoStatusBar
        icon={icon}
        color="Green600"
        label={dateFormatToString(date as Date)}
        title="Разнарядка принята"
      />
    </Box>
  );
};

interface IApprove {
  onApprove: () => void;
  onReject: () => void;
  boxProps?: BoxProps;
  pending: boolean;
}

interface IEdit {
  myOrder: Partial<TOrder>;
  myContract: Partial<TContract>;
  boxProps?: BoxProps;
}
