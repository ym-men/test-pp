import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { FormComponent } from './FormComponent';

export class FormConstructor<T, F extends keyof T> extends React.PureComponent<
  FormConstructor.TFormProps<T>
> {
  public render(): React.ReactNode {
    const { data, errors, onChangeData, props, boxProps } = this.props;

    return (
      <Box {...props}>
        {this.props.formOptions.map((params: FormConstructor.TFormOption<T>, index: number) => {
          const { field = '' } = params as FormComponent.TConfig<T, keyof T> & { field: '' };
          const isContainer = params.type === 'container';
          const isCustom = params.type === 'custom';
          const key = `${params.type}_${field}_${index}`;
          const Custom = params.type === 'custom' ? params.component : null;
          const isFirst = index === 0;
          const isLast = this.props.formOptions.length - index === 1;

          if (isCustom) {
            return (
              <Custom
                key={key}
                data={data}
                errors={errors}
                isFirst={isFirst}
                isLast={isLast}
                {...params}
                onChangeData={onChangeData}
              />
            );
          }

          if (isContainer) {
            return (
              <FormConstructor
                key={key}
                data={data}
                errors={errors}
                boxProps={boxProps}
                onChangeData={onChangeData}
                formOptions={(params as FormConstructor.TGroupConfig<T>).options}
                className={(params as FormConstructor.TGroupConfig<T>).className}
                props={params.props}
              />
            );
          }
          const formParams = params as FormComponent.TConfig<T, F>;
          formParams.boxProps = { ...boxProps, ...formParams.boxProps };
          return (
            <FormComponent
              key={key}
              params={formParams}
              data={data}
              errors={errors}
              onChangeData={onChangeData}
              isFirst={isFirst}
              isLast={isLast}
            />
          );
        })}
        {this.props.children}
      </Box>
    );
  }
}

export namespace FormConstructor {
  export type TFormProps<T extends Record<string | number, any>> = BoxProps &
    React.ComponentProps<any> & {
      onChangeData: (newValue: T[keyof T], oldValue: T[keyof T], field: keyof T) => void;
      errors: { [key in keyof T]: Array<string> };
      formOptions: Array<TFormOption<T>>;
      data: T;
      className?: string;
      props?: BoxProps;
    };

  export type TFormOption<T extends Record<string | number, any>> =
    | FormComponent.TConfig<T, keyof T>
    | TGroupConfig<T>
    | TCustomConfig<T>;

  export type TGroupConfig<T> = {
    type: 'container';
    options: Array<FormComponent.TConfig<T, keyof T>>;
    className?: string;
    props?: BoxProps;
  };

  export type TCustomConfig<T> = {
    type: 'custom';
    component: any;
    className?: string;
    props?: any;
  };
}
