import StoreConstructor from './StoreConstructor';
import { IStores } from './stores';

type IMode = 'MOCK' | 'REMOTE';
const MODE_TYPE: Record<IMode, IMode> = {
  MOCK: 'MOCK',
  REMOTE: 'REMOTE',
};
const { API_MODE } = process.env;
const REMOTE_URL = window.location.origin;

export type IUrl =
  | 'AUTH_TOKEN'
  | 'USER_INFO'
  | 'CATALOGS'
  | 'COMPANY'
  | 'CONTRACTS'
  | 'CONTRACT'
  | 'CONTRACT_APPROVE'
  | 'CONTRACT_REJECT'
  | 'CONTROLS'
  | 'CONTROL'
  | 'FILE_UPLOAD'
  | 'FILE_DOWNLOAD'
  | 'ORDERS'
  | 'ORDER'
  | 'ORDER_APPROVE'
  | 'ORDER_REJECT'
  | 'DELIVERIES'
  | 'DELIVERY_CREATE'
  | 'DELIVERY'
  | 'DELIVERY_BY_MTR'
  | 'UPDATE_CONTROL_DOCUMENT'
  | 'COMPLAINTS'
  | 'COMPLAINT';

export default class ApiStore extends StoreConstructor {
  private urls: Record<IUrl, (...params: any) => string> = {
    AUTH_TOKEN: () => 'vst-oauth2/oauth/token',
    USER_INFO: () => 'vst-identity/person/info',
    CATALOGS: () => 'vst-bb/catalogs',
    COMPANY: () => 'vst-identity/company',
    CONTRACTS: () => 'vst-bb/contracts',
    CONTRACT: (id: string) => `vst-bb/contracts/${id}`,
    CONTRACT_APPROVE: (id: string) => `vst-bb/contracts/${id}/approve`,
    CONTRACT_REJECT: (id: string) => `vst-bb/contracts/${id}/reject`,
    CONTROLS: () => 'vst-bb/controls',
    CONTROL: (id: string) => `vst-bb/controls/${id}`,
    FILE_UPLOAD: () => 'vst-files/file/upload',
    FILE_DOWNLOAD: (fileId, objectId) => `vst-files/file/${fileId}?object_id=${objectId}`,
    ORDERS: () => 'vst-bb/orders',
    ORDER: (id: string) => `vst-bb/orders/${id}`,
    ORDER_APPROVE: (id: string) => `vst-bb/orders/${id}/approve`,
    ORDER_REJECT: (id: string) => `vst-bb/orders/${id}/reject`,
    DELIVERIES: () => `vst-bb/deliveries`,
    DELIVERY_CREATE: (contractId: string, orderId: string) =>
      `vst-bb/contracts/${contractId}/orders/${orderId}/deliveries`,
    DELIVERY: (id: string) => `vst-bb/deliveries/${id}`,
    DELIVERY_BY_MTR: (contractId: string, orderId: string, mtrId: string) =>
      `vst-bb/deliveries/contracts/${contractId}/orders/${orderId}/mtrs/${mtrId}`,
    UPDATE_CONTROL_DOCUMENT: (controlId: string, documentId: string) =>
      `vst-bb/controls/${controlId}/document/${documentId}`,
    COMPLAINTS: () => `vst-bb/complaints`,
    COMPLAINT: (id: string) => `vst-bb/complaints/${id}`,
  };
  private urlModes = new Map<IUrl, IMode>();
  private mode: IMode = MODE_TYPE.REMOTE;

  constructor(stores: IStores) {
    super(stores);
    this.mode = this.mode || 'MOCK';
    if (!this.mode) {
      throw new Error(`API_MODE ${API_MODE} INVALID - use MOCK or REMOTE`);
    }
  }

  public setMode(mode: IMode, force?: boolean) {
    if (!MODE_TYPE[mode]) {
      throw new Error(`API_MODE ${mode} INVALID - use MOCK or REMOTE`);
    }

    this.mode = MODE_TYPE[mode];

    if (force) {
      this.clearUrlModes();
    }
  }

  public setUrlMode(url: IUrl, mode: IMode | null) {
    if (mode === null) {
      return this.urlModes.delete(url);
    }

    return this.urlModes.set(url, mode);
  }

  public clearUrlModes() {
    this.urlModes.clear();
  }

  public listShortUrls() {
    return Object.keys(this.urls);
  }

  public listUrlModes() {
    return this.urlModes;
  }

  public getUrl(url: IUrl, ...params: any) {
    let base = this.mode === MODE_TYPE.REMOTE ? REMOTE_URL : '';
    const urlMode = this.urlModes.get(url);
    base = urlMode ? (urlMode === MODE_TYPE.REMOTE ? REMOTE_URL : '') : base;

    return `${base}/api/v0/${this.urls[url](...params)}`;
  }
}
