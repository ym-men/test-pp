import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react';
import { MobxForm } from 'components/ui/Form';
import { IWrappedComponent } from 'components/ui/Form/core';
import { FormComponent } from './FormComponent';

import { FormConstructor as TFormConstructor } from 'components/ui/FormConstructor';

interface IFormConstructorProps<T> {
  config: Array<TFormConstructor.TFormOption<T>>;
  data?: any;
  boxProps?: any;

  renderElement?: string;
  className?: string;
  style?: React.CSSProperties;
  prefix?: string;
  children?: React.ReactNode;
  layout?: 'horizontal' | 'vertical' | 'inline';
  ref?: any;
  validateFieldsOnly?: string[];
  onSubmit?(e: Event): void;
  onValidSubmit?(): void;
}

@observer
export class FormConstructor extends MobxForm<IFormConstructorProps<any>> {
  public prefix: any;

  constructor(props: IFormConstructorProps<any>) {
    super(props as any);

    this.prefix = this.props.prefix;
  }

  public handlerOnSubmit = (e: Event) => {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(e);
    }

    if (this.props.onValidSubmit) {
      this.validateFields()
        .then(this.props.onValidSubmit)
        .catch();
    }
  };

  public renderFormOptions = (options: any): any => {
    return options.map((params: any, index: number) => {
      const field = params.field || `f_${index}`;
      const key = `${params.type}_${field}_${index}`;

      const isFirst = index === 0;
      const isLast = options.length - index === 1;

      const cmpProps = { ...params, isFirst, isLast, field };

      switch (params.type) {
        case 'container':
          return (
            <Box key={key} {...params.props} className={params.className}>
              {this.renderFormOptions(params.options)}
            </Box>
          );

        case 'custom':
          const Custom = params.component;

          return (
            <Custom
              key={key}
              {...cmpProps}
              data={this.props.data}
              onChangeData={(d: any) => console.log(d)}
            />
          );

        default:
          return <FormComponent key={key} {...cmpProps} />;
      }
    });
  };

  public WrappedComponent: IWrappedComponent<IFormConstructorProps<any>> = (
    props: IFormConstructorProps<any>
  ) => {
    const { renderElement } = props;
    const renderTagName = renderElement || 'form';

    const formProps = {
      onSubmit: renderTagName === 'form' ? this.handlerOnSubmit : null,
    };

    return React.createElement(
      renderTagName,
      { ...props, ...formProps },
      this.renderFormOptions(this.props.config)
    );
  };
}
