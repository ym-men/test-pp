import { action, observable, computed, toJS } from 'mobx';
import { contracts as contractsService } from 'services';
import { Entities } from '../../entities';
import { statusFetching } from 'constants/types';
import TContract = Entities.TContract;
import { ActiveStoreConstructor } from './ActiveStoreConstructor';
import { IStores } from './stores';

export default class ActiveContractStore extends ActiveStoreConstructor<TContract> {
  @observable public data: TContract;
  @observable public createStatus: statusFetching = 'init';
  @observable public updateStatus: statusFetching = 'init';
  @observable public approveStatus: statusFetching = 'init';
  @observable public rejectStatus: statusFetching = 'init';

  @computed
  public get isCreateLoading() {
    return this.createStatus === 'fetching';
  }

  constructor(stores: IStores) {
    super(contractsService, stores);
    this.forceUpdate = true;
  }

  public getContractCache(contractId: string) {
    if (this.data && String(this.data.id) === contractId) {
      return Promise.resolve(this.data);
    } else {
      return this.get(contractId);
    }
  }

  @action.bound
  public create() {
    this.createStatus = 'fetching';
    this.data = { ...this.data, type: this.stores.catalogs.getContractCodeByType(this.data) };

    return contractsService
      .create(this.data)
      .then(this.setData)
      .then(() => {
        this.createStatus = 'success';
        this.stores.routing.push(`/contracts/${this.data.id}`);
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

    return contractsService
      .update(this.mapContract(toJS(this.data)))
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

    return contractsService
      .approve(this.mapContract(newData))
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
      author: this.stores.user.userInfo.displayName,
      text: comment,
      date: new Date(),
    });

    return contractsService
      .reject(this.mapContract(newData))
      .then(this.setData)
      .then(() => (this.rejectStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.rejectStatus = 'error';
      });
  }

  @action.bound
  private mapContract(data: TContract) {
    return {
      ...data,
      type: this.stores.catalogs.getContractCodeByType(data),
      status: this.data.status.toUpperCase(),
    } as TContract;
  }
}
