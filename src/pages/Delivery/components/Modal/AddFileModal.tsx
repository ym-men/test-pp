import * as React from 'react';
import { Box, Layer } from 'grommet';
import { Button, If, Text, FormConstructor } from 'components/ui';
import { Entities } from '../../../../../entities';
import { action, computed, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import TDocument = Entities.TDocument;
import { simpleValidate, TValidate, validateBy, required, applyValidators } from 'utils/validators';

interface IProps {
  isShow: boolean;
  onClose: () => void;
  onApply: (formData: IFormData) => void;
}

export interface IFormData {
  doc: TDocument;
  comment: string;
  carrierComment: string;
  email: string;
  sendNotification: boolean;
}

const ERROR_MESSAGES = {
  REQUIRED: 'Поле обязательно для заполнения.',
};

const requiredValidator = validateBy(ERROR_MESSAGES.REQUIRED, required);

@inject('user')
@observer
export class AddFileModal extends React.Component<IProps & IStores> {
  private defaultData: IFormData = {
    doc: null,
    comment: '',
    carrierComment: '',
    email: '',
    sendNotification: false,
  };
  @observable
  private errors = {};
  @observable
  private formData = this.defaultData;

  @computed
  private get disabled() {
    return !this.formData.doc || this.formData.doc.type === null;
  }
  private validateConf: Array<ReturnType<TValidate<any>>> = [];

  private allowedDocumentTypes: number[] = [4, 5, 6, 7, 8, 9];

  private allowedDocumentTypesCustomer: number[] = [0, 1, 2, 3, 7, 10, 9];

  constructor(props: IStores & IProps) {
    super(props);
    this.resetValidators();
  }

  @computed
  get formConfig() {
    const options: any[] = [
      {
        type: 'dropFile',
        field: 'doc',
        required: true,
        props: {
          namespace: 'delivery',
          hideTypeOptions: false,
          allowedDocumentTypes:
            this.props.user.role === 'CUSTOMER_MANAGER'
              ? this.allowedDocumentTypesCustomer
              : this.allowedDocumentTypes,
        },
      },
    ];

    if (this.formData.doc && this.formData.doc.type === 4) {
      options.push(
        {
          type: 'textArea',
          valueType: 'string',
          field: 'comment',
          title: 'Причина формирования акта',
          required: true,
          className: '',
          isDisabled: this.disabled,
        },
        {
          type: 'checkbox',
          field: 'sendNotification',
          label: 'Уведомить перевозчика',
          className: '',
        }
      );
    }

    if (this.formData.sendNotification) {
      options.push(
        {
          type: 'textInput',
          valueType: 'string',
          field: 'email',
          title: 'Электронная почта',
          required: true,
          className: '',
          isDisabled: this.disabled,
        },
        {
          type: 'textInput',
          valueType: 'string',
          field: 'carrierComment',
          title: 'Комментарий перевозчику',
          required: true,
          className: '',
          isDisabled: this.disabled,
        }
      );
    }

    return [
      {
        type: 'container',
        className: '',
        props: {
          direction: 'column',
          justify: 'between',
        },
        options,
      },
    ];
  }

  public render() {
    const { isShow } = this.props;

    return (
      <If condition={isShow}>
        <Layer modal={true} onEsc={() => this.onClose()} style={{ width: 665, maxHeight: 706 }}>
          <Box pad="large">
            <Text margin={{ bottom: 'small' }} type="title">
              Добавление файла
            </Text>
            <FormConstructor
              onChangeData={this.onChangeData}
              errors={this.errors}
              formOptions={this.formConfig}
              data={this.formData}
              boxProps={{ margin: { top: '30px' } }}
            />
            <Box direction="row" margin={{ vertical: 'medium' }} justify={'between'}>
              <Button
                id="delivery-addFileModaladdDelivery-button-add"
                small={true}
                action={true}
                disabled={this.disabled}
                onClick={() => this.onApply()}
              >
                Добавить
              </Button>
              <Button
                id="delivery-addFileModaladdDelivery-button-cancel"
                small={true}
                onClick={() => this.onClose()}
              >
                Отмена
              </Button>
            </Box>
            <If condition={this.formData.doc === null}>
              <Box
              // margin={{ left: 'large', bottom: 'large' }}
              >
                <Text color="red" size="14px">
                  Пожалуйста, загрузите файл
                </Text>
              </Box>
            </If>
          </Box>
        </Layer>
      </If>
    );
  }

  @action.bound
  private onChangeData(value: any, oldValue: any, field: string) {
    this.formData = { ...toJS(this.formData), [field]: value };

    if (this.formData.doc.type === 4) {
      this.validateConf.push(simpleValidate('comment', requiredValidator));
    }

    if (this.formData.sendNotification) {
      this.validateConf.push(
        simpleValidate('email', requiredValidator),
        simpleValidate('carrierComment', requiredValidator)
      );
    } else {
      this.resetValidators();
    }
  }

  private resetValidators() {
    this.validateConf = [];
  }

  private onApply() {
    const result = applyValidators(this.validateConf)(this.formData);
    this.errors = result;
    if (Object.keys(result).length > 0) {
      return;
    }
    this.props.onApply(this.formData);
    this.onClose();
  }

  private onClose() {
    this.formData = this.defaultData;
    this.props.onClose();
  }
}
