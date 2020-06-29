import Controls from './Controls';
import ActiveControl from './ActiveControl';
import RouterStore from './RouterStore';
import UserStore from './UserStore';
import AccessControlStore from './AccessControlStore';
import EditDocStatusStore from './EditDocStatusStore';
import CatalogsStore from './CatalogsStore';
import DeliveriesStore from './DeliveriesStore';
import ActiveOrderStore from './ActiveOrder';
import ActiveContractStore from './ActiveContract';
import DeliveryAddStore from './DeliveryAddStore';
import ActiveDelivery from './ActiveDelivery';
import BreadCrumbsStore from './BreadCrumbsStore';
import ComplaintsStore from './ComplaintStore';
import ActiveComplaint from './ActiveComplaint';
import { ModalsStore } from './Modals';
import ApiStore from './ApiStore';
import ContractStore from './Contracts';

export interface IStores {
  stores?: IStores;
  breadCrumbs?: BreadCrumbsStore;
  activeControl?: ActiveControl;
  activeDelivery?: ActiveDelivery;
  activeComplaint?: ActiveComplaint;
  routing?: RouterStore;
  user?: UserStore;
  access?: AccessControlStore;
  docStatusManager?: EditDocStatusStore;
  catalogs?: CatalogsStore;
  deliveryAdd?: DeliveryAddStore;
  activeContract?: ActiveContractStore;
  controls?: Controls;
  activeOrder?: ActiveOrderStore;
  deliveries?: DeliveriesStore;
  complaints?: ComplaintsStore;
  modals?: ModalsStore;
  api?: ApiStore;
  contracts?: ContractStore;
}

const stores: IStores | any = {};

stores.stores = stores;
stores.breadCrumbs = new BreadCrumbsStore(stores);
stores.activeControl = new ActiveControl(stores);
stores.activeDelivery = new ActiveDelivery(stores);
stores.activeComplaint = new ActiveComplaint(stores);
stores.activeContract = new ActiveContractStore(stores);
stores.activeOrder = new ActiveOrderStore(stores);
stores.routing = new RouterStore();
stores.user = new UserStore(stores);
stores.catalogs = new CatalogsStore(stores);
stores.access = new AccessControlStore(stores);
stores.docStatusManager = new EditDocStatusStore(stores);
stores.deliveryAdd = new DeliveryAddStore(stores);
stores.controls = new Controls(stores);
stores.deliveries = new DeliveriesStore(stores);
stores.complaints = new ComplaintsStore(stores);
stores.modals = new ModalsStore(stores);
stores.api = new ApiStore(stores);
stores.contracts = new ContractStore(stores);

if (!process.env.production) {
  window.stores = stores;
}

export default stores;
