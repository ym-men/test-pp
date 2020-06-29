import * as React from 'react';
import { OrderForm } from '../OrderForm';
import { ContractError } from '../ContractError';
import { Case, Loader, Switch } from 'components/ui';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../../entities';

@inject('activeContract', 'routing', 'activeOrder')
@observer
export class OrderNew extends React.Component<TProps> {
  public componentWillMount() {
    const { contractId } = this.props.match.params;
    this.props.activeContract.get(contractId);
  }

  public render(): React.ReactNode {
    const { activeContract, activeOrder } = this.props;
    const { data: contract = {} as Entities.TContract } = activeContract;
    const order = ({
      contractId: contract.id,
      supplier: contract.supplier,
      contractNumber: contract.number,
    } as any) as Entities.TOrder & { contractNumber: string };

    return (
      <Switch condition={activeContract.getStatus}>
        <Case value={'fetching'}>
          <Loader />
        </Case>
        <Case value={'error'}>
          <ContractError id={this.props.match.params.contractId} />
        </Case>
        <Case value={'success'}>
          <OrderForm
            onSave={activeOrder.create}
            order={order}
            isCreateLoading={activeOrder.isCreateLoading}
          />
        </Case>
      </Switch>
    );
  }
}

type TProps = Pick<IStores, 'activeContract'> &
  Pick<IStores, 'activeOrder'> &
  Pick<IStores, 'routing'> &
  RouteComponentProps<{ contractId: string }>;
