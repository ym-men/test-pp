import { action, computed, observable } from 'mobx';
import { delivery as deliveryService } from 'services';
import { Entities } from '../../entities';
import { statusFetching } from 'constants/types';
import TDocument = Entities.TDocument;
import TLocation = Entities.TLocation;
import { TDeliveryModals } from 'pages/Delivery/components/Modal';
import { IStores } from './stores';
import { ActiveStoreConstructor } from './ActiveStoreConstructor';

export type TAddDocumentParams = {
  doc: TDocument;
  comment: string;
  carrierComment: string;
  email: string;
  sendNotification: boolean;
};

export default class ActiveDelivery extends ActiveStoreConstructor<Entities.TDelivery<Date>> {
  @computed
  get status() {
    return this.data ? this.data.status : 'inspection_plan';
  }

  @observable public updateStatus: statusFetching = 'init';
  @observable public approveStatus: statusFetching = 'init';
  @observable public rejectStatus: statusFetching = 'init';

  @observable public mode: 'main' | 'history' | 'files' = 'main';
  @observable public displayModal: TDeliveryModals = 'none';
  private onApplyCallback: ((arg1?: any, arg2?: any) => void) | false;

  constructor(stores: IStores) {
    super(deliveryService, stores);
  }

  @action.bound
  public addLocation(location: TLocation) {
    this.data.locationList.unshift(location);
    this.update(this.data);
  }

  @action.bound
  public update(data: Entities.TDelivery<Date> = this.data, params?: any) {
    this.updateStatus = 'fetching';

    this.data.pending = true;

    return deliveryService
      .update(data, params)
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
    this.data.status = 'accepted';
    return deliveryService
      .update(this.data)
      .then(this.setData)
      .then(() => (this.approveStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.approveStatus = 'error';
      });
  }

  @action.bound
  public reject(comment: string) {
    this.data.comments.push({
      author: this.stores.user.userInfo.displayName,
      text: comment,
      date: new Date(),
    });
    this.rejectStatus = 'fetching';
    this.data.status = 'custody';

    return deliveryService
      .update(this.data)
      .then(this.setData)
      .then(() => (this.rejectStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.rejectStatus = 'error';
      });
  }

  @action.bound
  public addComment(comment: string) {
    this.data.comments.push({
      author: this.stores.user.userInfo.displayName,
      text: comment,
      date: new Date(),
    });
  }

  @action.bound
  public addDocument(data: TAddDocumentParams) {
    const { doc, comment, ...params } = data;

    if (comment) {
      this.addComment(comment);
    }

    this.data.documents.push(doc);

    if (doc.type === 4) {
      this.data.commercialActNeed = true;
    }

    return this.update(this.data, params);
  }

  public getDocuments(): TDocument[] {
    return this.data ? this.data.documents : [];
  }

  public getDocumentById(id: string): TDocument {
    return this.data.documents.find(doc => doc.id === id);
  }

  @action.bound
  public approveArrivalBuyer(data: any) {
    this.data.dateArrivalBuyer = data.dateArrivalBuyer;
    this.data.status = 'accepting';

    this.update(this.data);
  }

  @action.bound
  public notNeedCommercialAct() {
    this.data.commercialActNeed = false;

    this.update(this.data);
  }

  @action.bound
  public approveArrivalCustomer() {
    this.data.dateArrivalCustomer = new Date();

    this.update(this.data);
  }

  @action.bound
  public approveDocuments() {
    this.data.docsFail = false;

    this.update(this.data);
  }

  @action.bound
  public rejectDocuments(data: any) {
    this.data.docsFail = true;
    this.addComment(data.comment);

    this.update(this.data);
  }

  @action.bound
  public loadDocument() {
    this.mode = 'files';

    this.openModal('addDocument', this.addDocument);
  }

  @action.bound
  public acceptDelivery() {
    this.data.status = 'accepted';

    this.update(this.data);
  }

  @action.bound
  public custodyDelivery(data: any) {
    this.data.status = 'custody';
    this.addComment(data.comment);
    this.data.documents.push(data.document);
    this.update(this.data);
  }

  @action.bound
  public createComplaint(data: any) {
    this.stores.activeComplaint
      .create({
        deliveryId: this.data.id,
        comissionDate: data.comissionDate,
        documents: [data.document],
      })
      .then(this.goToComplaint);
  }

  @action.bound
  public goToComplaint() {
    this.stores.routing.push(`${this.data.id}/complaint`);
  }

  @action.bound
  public openModal(displayModal: TDeliveryModals, onApply?: (arg1?: any, arg2?: any) => void) {
    this.displayModal = displayModal;
    this.onApplyCallback = onApply;
  }

  @action.bound
  public closeModal() {
    this.displayModal = 'none';
    this.onApplyCallback = false;
  }

  @action.bound
  public onModalApply(data: any) {
    if (typeof this.onApplyCallback === 'function') {
      this.onApplyCallback(data);
    }
    this.closeModal();
  }
}
