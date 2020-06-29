export * from './Text';
export * from './Tabs';
export * from './Input';
export * from './Select';
export * from './InlineSelect';
export * from './Calendar';
export * from './Checkbox';
export * from './TextArea';
export * from './DropFile';

import { TextForm } from './Text';
import { TabsForm } from './Tabs';
import { InputForm } from './Input';
import { SelectForm } from './Select';
import { CalendarForm } from './Calendar';
import { CheckboxForm } from './Checkbox';
import { TextAreaForm } from './TextArea';
import { DropFileForm } from './DropFile';

export type TOptions =
  | TextForm.TConfig
  | TabsForm.TConfig
  | InputForm.TConfig
  | SelectForm.TConfig
  | CalendarForm.TConfig
  | CheckboxForm.TConfig
  | TextAreaForm.TConfig
  | DropFileForm.TConfig;
