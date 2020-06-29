import * as React from 'react';
import { LoginForm } from './components/LoginForm';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { observable } from 'mobx';

@inject('user')
@observer
export class LoginPage extends React.Component<Pick<IStores, 'user'>> {
  @observable
  private error = '';
  public render(): React.ReactNode {
    return <LoginForm error={this.error} onLogin={this.onLogin} />;
  }

  private onLogin = async (data: IUserLogin) => {
    await this.props.user.login(data).catch(err => (this.error = err));
  };
}

interface IUserLogin {
  user: string;
  password: string;
}
