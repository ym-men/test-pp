import { action, computed, observable } from 'mobx';
import { Entities } from '../../entities';
import { IStores } from './stores';
import AccessStore, { TControlAction } from './AccessStore';
import TDocumentStatus = Entities.TDocumentStatus;
import TRoles = Entities.TRoles;
import TDocument = Entities.TDocument;

export type IConfig = {
  doc: TDocumentStatus | 'none' | 'any';
  linkDoc: TDocumentStatus | 'none' | 'any';
  role: TRoles;
  docActions: TControlAction[];
  linkDocActions: TControlAction[];
};

const REPORTS = {
  'Ежедневный отчет': true,
  'Предварительный отчет': true,
  'Окончательный отчет': true,
};

const NOTICE = {
  'Уведомление о несоответствии': true,
  'Запрос на отклонение': true,
  'Подписанное уведомление о несоответствии': true,
  'Закрытое уведомление о несоответствии': true,
  'Письмо о согласовании недостатков': true,
};

export default class EditDocStatusStore extends AccessStore {
  @observable public documentId: string;
  @observable public isShow: boolean;
  @observable public loadedDoc: TDocument;
  @observable public text: string = '';
  @observable public newDocStatus: TDocumentStatus = 'approving';
  @observable public loadedDocType: number;
  @observable public rejectReportText: string = '';
  @observable public rejectNoticeMode: boolean = false;
  @observable public rejectReportMode: boolean = false;

  @computed
  public get document() {
    return this.stores.activeControl.getDocumentById(this.documentId);
  }

  @computed
  public get actionInfo() {
    switch (this.newDocStatus) {
      case 'approved':
        return {
          title: 'Согласование несоответсвия',
          description: `Внесите ${this.stores.catalogs.getDocumentTypeName(
            'control',
            this.loadedDocType
          )} и добавьте комментарий`,
        };
      case 'rejected':
        return {
          title: 'Запрос на отклонение',
          description: `Внесите ${this.stores.catalogs.getDocumentTypeName(
            'control',
            this.loadedDocType
          )} и укажите причину отклонения`,
        };
      case 'closed':
        return {
          title: 'Закрытие уведомления о несоответсвии',
          description: `Внесите ${this.stores.catalogs.getDocumentTypeName(
            'control',
            this.loadedDocType
          )} и добавьте комментарий`,
        };
      default:
        return {
          title: 'Запрос на отклонение',
          description: `Внесите ${this.stores.catalogs.getDocumentTypeName(
            'control',
            this.loadedDocType
          )} и укажите причину отклонения`,
        };
    }
  }

  @computed
  public get actions() {
    return this.stores.activeControl.getEditDocumentStatus(this.document);
  }

  public config: IConfig[] = [
    {
      doc: 'approving',
      linkDoc: 'none',
      role: 'CUSTOMER_MANAGER',
      docActions: [
        {
          text: 'Согласовать',
          isActionBtn: true,
          validations: [],
          exec: (stores: IStores) => this.changeStatusWithFile('approved', 11),
        },
        {
          text: 'Отклонить',
          validations: [],
          exec: (stores: IStores) => this.changeStatusWithFile('approving', 12),
        },
      ],
      linkDocActions: [],
    },
    {
      doc: 'approving',
      linkDoc: 'approving',
      role: 'BUYER_QUALITY_MANAGER',
      docActions: [],
      linkDocActions: [
        {
          text: 'Согласовать',
          isActionBtn: true,
          validations: [],
          exec: (stores: IStores) => this.changeStatusWithFile('approved', 16),
        },
        {
          text: 'Отклонить',
          validations: [],
          exec: (stores: IStores) =>
            stores.activeControl.changeDocumentStatus(this.documentId, 'rejected'),
        },
      ],
    },
    {
      doc: 'approving',
      linkDoc: 'rejected',
      role: 'CUSTOMER_MANAGER',
      docActions: [
        {
          text: 'Согласовать',
          isActionBtn: true,
          validations: [],
          exec: (stores: IStores) => this.changeStatusWithFile('approved', 11),
        },
      ],
      linkDocActions: [],
    },
    {
      doc: 'approving',
      linkDoc: 'approved',
      role: 'OUTSIDE_INSPECTOR',
      docActions: [
        {
          text: 'Закрыть уведомление',
          isActionBtn: true,
          validations: [],
          exec: (stores: IStores) => this.changeStatusWithFile('closed', 17),
        },
      ],
      linkDocActions: [],
    },
    {
      doc: 'approved',
      linkDoc: 'any',
      role: 'OUTSIDE_INSPECTOR',
      docActions: [
        {
          text: 'Закрыть уведомление',
          isActionBtn: true,
          validations: [],
          exec: (stores: IStores) => this.changeStatusWithFile('closed', 17),
        },
      ],
      linkDocActions: [],
    },
  ];

  @action.bound
  public changeStatusWithFile(status: TDocumentStatus, fileType: number) {
    this.newDocStatus = status;
    this.loadedDocType = fileType;

    this.activateRejectNoticeMode();

    return Promise.reject();
  }

  @computed
  public get isReport(): boolean {
    return this.docStrType && REPORTS[this.docStrType];
  }

  @computed
  public get isNotice(): boolean {
    return this.docStrType && NOTICE[this.docStrType];
  }

  @computed
  private get docStrType() {
    const type = this.stores.catalogs.data.documentTypes.control.find(
      t => t.id === this.document.type
    );

    return type ? type.name : '';
  }

  @action.bound
  public closeModal() {
    this.isShow = false;
    this.text = '';
    this.rejectReportText = '';
    this.rejectNoticeMode = false;
    this.rejectReportMode = false;
    this.loadedDoc = null;
  }

  @action.bound
  public activateRejectNoticeMode() {
    this.rejectNoticeMode = true;
  }
}
