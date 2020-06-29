import * as React from 'react';
import { getComponentByType } from './FormFieldFactory';
import { path, prop, equals, dissoc } from 'ramda';
import { TOptions } from './components';
import { Box, BoxProps } from 'grommet';
import { Title } from './components/Title';

export class FormComponent<T, F extends keyof T> extends React.Component<
  TFormComponentProps<T, F>
> {
  public shouldComponentUpdate(
    nextProps: Readonly<TFormComponentProps<T, F>>,
    nextState: Readonly<{}>,
    nextContext: any
  ): boolean {
    if (nextProps.params.field) {
      return (
        !equals(nextProps.data[nextProps.params.field], this.props.data[nextProps.params.field]) ||
        !equals(dissoc('data', nextProps), dissoc('data', this.props))
      );
    } else {
      return !equals(nextProps, this.props);
    }
  }

  public render(): React.ReactNode {
    const { params, children } = this.props;
    const Item = getComponentByType(params.type);
    const field = path(['params', 'field'], this.props) as string;
    const { boxProps, ...config } = params as FormComponent.TConfig<T, F>;
    let canShow = true;

    if (config.canShow) {
      canShow = config.canShow(this.props.data);
    }

    let isDisabled = false;

    if (config.isDisabled) {
      isDisabled = config.isDisabled;
    }

    const args = {
      config: { ...config, disabled: isDisabled },
      value: field ? path([field], this.props.data) : this.props.data,
      errors: field ? path([field], this.props.errors) : this.props.errors,
      onChangeData: (field && this.onChangeHandler) || this.props.onChangeData,
    };

    return canShow ? (
      <Box margin={{ top: '15px' }} className={params.className} {...boxProps}>
        {(params.title && <Title text={params.title} />) || null}
        <Item id={`formComponent-${params.type}-${field}`} {...args}>
          {children}
        </Item>
      </Box>
    ) : null;
  }

  protected onChangeHandler = (newValue: T[F]) => {
    const field = path(['params', 'field'], this.props) as F;
    const oldValue = prop(field, this.props.data);
    this.props.onChangeData(newValue, oldValue, field);
  };
}

type TFormComponentProps<T, F extends keyof T> = {
  errors: Array<string>;
  params: FormComponent.TConfig<T, F>;
  onChangeData: (newValue: T[F], oldValue: T[F], field: F) => void;
  data: T;
  isFirst?: boolean;
  isLast?: boolean;
};

export namespace FormComponent {
  export type TConfig<T, F extends keyof T> = { field: F | null | undefined } & TBoxProps &
    TOptions &
    TTitleProps &
    TClassProps &
    TOtherOptions<T>;
}

type TBoxProps = { boxProps?: BoxProps };
type TClassProps = { className?: string };
type TTitleProps = { title?: any };
type TOtherOptions<T> = {
  canShow?: (data: T) => boolean;
  isDisabled?: boolean;
};
