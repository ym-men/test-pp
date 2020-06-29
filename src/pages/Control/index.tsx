import * as React from 'react';
import { Box } from 'grommet';
import { ContentHead, ControlMain, StatusInfo, ControlAction } from './components';
import { Case, Switch, Loader, Comments } from 'components/ui';
import { StepFiles } from './components/StepFiles';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { IStores } from 'mobx-stores/stores';
import { RouteComponentProps } from 'react-router';

const Error = () => <span>Error</span>;

@inject('activeControl', 'catalogs', 'user')
@observer
export class ControlDetails extends React.Component<
  IStores & RouteComponentProps<{ controlId: string }>
> {
  @observable private mode: 'main' | 'history' | 'files' | 'notifications' | 'reports' = 'main';

  public componentWillMount() {
    const { controlId } = this.props.match.params;
    this.props.activeControl.get(controlId);
  }

  public componentWillUnmount() {
    this.props.activeControl.clearData();
  }

  public render(): React.ReactNode {
    const { activeControl } = this.props;

    return (
      <Box align="start" justify="between" margin={{ top: 'large' }}>
        <Switch condition={this.props.activeControl.getStatus}>
          <Case value={'fetching'}>
            <Loader />
          </Case>
          <Case value={'error'}>
            {/*<ContractError contract={contract}/>*/}
            <Error />
          </Case>
          <Case value={'success'}>
            <ContentHead mode={this.mode} setMode={this.setModeHandler} />
            <Box width="100%" direction="row">
              <Box width="100%" margin={{ right: '42px' }}>
                <Switch condition={this.mode}>
                  <Case value={'main'}>
                    <ControlMain />
                  </Case>
                  <Case value={'comments'}>
                    {activeControl.data ? (
                      <Box margin={{ top: 'large' }}>
                        <Comments comments={activeControl.data.comments} />
                      </Box>
                    ) : null}
                  </Case>
                  <Case value={'files'}>
                    <Box margin={{ top: 'medium' }}>
                      <StepFiles mode={this.mode as 'files' | 'notifications' | 'reports'} />
                    </Box>
                  </Case>
                  <Case value={'notifications'}>
                    <Box margin={{ top: 'medium' }}>
                      <StepFiles mode={this.mode as 'files' | 'notifications' | 'reports'} />
                    </Box>
                  </Case>
                  <Case value={'reports'}>
                    <Box margin={{ top: 'medium' }}>
                      <StepFiles mode={this.mode as 'files' | 'notifications' | 'reports'} />
                    </Box>
                  </Case>
                </Switch>
              </Box>
              <Box style={{ minWidth: '300px' }}>
                <StatusInfo control={activeControl.data} />
                <ControlAction />
              </Box>
            </Box>
          </Case>
        </Switch>
      </Box>
    );
  }

  private setModeHandler = (mode: 'main' | 'history' | 'files') => (this.mode = mode);
}
