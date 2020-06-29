import * as styles from '../../OrderForm.styl';
import { FormConstructor } from 'components/ui';

import { filter, map, pipe, propEq } from 'ramda';
import { catalogs } from 'services/catalogs';
import { Entities } from '../../../../../../../entities';
import ORGANIZATION_TYPE = catalogs.ORGANIZATION_TYPE;
import ICatalogs = Entities.ICatalogs;
import IOrganization = Entities.IOrganization;
import TOrganizationType = Entities.TOrganizationType;
import IQuantityType = Entities.IQuantityType;
import TMTR = Entities.TMTR;
import TFormOption = FormConstructor.TFormOption;
import { normalizeWithoutSpace, normalizePositiveDigit } from 'utils/formNormalizer';

const getSelectOptionsFromCatalog = (type: TOrganizationType) =>
  pipe(
    filter(propEq('type', type)),
    map((item: IOrganization) => ({ text: item.name, value: item.id }))
  );

export const PositionFormConfig: (catalog: ICatalogs) => Array<TFormOption<TMTR>> = catalog => [
  {
    type: 'textInput',
    field: 'code',
    title: 'Код МТР',
    required: true,
    normalize: normalizeWithoutSpace,
  },
  {
    type: 'textInput',
    field: 'name',
    title: 'Номенклатура',
    className: '',
  },
  {
    type: 'container',
    className: '',
    options: [
      {
        type: 'textInput',
        field: 'quantity',
        // valueType: 'integer',
        title: 'Объем поставки',
        required: true,
        className: styles.groupInput,
        normalize: normalizePositiveDigit,
      },
      {
        type: 'select',
        field: 'quantityType',
        title: 'Единица измерения',
        options: catalog.quantityTypes.map((item: IQuantityType) => ({
          text: item.name,
          value: item.id,
        })),
        required: true,
        className: styles.groupInputQuantityType,
      },
      {
        type: 'calendar',
        valueType: 'date',
        field: 'date',
        title: 'К дате',
        required: true,
        className: styles.groupInputDate,
        props: {
          locale: 'ru',
        },
        multiDates: true,
      },
    ],
    props: {
      direction: 'row',
      justify: 'start',
    },
  },
  {
    type: 'select',
    options: getSelectOptionsFromCatalog(ORGANIZATION_TYPE.BUYER)(catalog.organizations || []),
    required: true,
    field: 'receiver',
    title: 'Грузополучатель',
    className: '',
  },
  {
    type: 'textInput',
    field: 'mtrDeliveryAddress',
    title: 'Адрес поставки',
    className: '',
  },
  {
    type: 'checkbox',
    field: 'inspectionNeeded',
    label: 'Требуется инспекционный контроль',
    className: '',
  },
  {
    type: 'select',
    options: getSelectOptionsFromCatalog(ORGANIZATION_TYPE.CONTROL)(catalog.organizations || []),
    required: true,
    field: 'inspector',
    title: 'Инспекционная компания',
    lassName: '',
    canShow: data => data.inspectionNeeded,
  },
];
