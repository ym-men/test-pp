import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { DeliveryAddComponent } from './DeliveryAddComponent';
import { Entities } from '../../../entities';
import { Box } from 'grommet';
import { BreadCrumbs, Loader, Error } from 'components/ui';
import { computed, observable } from 'mobx';
import TMTR = Entities.TMTR;
import TDelivery = Entities.TDelivery;

@inject(
  'activeContract',
  'activeOrder',
  'deliveries',
  'routing',
  'activeDelivery',
  'activeComplaint'
)
@observer
export class DeliveryAdd extends React.Component<
  IStores &
    RouteComponentProps<{
      contractId: string;
      orderId: string;
      mtrId: string;
      deliveryId?: string;
    }>
> {
  private mtr: TMTR = null;

  @observable private isAdditionalDelivery = false;

  public componentWillMount(): void {
    const { contractId, orderId, deliveryId, mtrId } = this.props.match.params;
    const { activeContract, activeOrder, deliveries, activeDelivery, activeComplaint } = this.props;

    activeContract.get(contractId);
    activeOrder.get(orderId);
    deliveries.getListByMtr(contractId, orderId, mtrId);

    if (deliveryId) {
      activeDelivery
        .get(deliveryId)
        .then((data: TDelivery) => activeComplaint.get(data.complaintId));
      this.isAdditionalDelivery = true;
    }
  }

  @computed
  private get isLoading() {
    const { activeContract, activeOrder } = this.props;
    return activeContract.getStatus === 'fetching' || activeOrder.getStatus === 'fetching';
  }

  @computed
  private get isError() {
    const { activeContract, activeOrder } = this.props;
    return activeContract.getStatus === 'error' || activeOrder.getStatus === 'error';
  }

  @computed
  public get isMtrReady(): boolean {
    if (this.isLoading) {
      return false;
    }

    const { data: order } = this.props.activeOrder;
    const { mtrId } = this.props.match.params;

    const mtr = order.mtrs.filter(i => i.id === mtrId)[0];
    this.mtr = mtr;

    return !!mtr;
  }

  public render(): React.ReactNode {
    if (this.isLoading) {
      return <Loader />;
    }

    if (this.isError || !this.isMtrReady) {
      return <Error />;
    }

    const { data: contract } = this.props.activeContract;
    const { data: order } = this.props.activeOrder;
    const { mtrId } = this.props.match.params;

    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="column">
        <BreadCrumbs />
        <DeliveryAddComponent
          mtr={this.mtr}
          documentTypes="delivery"
          stepTitle={this.isAdditionalDelivery ? 'Допоставка МТР' : 'Новая поставка'}
          isLoading={this.props.deliveries.isLoading}
          onSave={savedDelivery =>
            this.onSave({
              ...savedDelivery,
              orderNumber: order.number.toString(),
              contractNumber: contract.number,
              contractId: contract.id,
              orderId: order.id,
              supplier: contract.supplier,
              mtrId,
              parentComplaintId: this.isAdditionalDelivery
                ? this.props.activeDelivery.data.complaintId
                : undefined,
            })
          }
        />
      </Box>
    );
  }

  private onSave(delivery: TDelivery<Date>) {
    const { contractId, orderId, mtrId } = this.props.match.params;
    return this.props.deliveries.create(contractId, orderId, delivery).then((data: TDelivery) => {
      if (this.isAdditionalDelivery) {
        const additionalDeliveries = this.props.activeComplaint.data.additionalDeliveries || [];
        additionalDeliveries.push(data.id);

        this.props.activeComplaint.changeStatus('fix_approving', { additionalDeliveries });
      }

      this.props.routing.push(
        `/contracts/${contractId}/orders/${orderId}/mtrs/${mtrId}/deliveries`
      );
    });
  }
}
