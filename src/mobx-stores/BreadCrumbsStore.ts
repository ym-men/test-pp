import StoreConstructor from './StoreConstructor';
import { observable, computed, action, autorun } from 'mobx';
import { IParams, IBreadCrumb } from 'components/ui';
import * as _ from 'lodash';
import { Entities } from '../../entities';
import { IStores } from './stores';
import TMTR = Entities.TMTR;

export type IConfig = {
  keyParam: string;
  isNeed: (params: IParams) => boolean;
  loadData: (stores: IStores, params: IParams) => Promise<any>;
  getText: (stores: IStores, params: IParams) => string;
  getLink: (stores: IStores, params: IParams) => string;
};

export default class BreadCrumbsStore extends StoreConstructor {
  public config: IConfig[] = [
    {
      keyParam: 'controlId',
      isNeed: params => (params.controlId ? true : false),
      loadData: () => Promise.resolve(),
      getText: () => `Все проверки`,
      getLink: stores =>
        ['BUYER_CURATOR', 'CUSTOMER_MANAGER'].indexOf(stores.user.role) > -1
          ? '/contracts'
          : '/controls',
    },
    {
      keyParam: 'contractId',
      isNeed: params => (params.contractId ? true : false),
      loadData: () => Promise.resolve(),
      getText: () => `Все договоры`,
      getLink: () => `/contracts/`,
    },
    {
      keyParam: 'orderId',
      isNeed: params => (params.orderId ? true : false),
      loadData: (stores, params) => stores.activeContract.getContractCache(params.contractId),
      getText: stores => `Договор № ${stores.activeContract.data.number}`,
      getLink: stores => `/contracts/${stores.activeContract.data.id}`,
    },
    {
      keyParam: 'mtrId',
      isNeed: params => (params.mtrId ? true : false),
      loadData: (stores, params) => stores.activeOrder.getOrderCache(params.orderId),
      getText: stores => `Разнарядка № ${stores.activeOrder.data.number}`,
      getLink: stores =>
        `/contracts/${stores.activeContract.data.id}/orders/${stores.activeOrder.data.id}`,
    },
    {
      keyParam: 'deliveryId',
      isNeed: params => (params.deliveryId ? true : false),
      getText: (stores, params) => {
        if (params.orderId) {
          return `Поставки по разнарядке № ${stores.activeOrder.data.number}`;
        } else {
          return 'Все поставки';
        }
      },
      loadData: (stores, params) =>
        params.orderId
          ? stores.deliveries.getListByMtrCache(
              stores.activeContract.data.id,
              stores.activeOrder.data.id,
              params.mtrId
            )
          : Promise.resolve(true),
      getLink: (stores, params) => {
        if (params.orderId) {
          const mtr = stores.activeOrder.data.mtrs.find((m: TMTR) => m.id === params.mtrId);
          return `/contracts/${stores.activeContract.data.id}/orders/${
            stores.activeOrder.data.id
          }/mtrs/${mtr.id}/deliveries`;
        } else {
          return '/deliveries';
        }
      },
    },
    {
      keyParam: 'complaintId',
      isNeed: params => (params.complaintId ? true : false),
      getText: (stores, params) => {
        return `Поставка № ${_.get(stores.activeDelivery, 'data.mtrCode', '')} - ${_.get(
          stores.activeDelivery,
          'data.number',
          ''
        )}`;
      },
      loadData: (stores, params) =>
        params.orderId
          ? stores.deliveries.getListByMtrCache(
              stores.activeContract.data.id,
              stores.activeOrder.data.id,
              params.mtrId
            )
          : Promise.resolve(true),
      getLink: (stores, params) => {
        if (params.orderId) {
          const mtr = stores.activeOrder.data.mtrs.find((m: TMTR) => m.id === params.mtrId);
          return `/contracts/${stores.activeContract.data.id}/orders/${
            stores.activeOrder.data.id
          }/mtrs/${mtr.id}/deliveries/${params.deliveryId}`;
        } else {
          return `/deliveries/${params.deliveryId}`;
        }
      },
    },
  ];

  @observable
  public params: IParams = {};

  @observable
  public fetchStatus: IParams = {};

  constructor(stores: IStores) {
    super(stores);

    autorun(() => {
      this.fetchStatus = {};

      this.config
        .filter(c => c.isNeed(this.params))
        .reduce(
          (s, item) => s.then(() => item.loadData(this.stores, this.params)),
          Promise.resolve()
        )
        .then(() => this.config.forEach(c => (this.fetchStatus[c.keyParam] = true)));
    });
  }

  @computed
  get links(): Array<IBreadCrumb> {
    return this.config
      .filter(c => c.isNeed(this.params))
      .map(c =>
        this.fetchStatus[c.keyParam]
          ? {
              text: c.getText(this.stores, this.params),
              link: c.getLink(this.stores, this.params),
            }
          : { text: '', link: '' }
      );
  }

  @action.bound
  public setParams(params: IParams) {
    this.params = params;
  }
}
