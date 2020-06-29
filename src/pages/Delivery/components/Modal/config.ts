import * as styles from './styles.styl';
import { FormConstructor } from 'components/ui';
import TFormOption = FormConstructor.TFormOption;

export type TModalConfig = {
  title: string;
  okBtn?: string;
  description?: string;
  fields?: Array<TFormOption<any>>;
};

export const modals: Record<string, TModalConfig> = {
  approveArrivalBuyer: {
    title: 'Подтверждение прибытия груза',
    fields: [
      {
        type: 'calendar',
        valueType: 'date',
        field: 'dateArrivalBuyer',
        title: 'Дата фактического прибытия',
        required: true,
      },
    ],
    okBtn: 'Подтвердить',
  },
  approveArrivalCustomer: {
    title: 'Подтверждение прибытия груза',
    description: 'Груз прибыл и готов к приемке покупателем.',
    okBtn: 'Подтвердить',
  },
  approveDocuments: {
    title: 'Проверка технических и сопроводительных документов',
    description: 'Все необходимые документы предоставлены в полном объеме, претензий не имею.',
    okBtn: 'Подтвердить',
  },
  rejectDocuments: {
    title: 'Проверка технических и сопроводительных документов',
    fields: [
      {
        type: 'textArea',
        field: 'comment',
        title: 'Пожалуйста, опишите проблему',
        required: true,
      },
    ],
    okBtn: 'Отправить',
  },
  acceptDelivery: {
    title: 'Приемка груза',
    description: 'Груз доставлен и принят покупателем.',
    okBtn: 'Подтвердить',
  },
  custodyDelivery: {
    title: 'Передача груза на ответственное хранение',
    fields: [
      {
        type: 'dropFile',
        field: 'document',
        title: 'Акт о принятии на ответственное хранение',
        required: true,
        props: {
          documentType: 8,
        },
      },
      {
        type: 'textArea',
        field: 'comment',
        title: 'Комментарий',
        required: true,
      },
    ],
    okBtn: 'Передать',
  },
  createComplaint: {
    title: 'Вызов представителя поставщика и начало рекламации',
    fields: [
      {
        type: 'calendar',
        valueType: 'date',
        field: 'comissionDate',
        title: 'Дата проведения комиссии',
        required: true,
        className: styles.comissionDateWidth,
        props: {
          minDate: new Date(),
        },
      },
      {
        type: 'dropFile',
        field: 'document',
        title: 'Уведомление о вызове представителя поставщика',
        props: {
          documentType: 0,
        },
        required: true,
      },
    ],
    okBtn: 'Передать',
  },
  none: { title: 'Ожидайте подтверждения' },
};
