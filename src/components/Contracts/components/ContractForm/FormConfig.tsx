import { FormConstructor } from 'components/ui';
import TFormOption = FormConstructor.TFormOption;
import * as styles from './ContractForm.styl';
import { catalogs } from 'services';
import ORGANIZATION_TYPE = catalogs.ORGANIZATION_TYPE;
import { Entities } from '../../../../../entities';
import IOrganization = Entities.IOrganization;
import TOrganizationType = Entities.TOrganizationType;
import TContract = Entities.TContract;
import ICatalogs = Entities.ICatalogs;
import { isDateAfter } from 'components/ui/Form';

const getSelectOptionsFromCatalog = (type: TOrganizationType) => (data: IOrganization[]) =>
  data
    .filter((item: IOrganization) => item.type === type)
    .map((item: IOrganization) => ({ text: item.name, value: item.id }));

export const STEP_INFO = {
  FORM: 1,
  FILES: 2,
  SEND: 3,
};
export const AVAILABLE_FILE_EXTENSIONS = ['png', 'jpg', 'pdf', 'tif'];
export const STEPS = [
  {
    id: STEP_INFO.FORM,
    text: 'Ввод данных',
    className: '',
  },
  {
    id: STEP_INFO.FILES,
    text: 'Загрузка документов',
    className: '',
  },
  {
    id: STEP_INFO.SEND,
    text: 'Отправка',
    className: '',
  },
];

//       validateBy(ERROR_MESSAGES.DATE_FROM, contract =>
//         moment(contract.date).isAfter(contract.dateFrom)
//       )
//     )
//       validateBy(ERROR_MESSAGES.DATE_TO, contract =>
//         moment(contract.dateFrom).isAfter(contract.dateTo)
//
export const Step1Form: (catalogs: ICatalogs) => Array<TFormOption<TContract>> = catalog => [
  {
    type: 'text',
    text: 'Данные договора',
    className: styles.deleteMargin,
    props: {
      className: styles.step1FormTitle,
    },
    field: null,
  },
  {
    type: 'tabs',
    options: (catalog.contractTypes || []).map(item => ({
      id: item.id,
      text: item.name,
    })),
    title: 'Тип',
    field: 'type',
    disabled: false,
    required: true,
  },
  {
    type: 'container',
    className: '',
    options: [
      {
        type: 'textInput',
        field: 'number',
        title: 'Номер',
        required: true,
        className: styles.groupInput,
        props: {
          autoFocus: true,
          maxLength: 100,
        },
      },
      {
        type: 'textInput',
        field: 'subject',
        title: 'Предмет договора',
        required: true,
        className: styles.groupInputLast,
        props: {
          maxLength: 100,
        },
      },
    ],
    props: {
      direction: 'row',
      justify: 'start',
    },
  },
  {
    type: 'container',
    className: '',
    options: [
      {
        type: 'calendar',
        valueType: 'date',
        field: 'date',
        title: 'Дата составления',
        required: true,
        className: styles.groupInput,
        props: {
          locale: 'ru',
        },
      },
      {
        type: 'calendar',
        valueType: 'date',
        field: 'dateFrom',
        title: 'Дата подписания',
        rules: [isDateAfter('date', 'Дата подписания должна быть позже даты составления договора')],
        required: true,
        className: styles.groupInput,
        props: {
          locale: 'ru',
        },
      },
      {
        type: 'calendar',
        field: 'dateTo',
        valueType: 'date',
        title: 'Дата завершения',
        rules: [isDateAfter('dateFrom', 'Дата завершения должна быть позже даты подписания')],
        required: true,
        className: styles.groupInputLast,
        props: {
          locale: 'ru',
        },
      },
    ],
    props: {
      direction: 'row',
      justify: 'start',
    },
  },
  {
    type: 'container',
    className: '',
    options: [
      {
        type: 'select',
        field: 'buyer',
        title: 'Покупатель',
        required: true,
        className: styles.groupInput,
        options: getSelectOptionsFromCatalog(ORGANIZATION_TYPE.BUYER)(catalog.organizations || []),
      },
      {
        type: 'select',
        field: 'supplier',
        title: 'Поставщик',
        options: getSelectOptionsFromCatalog(ORGANIZATION_TYPE.SUPPLIER)(
          catalog.organizations || []
        ),
        required: true,
        className: styles.groupInputLast,
      },
    ],
    props: {
      direction: 'row',
      justify: 'start',
    },
  },
];
