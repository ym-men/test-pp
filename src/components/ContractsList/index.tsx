import * as React from 'react';
import * as styles from './list.styl';
import { Box, Heading } from 'grommet';
import { Button } from 'components/ui';
import { hasRole } from 'hocs';
import { RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { computed, observable } from 'mobx';
import { TID } from 'interface';
import { ContractTable } from './ContractTable';
import { ControlTable } from 'pages/ControlsList/Table/ControlTable';
import { Tabs, Switch, Case } from 'components/ui';
import { DeliveryList } from 'pages/DeliveryList/DeliveryList';
import { Entities } from '../../../entities';
import TDelivery = Entities.TDelivery;
import { ComplaintList } from 'pages/ComplaintList';
import TComplaint = Entities.TComplaint;
import TControl = Entities.TControl;

const CustomerButton = hasRole(['BUYER_CURATOR'], Button);

type ModeTypes = 'control' | 'contracts' | 'delivery' | 'complaint';

@inject('routing', 'user', 'contracts')
@observer
export class ContractsList extends React.Component<RouteComponentProps & IStores> {
  @observable private mode: ModeTypes = 'contracts';

  @computed
  private get tabs() {
    return [
      {
        id: 'contracts',
        text: 'Договоры',
        className: styles.tab,
      },
      {
        id: 'control',
        text: 'Контроль',
        className: styles.tab,
      },
      {
        id: 'delivery',
        text: 'Поставки',
        className: styles.tab,
      },
      {
        id: 'complaint',
        text: 'Рекламации',
        className: styles.tab,
      },
    ];
  }

  public componentWillMount() {
    this.props.contracts.getList();
    this.props.contracts.startPolling();
  }

  public componentWillUnmount() {
    this.props.contracts.stopPolling();
  }

  public render(): React.ReactNode {
    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="column">
        <Box direction="row" margin={{ top: 'medium', bottom: 'medium' }} alignContent={'center'}>
          <Switch condition={this.mode}>
            <Case value="contracts">
              <Heading level="1" margin="none">
                Договоры
              </Heading>
              <Box margin={{ left: 'medium' }} alignSelf={'center'}>
                <CustomerButton
                  id="contract-contractsList-link-add"
                  to="/contracts/new"
                  btnType={'link'}
                >
                  Добавить договор
                </CustomerButton>
              </Box>
            </Case>
            <Case value="control">
              <Heading level="1" margin="none">
                Инспекционный контроль
              </Heading>
            </Case>
            <Case value="delivery">
              <Heading level="1" margin="none">
                Поставки
              </Heading>
            </Case>
            <Case value="complaint">
              <Heading level="1" margin="none">
                Рекламации
              </Heading>
            </Case>
          </Switch>
        </Box>

        <Box direction="row" fill="horizontal" justify="between">
          <Tabs
            selected={this.mode}
            onChange={this.toggleMode}
            tabs={this.tabs}
            className={styles.tabs}
          />
        </Box>

        <Switch condition={this.mode}>
          <Case value="contracts">
            <Box margin={{ top: 'large' }}>
              <ContractTable
                list={this.props.contracts.list}
                onContractClick={this.onContractClick}
              />
            </Box>
          </Case>
          <Case value="control">
            <ControlTable onClick={this.onControlClick} />
          </Case>
          <Case value="delivery">
            <DeliveryList onClick={this.onDeliveryClick} />
          </Case>
          <Case value="complaint">
            <ComplaintList onClick={this.onComplaintClick} />
          </Case>
        </Switch>
      </Box>
    );
  }

  private toggleMode = (mode: ModeTypes) => {
    this.mode = mode;
    // this.props.routing.push(mode === 'control' ? `/controls` : `/contracts`);
  };

  private onControlClick = (control: TControl): void => {
    this.props.history.push(`/controls/${control.id}`);
  };

  private onContractClick = (id: TID): void => {
    this.props.history.push(`/contracts/${id}`);
  };

  private onDeliveryClick = (delivery: TDelivery): void => {
    this.props.routing.push(
      `/contracts/${delivery.contractId}/orders/${delivery.orderId}/mtrs/${
        delivery.mtrId
      }/deliveries/${delivery.id}`
    );
  };

  private onComplaintClick = (data: TComplaint): void => {
    this.props.routing.push(
      `/contracts/${data.contractId}/orders/${data.orderId}/mtrs/${data.mtrId}/deliveries/${
        data.deliveryId
      }/complaint`
    );
  };
}
