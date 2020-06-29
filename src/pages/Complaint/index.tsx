import * as React from 'react';
import { Box } from 'grommet';
import { Head } from './components/Head';
import { Case, Switch, Loader, Comments } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { RouteComponentProps } from 'react-router';
import { Main } from './components/Main';
import { StepFiles } from './components/StepFiles';

const Error = () => <span>Error</span>;

@inject('activeDelivery', 'activeComplaint', 'user')
@observer
export class ComplaintPage extends React.Component<
  IStores & RouteComponentProps<{ deliveryId: string }>
> {
  public componentWillMount() {
    const deliveryId = this.props.match.params.deliveryId;
    this.props.activeDelivery
      .get(deliveryId)
      .then(() => this.props.activeComplaint.get(this.props.activeDelivery.data.complaintId));
  }

  public componentWillUnmount() {
    this.props.activeDelivery.clearData();
    this.props.activeComplaint.clearData();
  }

  public render(): React.ReactNode {
    const { activeComplaint } = this.props;
    return (
      <Box align="start" justify="between" margin={{ top: 'large' }}>
        <Switch condition={activeComplaint.getStatus}>
          <Case value={'fetching'}>
            <Loader />
          </Case>
          <Case value={'error'}>
            <Error />
          </Case>
          <Case value={'success'}>
            <Head mode={activeComplaint.mode} setMode={this.setModeHandler} />
            <Box width={'calc(100% - 345px)'}>
              <Switch condition={activeComplaint.mode}>
                <Case value={'main'}>
                  <Main />
                </Case>
                <Case value={'files'}>
                  <Box margin={{ top: 'medium' }}>
                    <StepFiles />
                  </Box>
                </Case>
                <Case value={'comments'}>
                  {activeComplaint.data ? (
                    <Box margin={{ top: 'large' }}>
                      <Comments comments={activeComplaint.data.comments} />
                    </Box>
                  ) : null}
                </Case>
              </Switch>
            </Box>
          </Case>
        </Switch>
      </Box>
    );
  }

  private setModeHandler = (mode: 'main' | 'history' | 'files') =>
    (this.props.activeComplaint.mode = mode);
}
