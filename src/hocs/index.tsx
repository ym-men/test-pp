import * as React from 'react';
import { Entities } from '../../entities';
import TRoles = Entities.TRoles;
import { If } from '../components/ui/If';
import TContract = Entities.TContract;
import TContractStatus = Entities.TContractStatus;
import { IStores } from 'mobx-stores/stores';
import { observer, inject } from 'mobx-react';

@inject('user')
@observer
class RoleItem extends React.Component<
  Pick<IStores, 'user'> & { roles: TRoles[] } & { component: any }
> {
  public render() {
    const { user, roles, component, ...props } = this.props;
    const Component = component;

    return (
      <If condition={user.userInfo && roles.includes(user.role as TRoles)}>
        <Component {...props} />
      </If>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
@inject('activeContract')
@observer
class WrapContractCondition extends React.Component<
  Pick<IStores, 'activeContract'> & { component: any; cb: any }
> {
  public render() {
    const { activeContract, component, cb, ...props } = this.props;
    const Component = component;
    return (
      <If condition={cb(activeContract.data)}>
        <Component {...props} />
      </If>
    );
  }
}

export const hasRole: <T>(roles: Array<TRoles | null>, Component: T) => T = (
  roles: TRoles[],
  Component: any
) => {
  // tslint:disable-next-line:max-classes-per-file
  return class extends React.Component {
    public render() {
      return <RoleItem roles={roles} component={Component} {...this.props} />;
    }
  } as any;
};

export const contractCondition: <T>(
  callback: (contract: TContract) => boolean,
  component: T
) => T = (cb: any, Component: any) => {
  // tslint:disable-next-line:max-classes-per-file
  return class extends React.Component {
    public render() {
      return <WrapContractCondition component={Component} cb={cb} {...this.props} />;
    }
  } as any;
};

export const isContractStatus: <T>(
  list: Array<TContractStatus> | TContractStatus,
  Component: T
) => T = (list, component) => {
  return contractCondition(contract => {
    return Array.isArray(list) ? list.includes(contract.status) : contract.status === list;
  }, component);
};
