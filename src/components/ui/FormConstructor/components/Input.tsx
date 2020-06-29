import * as React from 'react';
import { TextInput, TextInputProps } from 'grommet';
import * as styles from './Input.styl';
import * as cn from 'classnames';

const TYPE = 'textInput';

export class InputForm extends React.PureComponent<InputForm.TProps> {
  public static type = TYPE;

  public static getDerivedStateFromProps(props: InputForm.TProps, state: IState): Partial<IState> {
    if (props.config && (!props.config.valueType || props.config.valueType === 'string')) {
      return { value: props.value == null ? '' : props.value };
    }

    if (!Number(props.value) === !Number(state.value)) {
      return state;
    }

    if (Number(props.value) !== Number(state.value)) {
      const value = props.value == null ? '' : props.value;
      return { value };
    }

    return state;
  }

  public readonly state = { value: '' };

  public render() {
    const { config = {} as InputForm.TConfig, errors, id } = this.props;
    const hasError = errors && errors.length;
    const className = cn(styles.input, { [styles.error]: hasError });
    return (
      <TextInput
        id={id}
        onChange={this.changeHandler}
        error={hasError}
        disabled={config.disabled}
        value={this.state.value}
        {...config.props as any}
        className={className}
      />
    );
  }

  protected changeHandler = (e: any) => {
    const value = e.target.value;
    let val = this.validateValueByType(value);

    if (this.props.config.normalize) {
      val = this.props.config.normalize(val);
    }

    if (val == null) {
      return;
    }

    this.setState({ value: val });
    if (this.props.onChangeData) {
      this.props.onChangeData(val);
    }
  };

  protected validateValueByType(value: string): string | number | null {
    const type =
      this.props.config && this.props.config.valueType ? this.props.config.valueType : 'string';

    switch (type) {
      case 'string':
        return value;
      case 'number':
        value = value.replace(/[^-\d.]/g, '');
        if (value === '-') {
          return '-';
        }
        if (
          isNaN(Number(value)) ||
          (value[0] === '0' && Number(value[1]) <= 9) ||
          (value[0] === '-' && value[1] === '0' && Number(value[2]) <= 9)
        ) {
          return null;
        }
        return value;
      case 'integer':
        const res = Math.floor(Number(value));
        return isNaN(res) ? null : res;
      default:
        return null;
    }
  }
}

interface IState {
  value: string | number;
}

export namespace InputForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: string;
    errors?: Array<string>;
    id?: string;
  };
  export type TConfig = {
    type: typeof TYPE;
    valueType?: 'string' | 'number' | 'integer' | null | undefined;
    props?: TextInputProps & JSX.IntrinsicElements['input'] | null;
    disabled?: boolean;
    required?: boolean;
    normalize?: (s: any) => any;
  };
}
