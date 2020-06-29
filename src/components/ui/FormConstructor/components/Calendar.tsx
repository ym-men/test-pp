import * as React from 'react';
import * as styles from './Calendar.styl';
import * as cn from 'classnames';
import * as moment from 'moment';
import Calendar, { CalendarProps } from 'react-calendar';
import { DropButton, DropButtonProps, Box, TextInput, CheckBox } from 'grommet';
import { CalendarIcon } from '../../Icons';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Button, If } from 'components/ui';
import { datesToString, dateFormatToString, isNotEqualTwoDates, isArrayAndLenght } from 'utils';

const TYPE = 'calendar';

const DropButtonStyled = (props: any) => <DropButton {...props} />;

@observer
export class CalendarForm extends React.Component<CalendarForm.TProps> {
  public static type = TYPE;

  @observable private calendarOpened = false;
  @observable private monthChecked = false;
  @observable private startDate = new Date();
  private currentDates: Array<Date> = [];

  public getCalendarValue(internalValue: Date, externalValue: Date, monthChecked: boolean = false) {
    if (monthChecked && internalValue) {
      const startMonthDate = moment(internalValue)
        .startOf('month')
        .toDate();
      const endMonthDate = moment(internalValue)
        .endOf('month')
        .toDate();
      this.currentDates = [startMonthDate, endMonthDate];
      return this.currentDates;
    } else {
      const value = internalValue ? internalValue : externalValue;
      this.currentDates = [value, value];
      return this.currentDates;
    }
  }

  public componentWillMount(): void {
    const { config, value } = this.props;

    if (config.required) {
      const existValue = !!value;

      if (!existValue) {
        this.calendarChangeValueHandler(new Date().toISOString());
      }
    }
  }

  public render(): React.ReactNode {
    const hasError = !!(this.props.errors || []).length;
    const { config, value } = this.props;
    return (
      <DropButtonStyled
        className={cn(styles.dropBtn, { [styles.hasError]: hasError })}
        hasError={(this.props.errors || []).length}
        open={this.calendarOpened}
        disabled={config.disabled}
        onClose={() => {
          this.calendarOpened = false;
        }}
        onOpen={() => {
          this.calendarOpened = true;
          this.startDate = this.getDatePromProps() as Date;
          this.monthChecked =
            isArrayAndLenght(value as any[]) && isNotEqualTwoDates(value as Date[]);
        }}
        dropAlign={{ bottom: 'bottom', right: 'right' }}
        dropContent={
          <Box>
            <Calendar
              value={this.getCalendarValue(
                this.startDate,
                this.getDatePromProps() as Date,
                this.monthChecked
              )}
              onChange={this.calendarChangeValueHandler}
              onActiveDateChange={this.calendarActiveDataChangeHandler}
              onClickMonth={this.calendarClickMonthHandler}
              {...config.props}
            />
            <If condition={config.multiDates}>
              <Box direction="row" pad="small" justify="between">
                <CheckBox
                  label="Выбрать весь месяц"
                  checked={this.monthChecked}
                  onChange={this.monthChangeValueHandler}
                />
                <Button
                  label="Применить"
                  style={{ minWidth: 20, height: 30, lineHeight: '29px' }}
                  small={true}
                  action={true}
                  onClick={this.applyHandler}
                />
              </Box>
            </If>
          </Box>
        }
      >
        <Box direction="row" gap="medium" align="center" pad={{ right: 'small' }}>
          <TextInput
            style={{ cursor: 'pointer' }}
            type="text"
            plain={true}
            readOnly={true}
            value={this.getButtonTitle() || ''}
            size="small"
            className={styles.inputPadding}
          />
          <CalendarIcon color="black" style={config.multiDates ? { border: 'solid 1px' } : {}} />
        </Box>
      </DropButtonStyled>
    );
  }

  protected calendarChangeValueHandler = (...[value]: Array<any>) => {
    const { valueType } = this.props.config;
    let result;
    switch (valueType) {
      case 'number':
        result = new Date(value).getTime();
        break;
      case 'date':
        result = new Date(value);
        break;
      case 'moment':
        result = moment(new Date(value));
        break;
      default:
        result = value;
    }
    const { multiDates } = this.props.config;
    if (this.props.onChangeData) {
      this.props.onChangeData(
        this.monthChecked ? this.currentDates : multiDates ? [result, result] : result
      );
    }
    this.calendarOpened = false;
  };

  protected calendarActiveDataChangeHandler = (...[value]: Array<any>) => {
    this.startDate = value.activeStartDate;
  };

  protected calendarClickMonthHandler = (value: Date) => {
    this.startDate = value;
  };

  protected monthChangeValueHandler = (e: any) => {
    this.monthChecked = e.target.checked;
  };

  protected applyHandler = () => {
    if (this.props.onChangeData) {
      this.props.onChangeData(this.currentDates);
    }
    this.calendarOpened = false;
  };

  protected getDatePromProps(): CalendarForm.TDateTypeOrdinal | null {
    const { value } = this.props;
    if (value) {
      if (isArrayAndLenght(value)) {
        return this.props.value[0];
      } else {
        return this.props.value as any;
      }
    }
    return null;
  }

  protected getButtonTitle() {
    const { value } = this.props;
    if (value) {
      if (isArrayAndLenght(value)) {
        return datesToString(value as Date[]);
      } else {
        return dateFormatToString(value as Date);
      }
    }
    return 'Выберите дату';
  }

  protected getDateFromValue(): Date | null {
    const value = this.getDatePromProps();
    const { config } = this.props;
    if (!value) {
      return null;
    }

    const { valueType } = config;
    let result;
    switch (valueType) {
      case 'number':
        result = new Date(value as number);
        break;
      case 'date':
        result = value;
        break;
      case 'moment':
        result = (value as moment.Moment).toDate();
        break;
      default:
        result = new Date(value as string);
    }

    return result as Date;
  }
}

export namespace CalendarForm {
  export type TProps = (IStringValue | INumberValue | IDateValue | IMomentValue) & {
    onChangeData: (
      value: TDateTypeOrdinal | Array<number> | Array<string> | Array<Date> | Array<moment.Moment>
    ) => void;
    errors?: Array<string>;
  };
  export type TConfig = IConfig<CalendarForm.TDateType>;
  export type TDateType = 'string' | 'date' | 'number' | 'moment';
  export type TDateTypeOrdinal = number | string | Date | moment.Moment;
}

interface IConfig<T extends CalendarForm.TDateType> {
  type: typeof TYPE;
  valueType: T;
  className?: string;
  dropBtnProps?: DropButtonProps;
  props?: CalendarProps;
  disabled?: boolean;
  required?: boolean;
  multiDates?: boolean;
}

interface IStringValue {
  config: IConfig<'string'>;
  value: string | Array<string>;
}

interface INumberValue {
  config: IConfig<'number'>;
  value: number | Array<number>;
}

interface IDateValue {
  config: IConfig<'date'>;
  value: Date | Array<Date>;
}

interface IMomentValue {
  config: IConfig<'moment'>;
  value: moment.Moment | Array<moment.Moment>;
}
