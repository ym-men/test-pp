import * as React from 'react';
import { Box, Layer } from 'grommet';
import { Button, If, Text, FormConstructor } from 'components/ui';
import { action, autorun, computed, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { modals, TModalConfig } from './config';
import { AddFileModal } from './AddFileModal';

export type TDeliveryModals =
  | 'approveArrivalBuyer'
  | 'approveArrivalCustomer'
  | 'approveDocuments'
  | 'rejectDocuments'
  | 'acceptDelivery'
  | 'custodyDelivery'
  | 'addDocument'
  | 'createComplaint'
  | 'none';

@inject('activeDelivery')
@observer
export class DeliveryModal extends React.Component<IStores> {
  @observable
  private formData = {};

  public constructor(props: any) {
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
    return modals[this.props.activeDelivery.displayModal];
  }

  @computed
  private get disabled() {
    const keys = Object.keys(toJS(this.formData));

    return Boolean(keys.length && keys.some(key => !this.formData[key]));
  }

  public render() {
    const { activeDelivery } = this.props;

    // TODO very strong customized
    if (activeDelivery.displayModal === 'addDocument') {
      return (
        <AddFileModal
          isShow={true}
          onApply={activeDelivery.onModalApply}
          onClose={activeDelivery.closeModal}
        />
      );
    }

    const config: TModalConfig = this.config;

    if (!config) {
      return null;
    }

    return (
      <If condition={activeDelivery.displayModal !== 'none'}>
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
                id={`delivery-deliveryModal-${activeDelivery.displayModal}-button-apply`}
                small={true}
                action={true}
                disabled={this.disabled}
                onClick={() => this.onApply()}
              >
                {config.okBtn}
              </Button>
              <Button
                id={`delivery-deliveryModal-${activeDelivery.displayModal}-button-cancel`}
                small={true}
                margin={{ left: 'medium' }}
                onClick={() => this.onClose()}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        </Layer>
      </If>
    );
  }

  @action.bound
  private onChangeData(value: any, oldValue: any, field: string) {
    this.formData = { ...toJS(this.formData), [field]: value };
  }

  private onApply() {
    this.props.activeDelivery.onModalApply(toJS(this.formData));
    this.onClose();
  }

  private onClose() {
    this.props.activeDelivery.closeModal();
    this.formData = {};
  }
}
