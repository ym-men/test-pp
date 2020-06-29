import { TID } from './src/interface';

declare namespace Entities {
  export type TToken = {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    jti: string;
  };

  export type TUser = {
    firstName: string;
    lastName: string;
    name: string;
    surName: string;
    id: string;
    personId: string;
    email: string;
    role: TRoles;
    businessRoles: TRoles[];
    displayName?: string;
  };

  export interface ICatalogs {
    contractTypes: Array<IContractType>;
    organizations: Array<IOrganization>;
    transportTypes: Array<ITransportType>;
    documentTypes: {
      contract: Array<ICatalogDocument>;
      order: Array<ICatalogDocument>;
      control: Array<ICatalogDocument>;
      delivery: Array<ICatalogDocument>;
      complaint: Array<ICatalogDocument>;
    };
    fixingTypes: Array<IFixingType>;
    quantityTypes: Array<IQuantityType>;
  }

  export interface ICatalogDocument {
    id: TID;
    name: string;
  }

  export interface IContractType {
    id: number;
    name: string;
    code: string;
  }

  export interface ITransportType {
    id: TID;
    name: string;
  }

  export interface IQuantityType {
    id: TID;
    name: string;
  }

  export interface IFixingType {
    id: TID;
    name: string;
  }

  export interface IOrganization {
    id: TID;
    name: string;
    type: TOrganizationType;
    shortName: string;
    address: string;
  }

  export type TComment<DATE = Date> = {
    text: string;
    author: string;
    date: DATE;
    documentId?: string;
  };

  export type TDocument<DATE = Date> = {
    size: number;
    name: string;
    type: number;
    date: DATE;
    id: string;
    author?: string;
    linkId?: string;
    parentId?: string;
    comment?: TComment;
    status?: TDocumentStatus;
    downloadUrl: string;
    pending?: boolean;
    isDraft?: boolean;
  };

  export type TContract<DATE = Date, ORDER = TOrder<DATE>> = {
    id: string;
    number: string;
    type: TID;
    status: TContractStatus;
    date: DATE;
    dateFrom: DATE;
    dateTo: DATE;
    subject: TID;
    buyer: TID;
    supplier: TID;
    comments: Array<TComment<DATE>>;
    documents: Array<TDocument<DATE>>;
    orders: Array<ORDER>;
    pending: boolean;
    modified: string;
  };

  export type TOrder<DATE = Date> = {
    id: string;
    contractId: string;
    contractNumber?: string;
    number: string;
    status: TOrderStatus;
    acceptDate: DATE;
    toleranceFrom: number;
    toleranceTo: number;
    supplier: string;
    receiver: string;
    comments: Array<TComment<DATE>>;
    documents: Array<TDocument<DATE>>;
    mtrs: Array<TMTR<DATE>>;
    pending: boolean;
    modified: string;
  };

  export type TOrderMeta = Pick<TOrder, 'id' | 'status'>;

  export type TMTR<DATE = Date> = {
    id: string;
    code: string;
    name: string;
    quantity: number;
    quantityType: TID;
    receiver: TID;
    mtrDeliveryAddress: TID;
    inspectionNeeded: boolean;
    inspectionId: string;
    status: TMTRStatus;
    date: Array<DATE>;
    inspector: TID;
    inspectorName: string;
    pending: boolean;
    controlStatus?: TControlStatus;
    hasPermissionToShip?: boolean;
    hasNotClosedNotify?: boolean;
    dateFrom?: DATE;
    dateTo?: DATE;
    createDate?: DATE;
  };

  export type TControl<DATE = Date> = {
    id: string;
    contractNumber: string;
    status: TControlStatus;
    orderId: TID;
    orderNumber: string;
    mtrName: string;
    mtrCode: string;
    supplier: TID;
    volume: number;
    quantity: number;
    quantityType: TID;
    inspector: TID;
    inspectors: Array<TInspector>;
    addresses: Array<TProduction>;
    dateStart: DATE;
    dateEnd: DATE;
    meetingNeeded: boolean;
    comments: Array<TComment>;
    documents: Array<TDocument>;
    modified: string;
    pending: boolean;
  };

  export type TDelivery<DATE = Date> = {
    id: string;
    status: TDeliveryStatus;
    number: string;
    mtrName: string;
    mtrCode: string;
    mtrId: string;
    orderNumber: string;
    contractNumber: string;
    supplier: TID;
    quantity: number;
    quantityType: TID;
    dateFrom: DATE;
    dateTo: DATE;
    transportType: TID;
    transportId: string;
    comments: Array<TComment>;
    documents: Array<TDocument>;
    locationList: Array<TLocation<DATE>>;
    dateArrivalCustomer: DATE; // Дата фактического прибытия груза внесенная поставщиком
    dateArrivalBuyer: DATE; // Дата фактического прибытия груза внесенная оператором приемки
    docsFail?: boolean; // Признак того что приложена неполная ТСД
    acceptingFail?: boolean; // Признак того что приемка груза прошла с замечаниями
    controlFail?: boolean; // Признак того что входной контроль прошел с замечаниями
    commercialActNeed?: boolean;
    complaintId?: string;
    parentComplaintId?: TID;
    contractId: string;
    orderId: string;
    modified: string;
    pending: boolean;
  };

  export type TLocation<DATE = Date> = {
    location: string;
    locationDate: DATE;
    dateToUpdate: DATE;
  };

  export type TInspector = {
    name: string;
    phone: string;
  };

  export type TProduction = {
    address: string;
    name: string;
    phone: string;
  };

  export type TComplaint<DATE = Date> = {
    id: string; // Уникальный ID, ключ создается на бэке при заведении карточки рекламации
    deliveryId: TID; // Уникальный ID поставки. Заполняется в случае, если создается доп. поставка МТР на замену поставленных ранее
    status: TComplaintStatus; // Статус рекламации
    complaintDate: DATE; // Дата оформления рекламации
    comissionDate: DATE; // Дата проведения комиссии
    representativeName: string; // ФИО представителя поставщика
    representativePosition: string; // Должность представителя поставщика
    representativePhone: string; // Телефон представителя поставщика
    representativeMissing: boolean; // Признак того что представитель Поставщика не прибыл, либо не подписал акт
    fixingMethod: TID; // Метод устранения недостатков
    fixingMethodCounter: number; //Число попыток согласовать метод устранения недостатков. Увеличивается на 1 при каждом переходе из статуса "Согласование метода устранения недостатков"
    fixingMethodDate: DATE; //Дата согласования метода устранения недостатков. Увеличивается на 1 при каждом переходе из статуса "Согласование метода устранения недостатков"
    documents: Array<TDocument>; // Массив документов
    comments: Array<TComment>; // Массив комментариев
    additionalDeliveries: Array<TID>;
    pending: boolean;
    modified: string;
    supplier?: string;
    receiver?: string;
    contractId?: string;
    contractNumber?: string;
    orderId?: string;
    orderNumber?: string;
    mtrCode?: string;
    mtrName?: string;
    mtrId: string;
    deliveryNumber?: string;
  };

  export type TRoles =
    | 'BUYER_CURATOR'
    | 'BUYER_QUALITY_MANAGER'
    | 'BUYER_INSPECTOR'
    | 'BUYER_OPERATOR'
    | 'CUSTOMER_MANAGER'
    | 'OUTSIDE_INSPECTOR';

  export type TOrganizationType = 'BUYER' | 'CONTROL' | 'SUPPLIER';
  export type TContractStatus = 'approving' | 'approved' | 'rejected';
  export type TDocumentStatus = 'approving' | 'approved' | 'rejected' | 'closed' | 'accepted';
  export type TDeliveryStatus = 'delivery' | 'accepting' | 'accepted' | 'custody';
  export type TOrderStatus = 'approving' | 'approved' | 'rejected';
  export type TMTRStatus = 'approving' | 'approved' | 'rejected';

  export type TControlStatus =
    | 'ppi_approving'
    | 'ppi_date_approving'
    | 'ppi_fix'
    | 'dates_fix'
    | 'order_applying'
    | 'order_approving'
    | 'order_fix'
    | 'inspection_start'
    | 'inspection_meeting'
    | 'inspection'
    | 'final_report_approving'
    | 'inspection_plan'
    | 'inspector_call'
    | 'inspector_sent'
    | 'control_material'
    | 'control_product'
    | 'control_docs'
    | 'delivery_allowed'
    | 'delivery_spoiled'
    | 'control_shipment'
    | 'control_finish';

  export type TComplaintStatus =
    | 'representative'
    | 'docs_update'
    | 'no_act_fix'
    | 'act'
    | 'act_approving'
    | 'fix_method'
    | 'fix_method_approving'
    | 'tech_docs_update'
    | 'tech_docs_approving'
    | 'delivery_add'
    | 'delivery'
    | 'fix'
    | 'fix_approving'
    | 'complaint_closed'
    | 'claim_work'
    | 'claim_work_fixed';
}
