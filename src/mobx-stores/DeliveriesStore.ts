import { action, computed } from 'mobx';
import { delivery as deliveryService } from 'services';
import { Entities } from '../../entities';
import { TResponseList } from 'services/utils';
import { TID } from 'interface';

import TDelivery = Entities.TDelivery;
import { POLL_INTERVAL } from 'constants/polling';
import { ListStoreConstructor } from './ListStoreConstructor';
import { IStores } from './stores';

export default class DeliveriesStore extends ListStoreConstructor<TDelivery> {
  @computed
  public get isLoading() {
    return this.status === 'fetching';
  }

  private mtrCodeCache: TID;
  private timerByMtrId: any = null;

  constructor(stores: IStores) {
    super(deliveryService, stores);
  }

  @action.bound
  public getListByMtr(contractId: string, orderId: string, mtrId: string) {
    this.status = 'fetching';
    return deliveryService
      .mtrList(contractId, orderId, mtrId)
      .then(this.getListByMtrSuccess)
      .then(() => (this.mtrCodeCache = mtrId))
      .catch(this.showError);
  }

  public getListByMtrCache(contractId: string, orderId: string, mtrId: string) {
    if (this.list && String(this.mtrCodeCache) === String(mtrId)) {
      return Promise.resolve(this.list);
    } else {
      return this.getListByMtr(contractId, orderId, mtrId);
    }
  }

  @action.bound
  public create(
    contractId: string,
    orderId: string,
    delivery: TDelivery<Date>
  ): Promise<void | TDelivery<Date>> {
    this.status = 'fetching';

    return deliveryService
      .create(contractId, orderId, delivery)
      .then(this.getSuccess)
      .catch(this.showError);
  }

  @action.bound
  public startPollingByMtr(contractId: string, orderId: string, mtrId: string) {
    this.stopPollingByMtr();
    this.timerByMtrId = setInterval(() => {
      this.getListByMtr(contractId, orderId, mtrId);
    }, POLL_INTERVAL);
  }

  @action.bound
  public stopPollingByMtr() {
    clearInterval(this.timerByMtrId);
  }

  @action.bound
  private getSuccess(response: TDelivery<Date>) {
    this.status = 'success';
    return response;
  }

  @action.bound
  private getListByMtrSuccess(response: TResponseList<TDelivery<Date>>) {
    this.status = 'success';
    this.list = response.content;
    return Promise.resolve(this.list);
  }
}
