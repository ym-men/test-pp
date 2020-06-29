import * as React from 'react';
import { Box } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { DeliverTable } from 'components/ui/DeliverTable';
import { columns } from './Table/operatorColumns';
import { Entities } from '../../../entities';
import TDelivery = Entities.TDelivery;
import { Loader } from 'components/ui/Item';

@inject('deliveries', 'routing')
@observer
export class DeliveryList extends React.Component<
  IStores & { onClick?: (delivery: TDelivery) => void }
> {
  constructor(props: any) {
    super(props);
    this.onDeliveryClick = this.onDeliveryClick.bind(this);
  }
  public componentWillMount(): void {
    this.props.deliveries.getList();
    this.props.deliveries.startPolling();
  }

  public componentWillUnmount() {
    this.props.deliveries.stopPolling();
  }

  public render(): React.ReactNode {
    if (this.props.deliveries.status === 'first_fetching') {
      return <Loader />;
    }

    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="column">
        <DeliverTable
          list={this.props.deliveries.list}
          columns={columns}
          onClick={this.onDeliveryClick}
        />
      </Box>
    );
  }

  private onDeliveryClick = (delivery: TDelivery): void => {
    return this.props.onClick
      ? this.props.onClick(delivery)
      : this.props.routing.push(`/deliveries/${delivery.id}`);
  };
}
