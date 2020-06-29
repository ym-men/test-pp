import * as React from 'react';

import * as cn from 'classnames';
import * as styles from './Input.styl';
import { DropFileSingle, DropFileSingleProps } from 'components/ui';

const TYPE = 'dropFile';

export class DropFileForm extends React.PureComponent<DropFileForm.TProps> {
  public static type = TYPE;

  public render() {
    const { config = {} as DropFileForm.TConfig & DropFileSingleProps, errors } = this.props;
    const hasError = errors && errors.length;
    const className = cn(styles.input, { [styles.error]: hasError });
    const hideTypeOptions = config.props
      ? config.props.hideTypeOptions === undefined
        ? true
        : config.props.hideTypeOptions
      : true;
    return (
      <DropFileSingle
        onChange={this.props.onChangeData}
        onRemove={() => this.props.onChangeData()}
        error={hasError}
        hideTitle={true}
        hideTypeOptions={hideTypeOptions}
        documentType={config.props && config.props.documentType}
        disabled={config.disabled}
        value={this.props.value}
        {...config.props as any}
        className={className}
      />
    );
  }
}

export namespace DropFileForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: string;
    errors?: Array<string>;
  };
  export type TConfig = {
    type: typeof TYPE;
    props?: {
      documentType?: number;
      hideTypeOptions?: boolean;
    };
    disabled?: boolean;
    required?: boolean;
  };
}
