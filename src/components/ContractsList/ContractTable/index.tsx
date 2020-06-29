import * as React from 'react';
import * as styles from './styles.styl';
import { contracts } from 'services/contracts';
import { columns, TExtendedContract } from './columns';
import { FlexiTable } from 'components/ui';
import { TID } from 'interface';
import { Entities } from '../../../../entities';
import { length, filter, whereEq, map } from 'ramda';
import { orders } from '../../../services/orders';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import CONTRACT_STATUS = contracts.CONTRACT_STATUS;
import TContract = Entities.TContract;
import TOrderMeta = Entities.TOrderMeta;
import ORDER_STATUS = orders.ORDER_STATUS;

@inject('user')
@observer
export class ContractTable extends React.Component<IProps & IStores, IState> {
  public static getDerivedStateFromProps(props: IProps, state: IState): IState {
    return {
      ...state,
      list: ContractTable._remapContract(props.list || []),
    };
  }

  private static _remapContract = map<TContract<Date, TOrderMeta>, TExtendedContract>(contract => ({
    ...contract,
    ordersActiveCount: length(
      filter<TOrderMeta>(whereEq({ status: ORDER_STATUS.APPROVED }), contract.orders || [])
    ),
    ordersCount: (contract.orders || []).length,
  }));

  public readonly state: IState = {
    list: [],
  };

  public isActionAllowed = (contract: TContract<Date, TOrderMeta>) => {
    const { user } = this.props;

    if (contract) {
      if (user.role === 'CUSTOMER_MANAGER') {
        if (contract.status === CONTRACT_STATUS.APPROVING) {
          return true;
        }

        if (
          contract.orders &&
          contract.orders.some((order: any) => order.status === ORDER_STATUS.APPROVING)
        ) {
          return true;
        }
      }

      if (user.role === 'BUYER_CURATOR') {
        if (contract.status === CONTRACT_STATUS.REJECTED) {
          return true;
        }

        if (
          contract.orders &&
          contract.orders.some((order: any) => order.status === ORDER_STATUS.REJECTED)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  public render() {
    if (this.props.user.status === 'fetching') {
      return null;
    }

    return (
      <FlexiTable
        tableProps={{
          id: 'contractTable',
          className: styles.styleTable,
        }}
        columns={columns}
        rowProps={rowData => ({
          onClick: () => this.props.onContractClick(rowData.id),
          actionAllowed: this.isActionAllowed(rowData),
        })}
        data={this.state.list}
        defaultSortBy={'dateFrom'}
        idKey={'id'}
      />
    );
  }
}

interface IProps {
  list: Array<TContract<Date, TOrderMeta>> | null;
  onContractClick: (id: TID) => void;
}

interface IState {
  list: Array<TContract<Date, TOrderMeta>>;
}
