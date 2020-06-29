import * as styles from './OrderForm.styl';
import { FormConstructor } from 'components/ui/FormConstructor';
import { PositionsForm } from './components/PositionsForm';
import { catalogs } from 'services/catalogs';
import { filter, map, propEq, pipe } from 'ramda';
import ORGANIZATION_TYPE = catalogs.ORGANIZATION_TYPE;
import { Entities } from '../../../../../entities';
import {
  simpleValidate,
  TValidate,
  validateBy,
  required,
  validateSimpleList,
} from 'utils/validators';
import ICatalogs = Entities.ICatalogs;
import TFormOption = FormConstructor.TFormOption;
import IOrganization = Entities.IOrganization;
import TOrganizationType = Entities.TOrganizationType;

const getSelectOptionsFromCatalog = (type: TOrganizationType) =>
  pipe(
    filter(propEq('type', type)),
    map((item: IOrganization) => ({ text: item.name, value: item.id }))
  );

export const STEP_INFO = {
  FORM: 1,
  FILES: 2,
  SEND: 3,
};

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

const ERROR_MESSAGES = {
  REQUIRED: 'Поле обязательно для заполнения.',
};

const requiredValidator = validateBy(ERROR_MESSAGES.REQUIRED, required);
// const dateToCompareString = (date: Date) => ([date.getFullYear(), date.getMonth(), date.getDay()].join('.'));
// const compareDate = (a: Date, b: Date) => dateToCompareString(a) < dateToCompareString(b);

export const validateConf: Array<ReturnType<TValidate<Entities.TOrder>>> = [
  simpleValidate('number', requiredValidator),
  simpleValidate('acceptDate', requiredValidator),
  simpleValidate('toleranceFrom', requiredValidator),
  simpleValidate('toleranceTo', requiredValidator),
  validateSimpleList(
    'mtrs',
    simpleValidate('code', requiredValidator),
    simpleValidate('name', requiredValidator),
    simpleValidate('quantity', requiredValidator),
    simpleValidate('receiver', requiredValidator),
    simpleValidate('mtrDeliveryAddress', requiredValidator),
    simpleValidate('date', requiredValidator)
  ),
];

export const Step1Form: (
  catalog: ICatalogs
) => Array<TFormOption<Entities.TOrder & { contractNumber: string }>> = catalog => [
  {
    type: 'text',
    text: 'Данные разнарядки',
    className: styles.deleteMargin,
    props: {
      className: styles.step1FormTitle,
    },
    field: null,
  },
  {
    type: 'container',
    className: '',
    options: [
      {
        type: 'textInput',
        field: 'contractNumber',
        title: 'Номер договора',
        required: true,
        className: styles.groupInput,
        props: {
          disabled: true,
        },
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
        props: {
          disabled: true,
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
        type: 'textInput',
        field: 'number',
        title: 'Номер разнарядки',
        required: true,
        className: styles.groupInput,
      },
      {
        type: 'calendar',
        valueType: 'string',
        field: 'acceptDate',
        title: 'Дата утверждения',
        required: true,
        className: styles.groupInput,
        props: {
          locale: 'ru',
        },
      },
      {
        type: 'textInput',
        field: 'toleranceFrom',
        valueType: 'number',
        title: 'Толеранс от',
        className: styles.groupInput,
      },
      {
        type: 'textInput',
        field: 'toleranceTo',
        valueType: 'number',
        title: 'до',
        className: styles.groupInputLast,
      },
    ],
    props: {
      direction: 'row',
      justify: 'start',
    },
  },
  {
    type: 'custom',
    component: PositionsForm,
  },
];
