import * as React from 'react';
import { ContractForm } from '../ContractForm';
import { ContractError } from '../ContractError';
import { RouteComponentProps } from 'react-router';
import { Loader, Switch, Case } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../../entities';

@inject('activeContract', 'routing')
@observer
export class ContractEdit extends React.Component<
  Pick<IStores, 'activeContract'> &
    Pick<IStores, 'routing'> &
    RouteComponentProps<{ contractId: string }>
> {
  public componentWillMount() {
    const { contractId } = this.props.match.params;
    this.props.activeContract.get(contractId);
  }

  public render() {
    const { activeContract } = this.props;
    const { data: contract = {} as Entities.TContract } = activeContract;

    return (
      <Switch condition={activeContract.getStatus}>
        <Case value={'fetching'}>
          <Loader />
        </Case>
        <Case value={'error'}>
          <ContractError id={this.props.match.params.contractId} />
        </Case>
        <Case value={'success'}>
          <ContractForm
            onSave={this.onSave}
            documentTypes="contract"
            stepTitle={`Договор №${contract.number}`}
            contract={contract}
          />
        </Case>
      </Switch>
    );
  }

  protected onSave = () => {
    this.props.activeContract.update();
    this.props.routing.push('/contracts');
  };
}
