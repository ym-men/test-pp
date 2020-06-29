import { action, observable, computed, toJS } from 'mobx';
import { orders as ordersService } from 'services';
import { Entities } from '../../entities';
import { statusFetching } from 'constants/types';
import TOrder = Entities.TOrder;
import TDocument = Entities.TDocument;
import { ActiveStoreConstructor } from './ActiveStoreConstructor';
import { IStores } from './stores';

export default class ActiveOrderStore extends ActiveStoreConstructor<TOrder> {
  @observable public data: TOrder;
  @observable public getStatus: statusFetching = 'init';
  @observable public createStatus: statusFetching = 'init';
  @observable public updateStatus: statusFetching = 'init';
  @observable public approveStatus: statusFetching = 'init';
  @observable public rejectStatus: statusFetching = 'init';

  @computed
  public get isCreateLoading() {
    return this.createStatus === 'fetching';
  }

  constructor(stores: IStores) {
    super(ordersService, stores);
    this.forceUpdate = true;
  }

  public getOrderCache(orderId: string) {
    if (this.data && this.data.id === orderId) {
      return Promise.resolve(this.data);
    } else {
      return this.get(orderId);
    }
  }

  @action.bound
  public create(order: Entities.TOrder) {
    this.createStatus = 'fetching';
    this.data = order;
    return ordersService
      .create(this.data)
      .then(this.setData)
      .then(() => {
        this.createStatus = 'success';
        this.stores.routing.push(`/contracts/${this.stores.activeContract.data.id}`);
        return Promise.resolve();
      })
      .catch(() => {
        this.createStatus = 'error';
      });
  }

  @action.bound
  public update() {
    this.updateStatus = 'fetching';
    this.data.pending = true;

    return ordersService
      .update(this.data)
      .then(this.setData)
      .then(() => (this.updateStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.updateStatus = 'error';
      });
  }

  @action.bound
  public approve() {
    this.approveStatus = 'fetching';
    this.data.pending = true;

    const newData = toJS(this.data);
    newData.status = 'approved';

    return ordersService
      .approve(newData)
      .then(this.setData)
      .then(() => (this.approveStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.approveStatus = 'error';
      });
  }

  @action.bound
  public reject(comment: string) {
    this.rejectStatus = 'fetching';
    this.data.pending = true;

    const newData = toJS(this.data);
    newData.status = 'rejected';

    newData.comments.push({
      text: comment,
      author: this.stores.user.userInfo.displayName,
      date: new Date(),
    });

    return ordersService
      .reject(newData)
      .then(this.setData)
      .then(() => (this.rejectStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.rejectStatus = 'error';
      });
  }

  public onChangeForm = (newValue: any, oldValue: any, field: string) => {
    this.data = {
      ...this.data,
      [field]: newValue,
      mtrs: (this.data.mtrs || [])
        .filter(Boolean)
        .map(mtr => ({ ...mtr, dateFrom: mtr.date[0], dateTo: mtr.date[1] })),
    };
  };

  public onChangeFiles = (documents: Array<TDocument>) => {
    this.data = { ...this.data, documents };
  };

  public onRemoveDocument = (id: string): void => {
    this.data = {
      ...this.data,
      documents: (this.data.documents || []).filter(d => d.id !== id),
    };
  };
}
