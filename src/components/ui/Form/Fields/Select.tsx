import * as React from 'react';
import { Box, Select, SelectProps } from 'grommet';
import * as styles from './Select.styl';
import * as cn from 'classnames';

const TYPE = 'select';

export class SelectForm extends React.PureComponent<SelectForm.TProps, TState> {
  public static type = TYPE;

  public static getDerivedStateFromProps(props: SelectForm.TProps) {
    const { config, onChangeData } = props;
    const { value } = props;

    let selected = SelectForm.getItemByValue(config.options, value);
    let changed = false;

    if (config.required && !selected) {
      selected = config.options[0];
      changed = true;
    }

    if (changed) {
      onChangeData(SelectForm.getValue(selected));
    }

    return { value: SelectForm.getRenderValue(selected) };
  }

  protected static getRenderValue(item: SelectForm.TOption | null): any {
    if (item == null) {
      return null;
    }
    return typeof item === 'string' ? item : item.text;
  }

  protected static getValue(item: SelectForm.TOption | null): any {
    if (item == null) {
      return null;
    }
    return typeof item === 'string' ? item : item.value;
  }

  protected static getItemByValue(
    options: Array<SelectForm.TOption>,
    value: any
  ): SelectForm.TOption | null {
    return options.find(item => SelectForm.getValue(item) === value) || null;
  }

  public readonly state = { value: '' };

  public render() {
    const { config } = this.props;
    const { value } = this.state;
    const renderOptions = config.options.map(SelectForm.getRenderValue);
    return (
      <Box className={cn(styles.select, config.className)}>
        <Select
          onChange={this.changeHandler}
          options={renderOptions}
          value={value}
          {...config.props}
        />
      </Box>
    );
  }

  protected changeHandler = (e: { selected: number }) => {
    if (this.props.onChangeData) {
      const selected = this.props.config.options[e.selected];
      this.props.onChangeData(typeof selected === 'string' ? selected : selected.value);
    }
  };
}

export namespace SelectForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: string | number | null;
    errors?: Array<string>;
  };

  export type TConfig = {
    type: typeof TYPE;
    inlineSelect?: boolean;
    className?: string;
    props?: Partial<SelectProps> | null;
    disabled?: boolean;
    required?: boolean;
    options: Array<TOption>;
  };

  export type TOption =
    | {
        value: any;
        text: string | number | React.ReactNode;
      }
    | string;
}

type TState = {
  value: string;
};
