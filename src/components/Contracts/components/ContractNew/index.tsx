import * as React from 'react';
import { ContractForm } from '../ContractForm';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';

@inject('activeContract')
@observer
export class ContractNew extends React.Component<Pick<IStores, 'activeContract'>> {
  public render() {
    const { activeContract } = this.props;
    return (
      <ContractForm
        documentTypes="contract"
        isLoading={activeContract.isCreateLoading}
        onSave={this.props.activeContract.create}
      />
    );
  }
}
