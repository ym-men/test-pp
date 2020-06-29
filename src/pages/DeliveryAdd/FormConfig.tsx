import { FormConstructor } from 'components/ui';
import TFormOption = FormConstructor.TFormOption;
import * as styles from './DeliveryForm.styl';
import { pipe, prop } from 'ramda';
import {
  validateConstructor,
  validate,
  validateBy,
  simpleValidate,
  TValidate,
} from 'utils/validators';
import ITransportType = Entities.ITransportType;
import { required } from 'utils/validators';
import { Entities } from '../../../entities';
import TDelivery = Entities.TDelivery;
import ICatalogs = Entities.ICatalogs;
import IQuantityType = Entities.IQuantityType;
import * as moment from 'moment';

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

const ERROR_MESSAGES = {
  REQUIRED: 'Поле обязательно для заполнения.',
  DATE_FROM: 'Дата подписания должна быть позже даты составления договора.',
  DATE_TO: 'Дата завершения должна быть позже даты подписания.',
  NUMBER_MAX_LENGTH: 'Превышена максимальная длина номера договора',
};

const requiredValidator = validateBy(ERROR_MESSAGES.REQUIRED, required);

export const validateConf: Array<ReturnType<TValidate<TDelivery>>> = [
  simpleValidate('number', requiredValidator),
  simpleValidate('mtrName', requiredValidator),

  simpleValidate('transportId', requiredValidator),
  simpleValidate('transportType', requiredValidator),

  simpleValidate('quantity', requiredValidator),
  validate(
    'dateFrom',
    validateConstructor(
      pipe(
        prop('dateFrom'),
        requiredValidator
      ),
      validateBy(ERROR_MESSAGES.DATE_FROM, (delivery: TDelivery) =>
        moment(new Date().setHours(0, 0, 0, 0)).isAfter(delivery.dateFrom)
      )
    )
  ),
  validate(
    'dateTo',
    validateConstructor(
      pipe(
        prop('dateTo'),
        requiredValidator
      ),
      validateBy(ERROR_MESSAGES.DATE_TO, (delivery: TDelivery) =>
        moment(delivery.dateFrom.setHours(0, 0, 0, 0)).isAfter(delivery.dateTo)
      )
    )
  ),
];

export const Step1Form: (catalogs: ICatalogs) => Array<TFormOption<TDelivery>> = catalog => [
  {
    type: 'text',
    text: 'Данные поставки',
    className: styles.deleteMargin,
    props: {
      className: styles.step1FormTitle,
    },
    field: null,
  },
  {
    type: 'container',
    className: styles.row1Style,
    options: [
      {
        type: 'textInput',
        field: 'number',
        title: 'Номер поставки',
        required: true,
        className: styles.groupInput,
        props: {
          autoFocus: true,
        },
      },
      {
        type: 'textInput',
        field: 'mtrName',
        title: 'Поставляемые МТР',
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
        type: 'select',
        field: 'transportType',
        title: 'Вид транспорта',
        required: true,
        className: styles.groupInput,
        options: (catalog.transportTypes || []).map((item: ITransportType) => ({
          text: item.name,
          value: item.id,
        })),
      },
      {
        type: 'textInput',
        field: 'transportId',
        title: 'Номер транспортного средства',
        required: true,
        className: styles.groupInputLast,
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
        field: 'quantity',
        valueType: 'integer',
        title: 'Объем поставки',
        required: true,
        className: styles.groupInput,
      },
      {
        type: 'select',
        field: 'quantityType',
        title: 'Единица измерения',
        options: catalog.quantityTypes.map((item: IQuantityType) => {
          return {
            text: item.name,
            value: item.id,
          };
        }),
        required: true,
        className: styles.groupInput,
      },
      {
        type: 'calendar',
        valueType: 'date',
        field: 'dateFrom',
        title: 'Дата погрузки',
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
        title: 'Планируемая дата поставки',
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
];
