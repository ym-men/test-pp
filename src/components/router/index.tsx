import * as React from 'react';
import { Redirect, Route, RouteProps, RedirectProps } from 'react-router';
import { Entities } from '../../../entities';
import TRoles = Entities.TRoles;
import { IStores } from 'mobx-stores/stores';
import { observer, inject } from 'mobx-react';

@inject('user')
@observer
export class LoginRoute extends React.Component<RouteProps & Pick<IStores, 'user'>> {
  public render() {
    const { user, ...rest } = this.props;
    return <ConditionRouter condition={!user.isAuthorized} {...rest} />;
  }
}

export const ConditionRouter = ({ condition, redirect, ...rest }: TConditionRoute) =>
  condition ? <Route {...rest} /> : <Redirect to={redirect || '/'} />;

// tslint:disable-next-line:max-classes-per-file
@inject('user')
@observer
export class RoleRoute extends React.Component<
  IRedirect & { roles: TRoles[] } & RouteProps & Pick<IStores, 'user'>
> {
  public render() {
    const { user, roles, ...rest } = this.props;
    return <ConditionRouter condition={user && roles.includes(user.role as TRoles)} {...rest} />;
  }
}

// tslint:disable-next-line:max-classes-per-file
@inject('user')
@observer
export class RoleRedirect extends React.Component<TRoleRedirect & Pick<IStores, 'user'>> {
  public render() {
    const { user, rolesOptions, ...rest } = this.props;
    const props = rolesOptions.filter(
      item => !item.roles || item.roles.includes(user.role as TRoles)
    )[0];
    return <Redirect {...{ ...rest, ...props }} />;
  }
}
type TConditionRoute = IRedirect & ICondition & RouteProps;
type TRoleRedirect = Partial<RedirectProps> & {
  rolesOptions: Array<{ roles?: TRoles[]; to: string }>;
};

interface IRedirect {
  redirect?: string;
}

interface ICondition {
  condition?: boolean;
}
