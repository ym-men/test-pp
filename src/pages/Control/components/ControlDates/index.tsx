import * as React from 'react';
import { Box } from 'grommet';
import * as styles from './ControlMain.styl';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { FormConstructor, Text } from 'components/ui';
import { action, computed } from 'mobx';
import * as moment from 'moment';

@inject('activeControl', 'access')
@observer
export class ControlDates extends React.Component<IStores> {
  @computed
  private get access() {
    return this.props.access.components.dates;
  }

  @computed
  private get formsConfig() {
    return [
      {
        type: 'container',
        className: '',
        props: {
          direction: 'row',
          justify: 'between',
        },
        options: [
          {
            type: this.access.isEditable ? 'calendar' : 'text',
            valueType: 'string',
            field: 'dateStart',
            title: 'Начало',
            required: true,
            className: '',
            props: {
              locale: 'ru',
            },
          },
          {
            type: this.access.isEditable ? 'calendar' : 'text',
            valueType: 'string',
            field: 'dateEnd',
            title: 'Завершение',
            required: true,
            className: styles.dateInput,
            props: {
              locale: 'ru',
            },
          },
        ],
      },
    ];
  }

  @computed
  private get data() {
    const { activeControl } = this.props;

    const formatData = (date: any) =>
      this.access.isEditable ? date : moment(date).format('MMMM Do YYYY');

    return {
      dateStart: formatData(activeControl.data.dateStart),
      dateEnd: formatData(activeControl.data.dateEnd),
    };
  }

  public render() {
    if (!this.access.isVisible) {
      return null;
    }

    return (
      <Box direction="column">
        <Text type="title">Даты проведения контроля</Text>
        <FormConstructor
          onChangeData={this.onChange}
          errors={{}}
          formOptions={this.formsConfig}
          data={this.data}
        />
      </Box>
    );
  }

  @action.bound
  private onChange(value: any, oldValue: any, field: string) {
    this.props.activeControl.data[field] = value;
  }
}
