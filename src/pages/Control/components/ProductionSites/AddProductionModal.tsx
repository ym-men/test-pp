import * as React from 'react';
import { Button, If, Text, FormConstructor } from 'components/ui';
import { Box, Layer } from 'grommet';
import { observer } from 'mobx-react';
import { action, computed, observable, toJS } from 'mobx';
import { Entities } from '../../../../../entities';
import TProduction = Entities.TProduction;

@observer
export class AddProductionModal extends React.Component<IProps> {
  @computed
  get formConfig() {
    return [
      {
        type: 'container',
        className: '',
        props: {
          direction: 'column',
          justify: 'between',
        },
        options: [
          {
            type: this.props.deleteMode ? 'text' : 'textInput',
            valueType: 'string',
            field: 'address',
            title: 'Адрес',
            required: true,
          },
          {
            type: this.props.deleteMode ? 'text' : 'textInput',
            valueType: 'string',
            field: 'name',
            title: 'ФИО контактного лица',
            required: true,
          },
          {
            type: this.props.deleteMode ? 'text' : 'textInput',
            valueType: 'string',
            field: 'phone',
            title: 'Телефон',
            required: true,
          },
        ],
      },
    ];
  }

  @computed
  get isValid() {
    return this.production.name && this.production.address && this.production.phone;
  }

  private defaultData: TProduction = {
    address: '',
    name: '',
    phone: '',
  };

  @observable private production: TProduction = this.defaultData;

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.production = nextProps.data;
    }
  }

  public render() {
    const { isShow } = this.props;

    const headerText = this.props.deleteMode
      ? 'Удаление производственной площадки'
      : 'Добавление производственной площадки';

    return (
      <If condition={isShow}>
        <Layer style={{ width: 665 }} modal={true} onEsc={this.onCloseHandler}>
          <Box pad={'large'}>
            <Text margin={{ bottom: 'small' }} type="title">
              {headerText}
            </Text>
            <FormConstructor
              onChangeData={this.onChange}
              errors={{}}
              formOptions={this.formConfig}
              data={this.production}
            />
            <Box direction="row" pad={{ top: 'large' }} justify={'start'}>
              <Button
                id="control-addProductionModal-button-addOrDelete"
                disabled={!this.isValid}
                action={true}
                small={true}
                onClick={this.onApproveHandler}
              >
                {!this.props.deleteMode ? 'Добавить' : 'Удалить'}
              </Button>
              <Button
                id="control-addProductionModal-button-cancel"
                style={{ marginLeft: 20 }}
                small={true}
                onClick={this.onCloseHandler}
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
  private onChange(value: any, oldValue: any, field: string) {
    this.production = { ...toJS(this.production), [field]: value };
  }

  private onCloseHandler = () => {
    this.props.onClose();
    this.production = this.defaultData;
  };

  private onApproveHandler = () => {
    this.props.onApply(this.production);
    this.props.onClose();
    this.production = this.defaultData;
  };
}

interface IProps {
  isShow: boolean;
  deleteMode?: boolean;
  data?: TProduction;
  onClose: () => void;
  onApply: (data: TProduction) => void;
}
