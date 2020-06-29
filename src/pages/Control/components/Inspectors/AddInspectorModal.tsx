import * as React from 'react';
import { Button, If, Text, FormConstructor } from 'components/ui';
import { Box, Layer } from 'grommet';
import { observer } from 'mobx-react';
import { action, computed, observable, toJS } from 'mobx';
import { Entities } from '../../../../../entities';
import TInspector = Entities.TInspector;

@observer
export class AddInspectorModal extends React.Component<IProps> {
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
            field: 'name',
            title: 'ФИО контактного лица',
            required: true,
            className: '',
          },
          {
            type: this.props.deleteMode ? 'text' : 'textInput',
            valueType: 'string',
            field: 'phone',
            title: 'Телефон',
            required: true,
            className: '',
          },
        ],
      },
    ];
  }

  @computed
  get isValid() {
    return this.inspector.name && this.inspector.phone;
  }

  private defaultData: TInspector = {
    name: '',
    phone: '',
  };

  @observable private inspector: TInspector = this.defaultData;

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.inspector = nextProps.data;
    }
  }

  public render() {
    const { isShow } = this.props;

    const headerText = this.props.deleteMode ? 'Удаление инспектора' : 'Добавление инспектора';

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
              data={this.inspector}
            />
            <Box direction="row" pad={{ top: 'large' }} justify={'start'}>
              <Button
                id="control-addInspectorModal-button-add"
                disabled={!this.isValid}
                action={true}
                small={true}
                onClick={this.onApproveHandler}
              >
                {!this.props.deleteMode ? 'Добавить' : 'Удалить'}
              </Button>
              <Button
                id="control-addInspectorModal-button-cancel"
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
    this.inspector = { ...toJS(this.inspector), [field]: value };
  }

  private onCloseHandler = () => {
    this.props.onClose();
    this.inspector = this.defaultData;
  };

  private onApproveHandler = () => {
    this.props.onApply(this.inspector);
    this.props.onClose();
    this.inspector = this.defaultData;
  };
}

interface IProps {
  isShow: boolean;
  deleteMode?: boolean;
  data?: TInspector;
  onClose: () => void;
  onApply: (data: TInspector) => void;
}
