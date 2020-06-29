import * as React from 'react';
// import { isWebsite, isRequired, isEmail } from 'components/ui/Form/validations';
import { Title } from 'components/ui/FormConstructor/components/Title';
import { Text } from 'components/ui';
import { createField } from 'components/ui/Form';
import { Box, TextInput } from 'grommet';

import { TextForm as TextFormComponent } from './Text';
import { TabsForm as TabsFormComponent } from './Tabs';
import { SelectForm as SelectFormComponent } from './Select';
import { CalendarForm as CalendarFormComponent } from './Calendar';

const DefaultWrapper = (props: any) => (
  <Box margin={{ bottom: 'small' }} className={props.className}>
    {props.title ? <Title text={props.title} /> : null}
    {props.children}
    <Box margin={{ top: 'xsmall' }}>
      <Text size="14px" color="Red600">
        {props.help}
      </Text>
    </Box>
  </Box>
);

export const Input = createField({
  wrapper: DefaultWrapper,
  wrapperParams: { hasFeedback: true },
  component: TextInput,
});

export const TextForm = createField({
  wrapper: DefaultWrapper,
  wrapperParams: { hasFeedback: true },
  component: (props: any) => <TextFormComponent value={props.value} config={props} />,
});

export const TabsForm = createField({
  wrapper: DefaultWrapper,
  wrapperParams: {},
  component: (props: any) => (
    <TabsFormComponent onChangeData={props.onChange} value={props.value} config={props} />
  ),
});

export const SelectForm = createField({
  wrapper: DefaultWrapper,
  wrapperParams: {},
  component: (props: any) => (
    <SelectFormComponent onChangeData={props.onChange} value={props.value} config={props} />
  ),
});

export const CalendarForm = createField({
  wrapper: DefaultWrapper,
  wrapperParams: {},
  component: (props: any) => (
    <CalendarFormComponent onChangeData={props.onChange} value={props.value} config={props} />
  ),
});
