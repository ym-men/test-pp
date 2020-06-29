import * as React from 'react';
import { Button, If, Text, FormConstructor } from 'components/ui';
import { Box, Layer } from 'grommet';
import { observer } from 'mobx-react';
import { action, computed, observable, toJS } from 'mobx';
import { Entities } from '../../../../../entities';
import TLocation = Entities.TLocation;

@observer
export class AddLocationModal extends React.Component<IProps> {
  @computed
  get formConfig() {
    return [
      {
        type: 'container',
        props: {
          direction: 'column',
          justify: 'between',
        },
        options: [
          {
            type: 'textInput',
            valueType: 'string',
            field: 'location',
            title: 'Местоположение груза',
            required: true,
          },
          {
            type: 'calendar',
            valueType: 'date',
            field: 'dateToUpdate',
            title: 'Ожидаемая дата прибытия',
            required: true,
          },
        ],
      },
    ];
  }

  @computed
  get isValid() {
    return this.location.location && this.location.locationDate && this.location.dateToUpdate;
  }

  private defaultData: TLocation = {
    location: '',
    locationDate: new Date(),
    dateToUpdate: new Date(),
  };

  @observable private location: TLocation = this.defaultData;

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.location = nextProps.data;
    }
  }

  public render() {
    return (
      <If condition={this.props.isShow}>
        <Layer style={{ width: 665 }} modal={true} onEsc={this.onCloseHandler}>
          <Box pad={'large'}>
            <Text margin={{ bottom: 'small' }} type="title">
              Обновление хода поставки
            </Text>
            <FormConstructor
              onChangeData={this.onChange}
              errors={{}}
              formOptions={this.formConfig}
              data={this.location}
            />
            <Box direction="row" pad={{ top: 'large' }} justify={'start'}>
              <Button
                id="delivery-addLocationModal-button-add"
                disabled={!this.isValid}
                action={true}
                small={true}
                onClick={this.onApproveHandler}
              >
                Добавить
              </Button>
              <Button
                id="delivery-addLocationModal-button-cancel"
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
    this.location = { ...toJS(this.location), [field]: value };
  }

  private onCloseHandler = () => {
    this.props.onClose();
    this.location = this.defaultData;
  };

  private onApproveHandler = () => {
    this.props.onApply(this.location);
    this.props.onClose();
    this.location = this.defaultData;
  };
}

interface IProps {
  isShow: boolean;
  data?: TLocation;
  onClose: () => void;
  onApply: (data: TLocation) => void;
}
