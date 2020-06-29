import { action, computed, observable, toJS } from 'mobx';
import { controls as controlsService } from 'services';
import { Entities } from '../../entities';
import { statusFetching } from 'constants/types';
import TProduction = Entities.TProduction;
import TInspector = Entities.TInspector;
import TControlStatus = Entities.TControlStatus;
import TDocument = Entities.TDocument;
import TDocumentStatus = Entities.TDocumentStatus;
import { TControlAction } from 'mobx-stores/AccessStore';
import { ActiveStoreConstructor } from './ActiveStoreConstructor';
import { IStores } from './stores';

export default class ActiveControl extends ActiveStoreConstructor<Entities.TControl<Date>> {
  @computed
  get status() {
    return this.data ? this.data.status : 'inspection_plan';
  }

  @computed
  private get allDocuments() {
    if (!this.data.documents) {
      return [];
    }

    const documents = toJS(this.data.documents);

    documents.forEach(doc => {
      if (doc.parentId) {
        const parentDoc = documents.find(d => d.id === doc.parentId) as any;

        if (parentDoc) {
          parentDoc.links = parentDoc.links || [];
          parentDoc.links.unshift(doc);
        }
      }
    });

    return documents.filter(doc => !doc.parentId);
  }

  @computed
  get documents() {
    const excluded = [...this.notificationIds, ...this.reportIds];
    return this.allDocuments.filter(doc => !excluded.includes(doc.type));
  }

  @computed
  get notifications() {
    return this.allDocuments.filter(doc => this.notificationIds.includes(doc.type));
  }

  @computed
  get reports() {
    return this.allDocuments.filter(doc => this.reportIds.includes(doc.type));
  }

  @computed
  get comments() {
    return this.data.comments || [];
  }

  @observable public updateStatus: statusFetching = 'init';
  @observable public approveStatus: statusFetching = 'init';
  @observable public rejectStatus: statusFetching = 'init';
  @observable public approveReportStatus: statusFetching = 'init';
  @observable public rejectReportStatus: statusFetching = 'init';
  @observable public approveNoticeStatus: statusFetching = 'init';

  public notificationIds = [10, 11, 12, 16];
  public reportIds = [7, 8, 9];

  constructor(stores: IStores) {
    super(controlsService, stores);
  }

  public submitComment(comment: string) {
    this.data.comments.push({
      text: comment,
      author: this.stores.user.userInfo.displayName,
      date: new Date(),
    });

    return Promise.resolve(this.data);
  }

  @action.bound
  public addProduction(production: TProduction) {
    this.data.addresses.unshift(production);
  }

  @action.bound
  public deleteProduction(productionIdx: number) {
    this.data.addresses = this.data.addresses.filter((p, idx) => idx !== productionIdx);
  }

  @action.bound
  public addInspector(inspector: TInspector) {
    this.data.inspectors.unshift(inspector);
  }

  @action.bound
  public deleteInspector(inspectorIdx: number) {
    this.data.inspectors = this.data.inspectors.filter((p, idx) => idx !== inspectorIdx);
  }

  @action.bound
  public update() {
    this.updateStatus = 'fetching';

    this.data.documents.forEach(doc => delete doc.isDraft);

    this.data.pending = true;

    return controlsService
      .update(this.data)
      .then(this.setData)
      .then(() => (this.updateStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.updateStatus = 'error';
      });
  }

  @action.bound
  public approve(status: TControlStatus) {
    this.approveStatus = 'fetching';
    this.data.status = status;

    return this.update()
      .then(() => (this.approveStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.approveStatus = 'error';
      });
  }

  @action.bound
  public reject(status: TControlStatus) {
    this.rejectStatus = 'fetching';
    this.data.status = status;

    return this.update()
      .then(() => (this.rejectStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.rejectStatus = 'error';
      });
  }

  @action.bound
  public addDocument(document: TDocument) {
    this.data.documents.push(document);

    // if ([7, 8, 9, 10, 11, 12, 16].indexOf(document.type) > -1) {
    //   return this.update();
    // }

    if ([7, 8, 9, 10].indexOf(document.type) > -1) {
      return this.update();
    }

    return Promise.resolve();
  }

  @action.bound
  public setDocuments(documents: TDocument[]) {
    this.data.documents = documents;
  }

  public getDocuments(): TDocument[] {
    return this.data ? this.data.documents : [];
  }

  public getDocumentById(id: string): TDocument {
    return this.data.documents.find(doc => doc.id === id);
  }

  public isReportEditable(document: TDocument) {
    return (
      this.stores.user.role === 'BUYER_QUALITY_MANAGER' &&
      this.reportIds.some(i => i === document.type) &&
      document.status === 'approving'
    );
  }

  public isReportsEditable = () =>
    this.data.documents.some(document => this.isReportEditable(document));

  public getEditDocumentStatus(document: TDocument) {
    if (this.data.pending) {
      return [] as TControlAction[];
    }

    let linkStatus = 'none';
    let documentStatus = 'none';

    if (document.type === 12 && document.parentId) {
      const parentDoc = this.data.documents.find(doc => doc.id === document.parentId);

      linkStatus = document.status;
      documentStatus = parentDoc ? parentDoc.status : 'none';
    }

    if (document.type === 10) {
      const linkedDoc = this.data.documents.find(
        doc => doc.parentId === document.id && doc.type === 12
      );

      linkStatus = linkedDoc ? linkedDoc.status : 'none';
      documentStatus = document.status;
    }

    const configInt = this.stores.docStatusManager.config.find(item => {
      const isLinkStatusEql = item.linkDoc === 'any' || item.linkDoc === linkStatus;
      const isRoleEql = item.role === this.stores.user.role;
      const isDocStatusEql = item.doc === documentStatus;
      return isRoleEql && isDocStatusEql && isLinkStatusEql;
    });

    if (configInt) {
      return document.type === 12 ? configInt.linkDocActions : configInt.docActions;
    }

    return [] as TControlAction[];
  }

  public isNotifyEditable(document: TDocument) {
    return !!this.getEditDocumentStatus(document).length;
  }

  public isNotifiesEditable = () =>
    this.data.documents.some(document => this.isNotifyEditable(document));

  @action.bound
  public changeDocumentStatus(docId: string, status: TDocumentStatus, commentText?: string) {
    const document = this.data.documents.find(doc => doc.id === docId);

    this.data.pending = true;

    document.status = status;

    if (commentText) {
      const comment = {
        text: commentText,
        author: this.stores.user.userInfo.displayName,
        date: new Date(),
      };

      document.comment = comment;
      this.data.comments.push(comment);
    }

    return controlsService.updateDocument(this.data.id, document).then(() => this.update());
  }
}
