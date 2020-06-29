import { Entities } from '../../../../../entities';
import TDelivery = Entities.TDelivery;
import TRoles = Entities.TRoles;
import { IStores } from 'mobx-stores/stores';
import * as _ from 'lodash';

export type TActionButton = {
  text: string;
  isActionBtn?: boolean;
  exec: (stores: IStores) => void;
  id?: string;
};

export type TActionBlock = {
  condition: (delivery: TDelivery, role: TRoles) => boolean;
  icon?: React.FunctionComponent<any>;
  title: string;
  description?: string;
  buttons?: TActionButton[];
};

const isUndefined = (value: any) => _.isNull(value) || _.isUndefined(value);

const hasActs = (data: TDelivery) =>
  data.documents.some(doc => doc.type === 5) && data.documents.some(doc => doc.type === 6);

export const actionBlocks: TActionBlock[] = [
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      role === 'BUYER_OPERATOR' && delivery.status === 'delivery' && !delivery.dateArrivalCustomer,
    title: 'Доставка груза',
    description: 'Как только груз прибудет на склад, подтвердите прибытие и укажите его дату.',
    buttons: [
      {
        text: 'Груз прибыл',
        isActionBtn: true,
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('approveArrivalBuyer', activeDelivery.approveArrivalBuyer),
        id: 'arrived',
      },
    ],
  },
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      role === 'BUYER_OPERATOR' && delivery.status === 'delivery' && !!delivery.dateArrivalCustomer,
    title: 'Поставщик уведомил о прибытии груза',
    description: 'Пожалуйста, подтвердите прибытие и укажите его дату.',
    buttons: [
      {
        text: 'Подтвердить',
        isActionBtn: true,
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('approveArrivalBuyer', activeDelivery.approveArrivalBuyer),
        id: 'apply',
      },
    ],
  },

  // ACCEPTING //

  {
    condition: (delivery: TDelivery, role: TRoles) =>
      role === 'BUYER_OPERATOR' &&
      delivery.status === 'accepting' &&
      isUndefined(delivery.commercialActNeed),
    title: 'Выявлены основания для формирования акта?',
    buttons: [
      {
        text: 'Да, составить акт',
        exec: (stores: IStores) => stores.activeDelivery.loadDocument(),
        id: 'saveAct',
      },
      {
        text: 'Нет, продолжить без акта',
        exec: (stores: IStores) => stores.activeDelivery.notNeedCommercialAct(),
        id: 'continueWithoutAct',
      },
    ],
  },
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      role === 'BUYER_OPERATOR' &&
      delivery.status === 'accepting' &&
      !isUndefined(delivery.commercialActNeed) &&
      isUndefined(delivery.docsFail),
    title: 'Все документы приложены в полном объеме?',
    description: 'Проверьте наличие и полноту технической и сопроводительной документации.',
    buttons: [
      {
        text: 'Все документы приложены',
        isActionBtn: true,
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('approveDocuments', activeDelivery.approveDocuments),
      },
      {
        text: 'Отсутствует документация',
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('rejectDocuments', activeDelivery.rejectDocuments),
      },
    ],
  },
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      role === 'BUYER_OPERATOR' &&
      delivery.status === 'accepting' &&
      !hasActs(delivery) &&
      !isUndefined(delivery.docsFail),
    title: 'Пожалуйста, загрузите акты',
    description: 'Пожалуйста, загрузите акт о приемке и акт входного контроля.',
    buttons: [
      {
        text: 'Загрузить акты',
        exec: (stores: IStores) => stores.activeDelivery.loadDocument(),
        id: 'uploadActs',
      },
    ],
  },
  // {
  //   condition: (delivery: TDelivery, role: TRoles) =>
  //     role === 'BUYER_QUALITY_MANAGER' &&
  //     delivery.status === 'accepting' &&
  //     !hasActs(delivery) &&
  //     delivery.docsFail !== undefined,
  //   title: 'Пожалуйста, загрузите акт входного контроля',
  //   buttons: [
  //     {
  //       text: 'Загрузить',
  //       exec: (stores: IStores) => stores.activeDelivery.loadDocument(),
  //     },
  //   ],
  // },
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      role === 'BUYER_OPERATOR' && delivery.status === 'accepting' && hasActs(delivery),
    title: 'Завершение приемки',
    description: 'Вы можете принять груз на склад либо отправить его на ответственное хранение.',
    buttons: [
      {
        text: 'Принять груз',
        isActionBtn: true,
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('acceptDelivery', activeDelivery.acceptDelivery),
        id: 'applyCargo',
      },
      {
        text: 'Отправить на хранение',
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('custodyDelivery', activeDelivery.custodyDelivery),
        id: 'sendToStorage',
      },
    ],
  },

  // ACCEPTING END //

  {
    condition: (delivery: TDelivery) => delivery.status === 'accepted',
    title: 'Груз принят',
  },

  // CUSTODY

  {
    condition: (delivery: TDelivery, role: TRoles) =>
      delivery.status === 'custody' && !delivery.complaintId && role === 'BUYER_QUALITY_MANAGER',
    title: 'Груз передан на ответственное хранение',
    buttons: [
      {
        text: 'Вызвать поставщика',
        exec: ({ activeDelivery }: IStores) =>
          activeDelivery.openModal('createComplaint', activeDelivery.createComplaint),
        id: 'callSupplier',
      },
    ],
  },
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      delivery.status === 'custody' &&
      !isUndefined(delivery.complaintId) &&
      (role === 'CUSTOMER_MANAGER' || role === 'BUYER_QUALITY_MANAGER'),
    title: 'Груз передан на ответственное хранение',
    buttons: [
      {
        text: 'Перейти к рекламации',
        exec: ({ activeDelivery }: IStores) => activeDelivery.goToComplaint(),
        id: 'goToComplaint',
      },
    ],
  },
  {
    condition: (delivery: TDelivery, role: TRoles) =>
      delivery.status === 'custody' &&
      (!(role === 'CUSTOMER_MANAGER' || role === 'BUYER_QUALITY_MANAGER') ||
        (!delivery.complaintId && role === 'CUSTOMER_MANAGER')), // TODO - use core from complaint
    title: 'Груз передан на ответственное хранение',
    buttons: [],
  },
];
