import * as React from 'react';
import { Box } from 'grommet';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button } from 'components/ui';
import { FormConstructor } from 'components/ui/Form';
import { Step1Form } from 'components/Contracts/components/ContractForm/FormConfig';
import { IStores } from 'mobx-stores/stores';

interface IProps {
  onSubmit: () => void;
}

@inject('catalogs', 'activeContract')
@observer
export class StepFormNew extends React.Component<
  Pick<IStores, 'catalogs'> & Pick<IStores, 'activeContract'> & IProps
> {
  @observable private form: any;
  @observable private formData: any;

  @computed
  get config() {
    return Step1Form(this.props.catalogs.data);
  }

  constructor(props: IProps) {
    super(props);
    this.formData = { ...this.props.activeContract.data };
  }

  public onSubmit = () => {
    this.form
      .validateFields()
      .then((data: any) => {
        this.props.activeContract.data = data;
        this.props.onSubmit();
      })
      .catch((e: any) => console.log(e));
  };

  public render() {
    return (
      <Box align="start" justify="center">
        <Box margin={{ bottom: 'medium' }}>
          <FormConstructor
            ref={(formRef: any) => (this.form = formRef)}
            data={this.formData}
            config={this.config}
          />
        </Box>
        <Button id="contract-stepForm-button-continue" action={true} onClick={this.onSubmit}>
          Отправить
        </Button>
      </Box>
    );
  }
}
