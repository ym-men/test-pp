import * as React from 'react';
import * as styles from './styles.styl';
import { Box, Text } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { DeliverTable } from 'components/ui/DeliverTable';
import { deliverListColumns } from './Table/deliverListColumns';
import { RouteComponentProps } from 'react-router';
import { If, BreadCrumbs, Loader } from 'components/ui';
import { DeliveryInfo } from './DeliveryInfo';
import { Entities } from '../../../entities';
import { hasRole } from 'hocs';
import { Button } from 'components/ui/Button';
import TMTR = Entities.TMTR;

const DeliveryAddButton = hasRole(['CUSTOMER_MANAGER'], Button);

@inject('activeContract', 'activeOrder', 'deliveries', 'routing')
@observer
export class DeliveryListByMtr extends React.Component<
  IStores & RouteComponentProps<{ contractId: string; orderId: string; mtrId: string }>
> {
  public componentWillMount() {
    const { contractId, orderId, mtrId } = this.props.match.params;
    this.props.activeContract.get(contractId);
    this.props.activeOrder.get(orderId);
    this.props.deliveries.getListByMtr(contractId, orderId, mtrId);
    this.props.deliveries.startPollingByMtr(contractId, orderId, mtrId);
  }

  public componentWillUnmount() {
    this.props.deliveries.stopPollingByMtr();
  }

  public render(): React.ReactNode {
    const { data: contract } = this.props.activeContract;
    const { data: order } = this.props.activeOrder;
    const { deliveries } = this.props;

    if (deliveries.status === 'first_fetching' || !contract || !order) {
      return <Loader />;
    }

    const { contractId, orderId, mtrId } = this.props.match.params;
    const mtr = order.mtrs.find((m: TMTR) => m.id === mtrId);

    // TODO: research
    if (!mtr || !deliveries.list) {
      return <Loader />;
    }

    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="row">
        <Box margin={{ top: 'large', right: 'large' }} width={'100%'} direction="column">
          <If condition={contract && order}>
            <BreadCrumbs />
          </If>
          <Box
            direction="row"
            margin={{ top: 'medium', bottom: 'large' }}
            alignContent={'center'}
            width={'100%'}
          >
            <Box margin={{ right: 'small' }} alignSelf={'center'} width={'100%'}>
              <Text className={styles.contractHeadText}>
                Поставки по разнарядке № {order.number}
              </Text>
            </Box>
            <Box margin={{ left: 'medium' }} width="500px" align="center">
              <DeliveryAddButton
                id="delivery-deliveryListByMtr-button-add"
                btnType="link"
                to={`deliveries/new`}
              >
                Добавить поставку
              </DeliveryAddButton>
            </Box>
          </Box>
          <DeliverTable
            list={this.props.deliveries.list}
            columns={deliverListColumns}
            onClick={delivery =>
              this.props.routing.push(
                `/contracts/${contractId}/orders/${orderId}/mtrs/${mtrId}/deliveries/${delivery.id}`
              )
            }
          />
        </Box>
        <Box margin={{ top: '120px' }}>
          <DeliveryInfo
            mtrCode={mtr.code}
            supplier={String(order.supplier)}
            number={String(order.number)}
            length={this.props.deliveries.list.length}
            hasPermissionToShip={mtr.hasPermissionToShip}
            inspectionNeeded={mtr.inspectionNeeded}
          />
        </Box>
      </Box>
    );
  }
}
