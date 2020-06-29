import StoreConstructor from './StoreConstructor';
import { action, observable } from 'mobx';
import { POLL_INTERVAL } from 'constants/polling';
import { statusFetching } from 'constants/types';
import { IStores } from './stores';
import { TResponseList } from 'services/utils';

interface IService<T> {
  list(): Promise<TResponseList<T>>;
}

export class ListStoreConstructor<
  T extends { id: string; modified: string; pending: boolean }
> extends StoreConstructor {
  @observable public list: T[];
  @observable public status: statusFetching = 'init';

  private pollInterval = POLL_INTERVAL;

  private timerId: any = null;

  constructor(private service: IService<T>, stores: IStores, pollInterval?: number) {
    super(stores);

    this.pollInterval = pollInterval || POLL_INTERVAL;
  }

  @action.bound
  public startPolling() {
    this.stopPolling();
    this.timerId = setInterval(() => {
      this.getList();
    }, this.pollInterval);
  }

  @action.bound
  public stopPolling() {
    clearInterval(this.timerId);
  }

  @action.bound
  public reset() {
    this.list = [];
    this.status = 'init';
    this.stopPolling();
  }

  @action.bound
  public getList() {
    if (this.status === 'init') {
      this.status = 'first_fetching';
    } else {
      this.status = 'fetching';
    }

    return this.service
      .list()
      .then(this.getListSuccess)
      .catch(this.showError);
  }

  @action.bound
  protected showError(error: object) {
    this.status = 'error';

    console.error(error);
  }

  @action.bound
  private getListSuccess(response: TResponseList<T>) {
    this.status = 'success';
    this.list = response.content;

    return Promise.resolve(this.list);
  }
}
