import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Text } from 'components/ui';

import { MobxForm, Form, createField } from 'components/ui/Form';
import { isWebsite, isRequired, isEmail } from 'components/ui/Form/validations';
import { Title } from 'components/ui/FormConstructor/components/Title';

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

const Input = createField({
  wrapper: DefaultWrapper,
  wrapperParams: { hasFeedback: true },
  component: TextInput,
});

@observer
export class FormExample extends React.Component {
  @observable public formData = {
    name: '',
    email: '',
    website: '',
  };

  private form: MobxForm;

  public onSubmit = () => {
    this.form
      .validateFields()
      .then(data => console.log(data))
      .catch(e => console.log(e));
  };

  public render() {
    return (
      <Box align="center" justify="center" height="calc(100vh - 200px)">
        <Form
          ref={(formRef: any) => (this.form = formRef)}
          data={this.formData}
          onSubmit={this.onSubmit}
        >
          <Input name="name" title="Имя" rules={[isRequired]} />
          <Input name="email" title="Email" rules={[isRequired, isEmail]} />
          <Input name="website" title="Website" rules={[isRequired, isWebsite]} />
          <Box margin={{ top: 'medium' }}>
            <Button id="formExample-button-send" onClick={this.onSubmit}>
              Отправить
            </Button>
          </Box>
        </Form>
      </Box>
    );
  }
}
