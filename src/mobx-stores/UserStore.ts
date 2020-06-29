import { action, computed, observable } from 'mobx';
import StoreConstructor from './StoreConstructor';
import { user as userService } from 'services';
import { Entities } from '../../entities';
import { statusFetching } from 'constants/types';

export default class UserStore extends StoreConstructor {
  @observable public userInfo: Entities.TUser | null = null;

  @observable public status: statusFetching = 'init';

  @observable public isAuthorized: boolean = false;

  @computed
  get role() {
    return this.userInfo ? this.userInfo.role : '';
  }

  @action.bound
  public init() {
    this.status = 'fetching';

    return userService
      .get()
      .then(this.initSuccess)
      .catch(this.showError);
  }

  @action.bound
  public login({ user, password }: { user: string; password: string }) {
    return userService.login(user, password).then(this.initSuccess);
  }

  @action.bound
  public logout() {
    return userService
      .logout()
      .then(this.logoutSuccess)
      .catch(err => {
        console.error('logout', err);
      });
  }

  @action.bound
  private showError(error: object) {
    this.status = 'error';

    console.error(error);
  }

  @action.bound
  private initSuccess(userInfo: Entities.TUser) {
    this.userInfo = userInfo;
    this.isAuthorized = true;

    this.stores.catalogs.init().then(() => (this.status = 'success'));
  }

  @action.bound
  private logoutSuccess() {
    this.status = 'init';

    for (const key in this.stores) {
      if (this.stores[key]) {
        if (this.stores[key].clearData) {
          this.stores[key].clearData();
        }

        if (this.stores[key].reset) {
          this.stores[key].reset();
        }
      }
    }

    this.userInfo = null;
    this.isAuthorized = false;
  }
}
