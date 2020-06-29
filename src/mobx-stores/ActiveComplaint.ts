import { computed, observable, action } from 'mobx';
import { complaints as complaintService } from 'services';
import { Entities } from '../../entities';
import { statusFetching } from 'constants/types';
import TDocument = Entities.TDocument;
import TComplaintStatus = Entities.TComplaintStatus;
import { ActiveStoreConstructor } from './ActiveStoreConstructor';
import { IStores } from './stores';

export type TAddDocumentParams = {
  doc: TDocument;
  comment?: string;
};

export default class ActiveComplaint extends ActiveStoreConstructor<Entities.TComplaint> {
  @computed
  get status() {
    return this.data ? this.data.status : 'representative';
  }

  @observable public createStatus: statusFetching = 'init';
  @observable public updateStatus: statusFetching = 'init';
  @observable public mode: 'main' | 'history' | 'files' = 'main';

  constructor(stores: IStores) {
    super(complaintService, stores);
  }

  @action.bound
  public changeStatus(status: TComplaintStatus, data: any = {}) {
    const { comment, ...otherData } = data;

    if (comment) {
      this.addComment(comment);
    }

    Object.keys(otherData).forEach(key => {
      const value = otherData[key];

      if (key.indexOf('document') > -1) {
        this.data.documents.push({ ...value, status: null });
      } else {
        this.data[key] = value;
      }
    });

    this.data.status = status;

    return this.update();
  }

  @action.bound
  public create(complaint: any) {
    this.createStatus = 'fetching';
    return complaintService
      .create(complaint)
      .then(this.setData)
      .then(() => (this.createStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.updateStatus = 'error';
      });
  }

  @action.bound
  public update(data: Entities.TComplaint<Date> = this.data) {
    this.updateStatus = 'fetching';

    this.data.pending = true;

    return complaintService
      .update(data)
      .then(this.setData)
      .then(() => (this.updateStatus = 'success'))
      .catch(error => {
        console.error(error);
        this.updateStatus = 'error';
      });
  }

  @action.bound
  public loadDocument() {
    const namespace = 'complaint';
    let allowedDocumentTypes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (this.data.status === 'fix' && this.stores.user.role === 'CUSTOMER_MANAGER') {
      allowedDocumentTypes = [10, 11, 12, 13, 14, 15, 16, 17, 9];
    }

    this.stores.modals.openModal(
      {
        title: 'Добавление файла',
        fields: [
          {
            type: 'dropFile',
            field: 'doc',
            title: '',
            props: {
              hideTypeOptions: false,
              namespace,
              allowedDocumentTypes,
            },
            required: true,
          },
        ],
        okBtn: 'Добавить',
      },
      this.addDocument
    );
  }

  @action.bound
  public addDocument(data: TAddDocumentParams) {
    const { doc, comment } = data;

    if (comment) {
      this.addComment(comment);
    }

    doc.status = null;

    this.data.documents.push(doc);

    return this.update(this.data);
  }

  public getDocuments(): TDocument[] {
    return this.data ? this.data.documents : [];
  }

  @action.bound
  private addComment(comment: string) {
    this.data.comments.push({
      author: this.stores.user.userInfo.displayName,
      text: comment,
      date: new Date(),
    });
  }
}
