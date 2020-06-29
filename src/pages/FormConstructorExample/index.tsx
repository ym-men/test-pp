import * as React from 'react';
import { Box } from 'grommet';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button } from 'components/ui';
import { FormConstructor } from 'components/ui/Form';
import { IStores } from 'mobx-stores/stores';
import { Step1Form } from 'components/Contracts/components/ContractForm/FormConfig';

@inject('catalogs')
@observer
export class FormConstructorExample extends React.Component<Pick<IStores, 'catalogs'>> {
  @observable private form: any;
  @observable private formData = {};

  @computed
  get config() {
    return Step1Form(this.props.catalogs.data);
  }

  public onSubmit = () => {
    console.log(this.formData);

    this.form
      .validateFields()
      .then((data: any) => console.log(data))
      .catch((e: any) => console.log(e));
  };

  public render() {
    return (
      <Box align="center" justify="center" height="calc(100vh - 200px)">
        <Box margin="medium">
          <FormConstructor
            ref={(formRef: any) => (this.form = formRef)}
            data={this.formData}
            config={this.config}
          />
        </Box>
        <Button id="formExample-button-send" onClick={this.onSubmit}>
          Отправить
        </Button>
      </Box>
    );
  }
}
