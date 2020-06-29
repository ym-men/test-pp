import StoreConstructor from './StoreConstructor';
import { action, observable, autorun, computed } from 'mobx';
import { POLL_INTERVAL } from 'constants/polling';
import { statusFetching } from 'constants/types';
import { IStores } from './stores';

interface IService<T> {
  get(id: string): Promise<T>;
}

export class ActiveStoreConstructor<
  T extends { id: string; modified: string; pending: boolean }
> extends StoreConstructor {
  @computed
  get pending() {
    return this.data ? this.data.pending : false;
  }

  @observable public data: T;
  @observable public getStatus: statusFetching = 'init';

  protected forceUpdate = false;
  private timerId: any = null;

  constructor(private service: IService<T>, stores: IStores) {
    super(stores);
    autorun(() => {
      if (this.data) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    });
  }

  @action.bound
  public clearData() {
    this.data = undefined;
    this.getStatus = 'init';
  }

  @action.bound
  public get(id: string) {
    this.getStatus = 'fetching';

    return this.service
      .get(id)
      .then(this.setData)
      .then(() => {
        this.getStatus = 'success';

        return this.data;
      })
      .catch(error => {
        console.error(error);
        this.getStatus = 'error';
        throw error;
      });
  }

  @action.bound
  protected startPolling() {
    this.stopPolling();
    this.timerId = setInterval(() => {
      this.service.get(this.data.id).then(this.setData);
    }, POLL_INTERVAL);
  }

  @action.bound
  protected stopPolling() {
    clearInterval(this.timerId);
  }

  @action.bound
  protected setData(response: T) {
    if (this.forceUpdate) {
      this.data = response;
    }
    if (!this.data) {
      this.data = response;
    }

    // if (this.data.modified !== response.modified) {
    //   this.data = response;
    // }

    if (this.data.id !== response.id) {
      this.data = response;
    }

    if (this.data.pending && !response.pending) {
      this.data = response;
    }

    if (response.pending) {
      this.data.pending = true;
    }

    return Promise.resolve(this.data);
  }
}
