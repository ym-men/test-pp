import * as React from 'react';
import { TextArea, TextAreaProps } from 'grommet';
import * as cn from 'classnames';
import * as styles from './Input.styl';

const TYPE = 'textArea';

export class TextAreaForm extends React.PureComponent<TextAreaForm.TProps> {
  public static type = TYPE;

  public render() {
    const { config = {} as TextAreaForm.TConfig, errors } = this.props;
    const hasError = errors && errors.length;
    const className = cn(styles.input, { [styles.error]: hasError });
    return (
      <TextArea
        onChange={(e: any) => this.props.onChangeData(e.target.value)}
        error={hasError}
        disabled={config.disabled}
        value={this.props.value}
        {...config.props as any}
        className={className}
      />
    );
  }
}

export namespace TextAreaForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: string;
    errors?: Array<string>;
  };
  export type TConfig = {
    type: typeof TYPE;
    valueType?: 'string' | 'number' | 'integer' | null | undefined;
    props?: TextAreaProps & JSX.IntrinsicElements['input'] | null;
    disabled?: boolean;
    required?: boolean;
  };
}
