import * as React from 'react';
import { Box } from 'grommet';
import { Head } from './components';
import { Case, Switch, Loader, Comments } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { RouteComponentProps } from 'react-router';
import { Main, DeliveryModal } from './components';
import { StepFiles } from './components/StepFiles';

const Error = () => <span>Error</span>;

@inject('activeDelivery', 'user')
@observer
export class DeliveryPage extends React.Component<
  IStores & RouteComponentProps<{ deliveryId: string }>
> {
  public componentWillMount() {
    const deliveryId = this.props.match.params.deliveryId;
    this.props.activeDelivery.get(deliveryId);
  }

  public componentWillUnmount() {
    this.props.activeDelivery.clearData();
  }

  public render(): React.ReactNode {
    const { activeDelivery } = this.props;

    return (
      <Box align="start" justify="between" margin={{ top: 'large' }}>
        <Switch condition={activeDelivery.getStatus}>
          <Case value={'fetching'}>
            <Loader />
          </Case>
          <Case value={'error'}>
            {/*<ContractError contract={contract}/>*/}
            <Error />
          </Case>
          <Case value={'success'}>
            <Head mode={activeDelivery.mode} setMode={this.setModeHandler} />
            <Box width={'calc(100% - 345px)'}>
              <Switch condition={activeDelivery.mode}>
                <Case value={'main'}>
                  <Main />
                </Case>
                <Case value={'files'}>
                  <Box margin={{ top: 'medium' }}>
                    <StepFiles />
                  </Box>
                </Case>
                <Case value={'comments'}>
                  {activeDelivery.data ? (
                    <Box margin={{ top: 'large' }}>
                      <Comments comments={activeDelivery.data.comments} />
                    </Box>
                  ) : null}
                </Case>
              </Switch>
            </Box>
          </Case>
        </Switch>
        <DeliveryModal />
      </Box>
    );
  }

  private setModeHandler = (mode: 'main' | 'history' | 'files') =>
    (this.props.activeDelivery.mode = mode);
}
