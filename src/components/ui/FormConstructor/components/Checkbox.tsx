import * as React from 'react';
import { CheckBox, CheckBoxProps } from 'grommet';

const TYPE = 'checkbox';

export class CheckboxForm extends React.PureComponent<CheckboxForm.TProps> {
  public static type = TYPE;

  public render() {
    const { config, value } = this.props;

    return (
      <CheckBox
        onChange={this.changeHandler}
        disabled={config.disabled}
        checked={!!value}
        label={config.label}
        {...config.props as any}
      />
    );
  }

  protected changeHandler = (e: any) => {
    const val = e.target.checked;
    if (this.props.onChangeData) {
      this.props.onChangeData(val);
    }
  };
}

export namespace CheckboxForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: string;
    errors?: Array<string>;
    id?: string;
  };
  export type TConfig = {
    type: typeof TYPE;
    props?: CheckBoxProps & JSX.IntrinsicElements['input'] | null;
    disabled?: boolean;
    label?: string | React.ReactNode | React.ReactText;
  };
}
