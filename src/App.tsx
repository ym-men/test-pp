import * as React from 'react';
import * as styles from './App.styl';
import { Box, Grommet } from 'grommet';
import { Head, ContractsPage, ContractsList, LoginPage, Modals } from './components';
import { ControlsList } from 'pages/ControlsList/List';
import { ControlDetails } from 'pages/Control';
import { Components } from './components/Components';
import { Theme } from './theme/theme';
import { Route, Switch } from 'react-router-dom';
import { LocationDescriptorObject } from 'history';
import { Loader } from './components/ui';
import { LoginRoute, RoleRoute, RoleRedirect } from 'components/router';
import { IStores } from 'mobx-stores/stores';
import { inject, observer } from 'mobx-react';
import { DeliveryPage } from 'pages/Delivery';
import { ComplaintPage } from 'pages/Complaint';
import { FormExample } from 'pages/FormExample';
import { DeliveryAdd } from './pages/DeliveryAdd';
import { FormConstructorExample } from './pages/FormConstructorExample';

@inject('user')
@observer
class App extends React.Component<IState & IStores & { location: LocationDescriptorObject<any> }> {
  public componentWillMount(): void {
    this.props.user.init();
  }

  public render() {
    const { user } = this.props;

    const isLoading = user.status === 'fetching';

    return (
      <Grommet theme={Theme} full={true} plain={true}>
        <Box margin={{ left: 'calc(100vw - 100%)' }}>
          <Box
            pad={{ horizontal: 'large' }}
            margin={'auto'}
            width={'1396px'}
            style={{ minWidth: 1360 }}
          >
            <Head />
            <Box direction="row" align="start" width={'100%'}>
              {isLoading && <Loader />}
              {!isLoading && (
                <Box className={styles.content} fill="horizontal">
                  <Switch>
                    <Route exact={true} path="/demo">
                      <Components />
                    </Route>

                    <Route exact={true} path="/form-demo">
                      <FormExample />
                    </Route>

                    <Route exact={true} path="/form-constructor-demo">
                      <FormConstructorExample />
                    </Route>

                    <LoginRoute exact={true} path="/login" component={LoginPage} />

                    <RoleRoute
                      roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
                      redirect={'/login'}
                      exact={true}
                      path="/contracts"
                      component={ContractsList}
                    />

                    <RoleRoute
                      roles={['BUYER_CURATOR', 'BUYER_QUALITY_MANAGER', 'OUTSIDE_INSPECTOR']}
                      redirect={'/login'}
                      exact={true}
                      path="/controls"
                      component={ControlsList}
                    />

                    <RoleRoute
                      roles={[
                        'BUYER_QUALITY_MANAGER',
                        'OUTSIDE_INSPECTOR',
                        'CUSTOMER_MANAGER',
                        'BUYER_CURATOR',
                      ]}
                      redirect={'/login'}
                      exact={true}
                      path="/controls/:controlId"
                      component={ControlDetails}
                    />

                    <RoleRoute
                      roles={['CUSTOMER_MANAGER', 'BUYER_CURATOR']}
                      redirect={'/login'}
                      exact={true}
                      path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId/controls/:controlId"
                      component={ControlDetails}
                    />

                    <RoleRoute
                      roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
                      path="/contracts/:contractId"
                      component={ContractsPage}
                    />

                    <RoleRoute
                      roles={['BUYER_QUALITY_MANAGER', 'CUSTOMER_MANAGER']}
                      path="/deliveries/:deliveryId/:complaintId"
                      component={ComplaintPage}
                    />

                    <RoleRoute
                      roles={['CUSTOMER_MANAGER']}
                      exact={true}
                      path="/deliveries/:deliveryId/:complaintId/add-delivery"
                      component={DeliveryAdd}
                    />

                    <RoleRoute
                      roles={['BUYER_OPERATOR', 'BUYER_QUALITY_MANAGER', 'CUSTOMER_MANAGER']}
                      path="/deliveries/:deliveryId"
                      component={DeliveryPage}
                    />

                    <RoleRoute
                      roles={['BUYER_OPERATOR', 'BUYER_QUALITY_MANAGER']}
                      path="/deliveries"
                      component={ControlsList}
                    />

                    <RoleRoute
                      roles={['BUYER_QUALITY_MANAGER']}
                      path="/complaints"
                      component={ControlsList}
                    />

                    <RoleRedirect
                      rolesOptions={[
                        {
                          roles: ['BUYER_CURATOR', 'CUSTOMER_MANAGER'],
                          to: '/contracts',
                        },
                        {
                          roles: ['BUYER_QUALITY_MANAGER', 'OUTSIDE_INSPECTOR'],
                          to: '/controls',
                        },
                        {
                          roles: ['BUYER_OPERATOR'],
                          to: '/deliveries',
                        },
                        {
                          to: '/login',
                        },
                      ]}
                    />
                  </Switch>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Modals />
      </Grommet>
    );
  }
}

export default App;

interface IState {
  showSidebar: boolean;
}
