import * as React from 'react';
import { OrderForm } from '../OrderForm';
import { Loader } from 'components/ui';
import { RouteComponentProps } from 'react-router';
import { OrderError } from '../OrderError';
import { Box } from 'grommet';
import { IStores } from 'mobx-stores/stores';
import { observer, inject } from 'mobx-react';
import { Entities } from '../../../../../entities';
import TOrder = Entities.TOrder;
import TContract = Entities.TContract;

@inject('activeOrder', 'routing', 'activeContract')
@observer
export class OrderEdit extends React.Component<
  RouteComponentProps<{ contractId: string; orderId: string }> &
    Pick<IStores, 'activeOrder'> &
    Pick<IStores, 'activeContract'> &
    Pick<IStores, 'routing'>
> {
  public componentWillMount() {
    const { orderId, contractId } = this.props.match.params;
    this.props.activeOrder.get(orderId);
    this.props.activeContract.get(contractId);
  }

  public render(): React.ReactNode {
    const { activeOrder, activeContract } = this.props;

    const contract = activeContract.data || ({} as TContract);

    if (!activeContract.data) {
      return <Loader />;
    }

    const order = {
      ...activeOrder.data,
      contractNumber: contract.number,
      contractId: contract.id,
      supplier: contract.supplier,
    } as TOrder;

    return (
      <Box>
        {activeOrder.getStatus === 'fetching' && <Loader />}
        {activeOrder.getStatus === 'error' && <OrderError id={this.props.match.params.orderId} />}
        {activeOrder.getStatus === 'success' && (
          <OrderForm onSave={this.onSave} order={order}>
            Разнарядка №<br />
            {order.number}
          </OrderForm>
        )}
      </Box>
    );
  }

  private onSave = (order: Entities.TOrder) => {
    this.props.activeOrder.data = order;
    this.props.activeOrder.update();
    this.props.routing.push(`/contracts/${order.contractId}`);
  };
}
