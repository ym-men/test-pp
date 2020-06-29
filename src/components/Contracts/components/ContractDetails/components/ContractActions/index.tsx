import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { Button, InfoStatusBar, DocumentIcon, CloseIcon, CheckIcon, Pending } from 'components/ui';
import { last, prop, pipe, defaultTo } from 'ramda';
import { dateFormatToString } from 'utils';
import { hasRole } from 'hocs';
import { Entities } from '../../../../../../../entities';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
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
const BuyerButton = hasRole(['BUYER_CURATOR'], Button);

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

export const ContractApprove: React.FunctionComponent<IApprove> = props => (
  <Box align="center" {...props.boxProps}>
    <InfoStatusBar
      icon={documentIcon}
      color={'Basic1000'}
      title="Договор внесен куратором договора"
      text="Проверьте вложения и корректность данных о договоре"
    >
      <Box direction="row" justify="center">
        <Pending pending={props.pending}>
          <Button
            id="contract-contractApprove-button-accept"
            action={true}
            small={true}
            onClick={props.onApprove}
          >
            Принять
          </Button>
          <Button
            id="contract-contractApprove-button-reject"
            small={true}
            margin={{ left: 'small' }}
            onClick={props.onReject}
          >
            Отклонить
          </Button>
        </Pending>
      </Box>
    </InfoStatusBar>
  </Box>
);

export const ContractApproveWait: React.FunctionComponent<{ boxProps?: BoxProps }> = props => (
  <Box align="center" {...props.boxProps}>
    <InfoStatusBar icon={documentIcon} color={'Basic1000'} title="Направлен поставщику" text="" />
  </Box>
);

export const ContractEdit: React.FunctionComponent<IEdit> = props => {
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

  const { myContract } = props;
  const comment = getLastComment(myContract) as any;
  const text = getCommentText(comment);
  const date = getDate(comment);

  return (
    <Box align="center" {...props.boxProps}>
      <InfoStatusBar
        icon={icon}
        color="Red600"
        label={dateFormatToString(date as Date)}
        title="Договор отклонен"
        text={text as string}
      >
        <Box direction="row" justify="center">
          <Pending pending={myContract.pending}>
            <BuyerButton
              id="contract-contractApproveWait-button-edit"
              small={true}
              btnType="link"
              to={`/contracts/${myContract.id}/edit`}
            >
              Редактировать
            </BuyerButton>
          </Pending>
        </Box>
      </InfoStatusBar>
    </Box>
  );
};

@inject('user')
@observer
export class ContractApproved extends React.Component<IEdit & Pick<IStores, 'user'>> {
  public render() {
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

    const { myContract } = this.props;

    const date = getDate(myContract);
    return (
      <Box align="center" {...this.props.boxProps}>
        <InfoStatusBar
          icon={icon}
          color="Green600"
          label={dateFormatToString(date as Date)}
          title="Договор принят"
          text={
            this.props.user.role === 'BUYER_CURATOR'
              ? 'Чтобы продолжить работу, создайте разнарядку.'
              : ''
          }
        >
          <Box direction="row" justify="center">
            <Pending pending={myContract.pending}>
              <BuyerButton
                id="contract-contractApproved-button-addOrder"
                small={true}
                btnType="link"
                to={`/contracts/${myContract.id}/orders/new`}
              >
                Добавить разнарядку
              </BuyerButton>
            </Pending>
          </Box>
        </InfoStatusBar>
      </Box>
    );
  }
}

interface IApprove {
  onApprove: () => void;
  onReject: () => void;
  boxProps?: BoxProps;
  pending: boolean;
}

interface IEdit {
  myContract: Partial<TContract>;
  boxProps?: BoxProps;
}
