import { IModalConfig } from 'components/Modals';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../../entities';
import IFixingType = Entities.IFixingType;

export const modals: Record<string, IModalConfig> = {
  rejectNoActFix: {
    title: 'Отклонение предложения',
    fields: [
      {
        type: 'textArea',
        field: 'comment',
        title: 'Комментарий',
        required: true,
      },
    ],
    description: 'Вы не согласны устранять недостатки без акта и ждете прибытия представителя.',
    okBtn: 'Подтвердить',
  },
  comment: {
    title: 'Добавьте комментарий и подтвердите действие',
    fields: [
      {
        type: 'textArea',
        field: 'comment',
        title: 'Комментарий',
        required: true,
      },
    ],
    okBtn: 'Подтвердить',
  },
  sendRepresentative: {
    title: 'Направление представителя',
    fields: [
      {
        type: 'dropFile',
        field: 'document',
        title: 'Официальное письмо о направлении представителя',
        props: {
          documentType: 2,
        },
        required: true,
      },
      {
        type: 'textInput',
        field: 'representativeName',
        title: 'ФИО представителя',
        required: true,
      },
      {
        type: 'textInput',
        field: 'representativePhone',
        title: 'Телефон',
        required: true,
      },
    ],
    okBtn: 'Подтвердить',
  },
  chooseFixingMethod: {
    title: 'Метод устранения недостатков',
    fields: [
      {
        type: 'select',
        options: [],
        genOptions: (stores: IStores) =>
          stores.catalogs.data.fixingTypes.map((item: IFixingType) => ({
            text: item.name,
            value: item.id,
          })),
        required: true,
        field: 'fixingMethod',
        title: '',
      },
    ],
    okBtn: 'Отправить',
  },
};
