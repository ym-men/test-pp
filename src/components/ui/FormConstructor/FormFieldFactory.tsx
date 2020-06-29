import {
  TextForm,
  TabsForm,
  InputForm,
  SelectForm,
  CalendarForm,
  CheckboxForm,
  TextAreaForm,
  DropFileForm,
} from './components';
import { Box } from 'grommet';
import { pipe, defaultTo, propEq, find } from 'ramda';

const components = [
  TextForm,
  TabsForm,
  InputForm,
  SelectForm,
  CalendarForm,
  CheckboxForm,
  TextAreaForm,
  DropFileForm,
];

export const getComponentByType = pipe(
  (type: string) => find(propEq('type', type), components),
  defaultTo(Box)
);
