import { modals as complaintModals } from './modalsConfig';
import { conditionBy as condition, button, TActionBlock, modalWithDoc } from './helpers';
import { IStores } from 'mobx-stores/stores';

const NO_MODAL = false;
const IS_BLACK = true;

const FIXING_TYPES = {
  REJECT: '1',
  REPAIR: '2',
  REPLACE: '3',
};

export const actionBlocks: TActionBlock[] = [
  {
    condition: condition('representative', 'CUSTOMER_MANAGER'),
    title: 'Покупатель вызвал представителя поставщика',
    description:
      'Вы можете направить представителя, запросить дополнительные документы или устранить недостатки груза без оформления акта.',
    buttons: [
      button('act', 'Направить представителя', complaintModals.sendRepresentative, IS_BLACK),
      button('docs_update', 'Запросить документы', complaintModals.comment),
      button('no_act_fix', 'Устранить недостатки без акта', complaintModals.default),
    ],
  },
  {
    condition: condition('act', 'BUYER_QUALITY_MANAGER'),
    title: 'Формирование акта о выявленных недостатках',
    buttons: [
      {
        text: 'В двустороннем порядке',
        isActionBtn: true,
        exec: (stores: IStores) =>
          modalWithDoc({
            stores,
            title: 'В двустороннем порядке',
            docTypes: [3, 5],
            status: 'fix_method',
          }),
      },
      {
        text: 'В одностороннем порядке',
        exec: (stores: IStores) =>
          modalWithDoc({
            stores,
            title: 'В одностороннем порядке',
            docTypes: [4, 5],
            status: 'fix_method',
          }),
      },
      {
        text: 'Устранение представителем',
        isActionBtn: true,
        exec: (stores: IStores) =>
          stores.activeComplaint.changeStatus('fix', {
            fixingMethodDate: new Date(),
            fixingMethod: FIXING_TYPES.REPAIR,
          }),
      },
    ],
  },
  {
    condition: condition('no_act_fix', 'BUYER_QUALITY_MANAGER'),
    title: 'Поставщик предлагает устранить недостатки без акта',
    buttons: [
      button('fix_method', 'Согласовать', NO_MODAL, IS_BLACK),
      button('representative', 'Отклонить', complaintModals.rejectNoActFix),
    ],
  },
  {
    condition: condition('docs_update', 'BUYER_QUALITY_MANAGER'),
    title: 'Внесение дополнительных документов',
    description: 'Внесите дополнительные документы',
    buttons: [button('representative', 'Отправить', complaintModals.comment, IS_BLACK)],
  },
  {
    condition: condition('fix_method', 'CUSTOMER_MANAGER'),
    title: 'Выберите метод устранения недостатков',
    buttons: [
      {
        text: 'Выбрать',
        isActionBtn: false,
        exec: ({ modals, activeComplaint }: IStores) => {
          modals.openModal(complaintModals.chooseFixingMethod, data => {
            activeComplaint.changeStatus('fix_method_approving', {
              ...data,
              fixingMethodDate: new Date(),
            });
          });
        },
      },
    ],
  },
  {
    condition: condition('fix_method_approving', 'BUYER_QUALITY_MANAGER'),
    title: (stores: IStores) =>
      'Поставщик предлагает ' +
      stores.catalogs.getFixingTypesName(stores.activeComplaint.data.fixingMethod),
    buttons: [
      button('fix', 'Подтвердить', NO_MODAL, IS_BLACK),
      {
        text: 'Отклонить',
        isActionBtn: false,
        exec: ({ modals, activeComplaint }: IStores) => {
          modals.openModal(complaintModals.comment, data => {
            activeComplaint.data.fixingMethodCounter =
              (activeComplaint.data.fixingMethodCounter || 0) + 1;

            activeComplaint.changeStatus('fix_method', data);
          });
        },
      },
      {
        condition: ({ activeComplaint: ac }) => ac.data.fixingMethodCounter >= 2,
        text: 'Претензионная работа',
        isActionBtn: true,
        exec: ({ activeComplaint: ac, modals }: IStores) =>
          modals.openModal(complaintModals.comment, data => ac.changeStatus('claim_work', data)),
      },
    ],
  },
  {
    condition: condition('fix', 'CUSTOMER_MANAGER'),
    title: 'Устранение недостатков',
    description: 'Пожалуйста, сообщите, как только недостатки будут устранены.',
    buttons: [
      {
        condition: ({ activeComplaint: ac }) => ac.data.fixingMethod === FIXING_TYPES.REPLACE,
        text: 'Создать допоставку',
        isActionBtn: true,
        exec: ({ routing }: IStores) => {
          routing.push('complaint/add-delivery');
        },
      },
      {
        condition: ({ activeComplaint: ac }) => ac.data.fixingMethod === FIXING_TYPES.REPAIR,
        text: 'Недостатки устранены',
        isActionBtn: true,
        exec: ({ activeComplaint }: IStores) => activeComplaint.changeStatus('fix_approving'),
      },
      {
        condition: ({ activeComplaint: ac }) => ac.data.fixingMethod === FIXING_TYPES.REJECT,
        text: 'Недостатки устранены',
        isActionBtn: true,
        exec: (stores: IStores) => stores.activeComplaint.changeStatus('fix_approving'),
        // stores.modals.openModal(complaintModals.comment, data =>
        //   stores.activeComplaint.changeStatus('fix_approving', data)
        // ),
        // exec: (
        //   stores: IStores // TODO comment modal
        // ) =>
        //   modalWithDoc({
        //     stores,
        //     title: 'Недостатки устранены',
        //     docTypes: [6],
        //     status: 'fix_approving',
        //   }),
      },
    ],
  },
  {
    condition: condition('fix_approving', 'BUYER_QUALITY_MANAGER'),
    title: 'Подтверждение устранения недостатков',
    description: 'Пожалуйста, сообщите, как только недостатки будут устранены.',
    buttons: [
      {
        text: 'Закрыть рекламацию',
        isActionBtn: true,
        exec: (stores: IStores) => {
          // const status = 'complaint_closed';

          stores.modals.openModal(complaintModals.comment, data =>
            stores.activeComplaint.changeStatus('complaint_closed', data)
          );
          // switch (stores.activeComplaint.data.fixingMethod) {
          //   case FIXING_TYPES.REJECT:
          //     return stores.activeComplaint.changeStatus(status);
          //   case FIXING_TYPES.REPAIR:
          //     return modalWithDoc({ stores, title: 'Закрытие рекламации', docTypes: [6], status });
          //   case FIXING_TYPES.REPLACE:
          //     return modalWithDoc({ stores, title: 'Закрытие рекламации', docTypes: [7], status });
          // }
        },
      },

      button('fix', 'Отклонить', complaintModals.comment),
      button('claim_work', 'Претензионная работа', complaintModals.comment, IS_BLACK),
    ],
  },
  // Претензионная работа
  {
    condition: condition('claim_work', 'BUYER_QUALITY_MANAGER'),
    title: 'Ведется претензионная работа',
    description: 'Пожалуйста, сообщите, как только недостатки будут устранены.',
    buttons: [
      button(
        'claim_work_fixed',
        'Подтвердить устранение недостатков',
        complaintModals.comment,
        IS_BLACK
      ),
    ],
  },
  // Финальные статусы
  {
    condition: condition('complaint_closed'),
    title: 'Рекламация закрыта',
    description: 'Недостатки устранены полностью и в срок, рекламационная работа завершена.',
  },
  {
    condition: condition('claim_work_fixed'),
    title: 'Рекламация закрыта',
    description: 'Недостатки устранены поставщиком.',
  },
];
