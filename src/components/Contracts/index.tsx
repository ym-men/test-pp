import * as React from 'react';
import {
  ContractNew,
  ContractEdit,
  ContractDetails,
  OrderNew,
  OrderEdit,
  OrderDetails,
  MtrDetails,
} from './components';
import { Redirect, Switch } from 'react-router-dom';
import { RoleRoute } from 'components/router';
import { DeliveryListByMtr } from 'pages/DeliveryList/DeliveryListByMtr';
import { DeliveryAdd } from 'pages/DeliveryAdd';
import { DeliveryPage } from 'pages/Delivery';
import { ComplaintPage } from 'pages/Complaint';

export class ContractsPage extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <Switch>
        <RoleRoute
          roles={['BUYER_CURATOR']}
          exact={true}
          path="/contracts/new"
          component={ContractNew}
        />
        <RoleRoute
          roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId"
          component={ContractDetails}
        />
        <RoleRoute
          roles={['BUYER_CURATOR']}
          exact={true}
          path="/contracts/:contractId/edit"
          component={ContractEdit}
        />
        <RoleRoute
          roles={['BUYER_CURATOR']}
          exact={true}
          path="/contracts/:contractId/orders/new"
          component={OrderNew}
        />
        <RoleRoute
          roles={['BUYER_CURATOR']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/edit"
          component={OrderEdit}
        />
        <RoleRoute
          roles={['CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId/deliveries/new"
          component={DeliveryAdd}
        />
        <RoleRoute
          roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId/deliveries"
          component={DeliveryListByMtr}
        />
        <RoleRoute
          roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId/deliveries/:deliveryId"
          component={DeliveryPage}
        />
        <RoleRoute
          roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId/deliveries/:deliveryId/:complaintId"
          component={ComplaintPage}
        />
        <RoleRoute
          roles={['CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId/deliveries/:deliveryId/:complaintId/add-delivery"
          component={DeliveryAdd}
        />
        <RoleRoute
          roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId/mtrs/:mtrId"
          component={MtrDetails}
        />
        <RoleRoute
          roles={['BUYER_CURATOR', 'CUSTOMER_MANAGER']}
          exact={true}
          path="/contracts/:contractId/orders/:orderId"
          component={OrderDetails}
        />
        <Redirect to="/" />
      </Switch>
    );
  }
}
