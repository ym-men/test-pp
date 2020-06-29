import { Box, Layer } from 'grommet';
import { action, autorun, computed, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { IStores } from 'mobx-stores/stores';
import { Button, FormConstructor, If, Text } from 'components/ui';
import TFormOption = FormConstructor.TFormOption;

export type TModalField = TFormOption<any> & { genOptions?: any };

export interface IModalConfig {
  title: string;
  okBtn?: string;
  description?: string;
  fields?: Array<TModalField>;
}

@inject('modals')
@observer
export class Modals extends React.Component<IStores> {
  @observable
  private formData = {};

  constructor(props: any) {
    super(props);

    autorun(() => {
      const isFormDataEmpty = !Object.keys(toJS(this.formData)).length;

      if (this.config && this.config.fields && isFormDataEmpty) {
        this.config.fields.forEach((field: any) => (this.formData[field.field] = ''));
      }
    });
  }

  @computed
  private get config() {
    return this.props.modals.config;
  }

  @computed
  private get disabled() {
    const keys = Object.keys(toJS(this.formData));

    return Boolean(keys.length && keys.some(key => !this.formData[key]));
  }

  public render() {
    const { modals } = this.props;

    const config: IModalConfig = this.config;

    if (!modals.displayModal || !config) {
      return null;
    }

    return (
      <Layer modal={true} onEsc={() => this.onClose()} style={{ width: 665 }}>
        <Box pad={'large'}>
          <Text margin={{ bottom: 'small' }} type="title">
            {config.title}
          </Text>
          <If condition={config.description}>
            <Text margin={{ bottom: 'small' }}>{config.description}</Text>
          </If>
          {config.fields ? (
            <Box margin={{ vertical: 'small' }}>
              <FormConstructor
                onChangeData={this.onChangeData}
                errors={{}}
                formOptions={config.fields}
                data={this.formData}
                boxProps={{ margin: { top: '30px' } }}
              />
            </Box>
          ) : null}
          <Box direction="row" justify={'start'} margin={{ top: 'medium' }}>
            <Button
              id="modal-button-ok"
              small={true}
              action={true}
              disabled={this.disabled}
              onClick={() => this.onApply()}
            >
              {config.okBtn}
            </Button>
            <Button
              id="modal-button-cancel"
              small={true}
              margin={{ left: 'medium' }}
              onClick={() => this.onClose()}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      </Layer>
    );
  }

  @action.bound
  private onChangeData(value: any, oldValue: any, field: string) {
    this.formData = { ...toJS(this.formData), [field]: value };
  }

  private onApply() {
    this.props.modals.onModalApply(toJS(this.formData));
    this.onClose();
  }

  private onClose() {
    this.props.modals.closeModal();
    this.formData = {};
  }
}
