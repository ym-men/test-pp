import * as React from 'react';
import { Input, TabsForm, TextForm, SelectForm, CalendarForm } from './Fields';

interface IFormComponentProps {
  field: string;
  type: string;
  isLast?: boolean;
  isFirst?: boolean;
  title?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  props?: any;
  rules?: any[];
  options?: any[];
}

export class FormComponent extends React.Component<IFormComponentProps> {
  public render() {
    const cmpProps = { ...this.props, name: this.props.field };

    switch (this.props.type) {
      case 'text':
        return <TextForm {...cmpProps} />;

      case 'tabs':
        return <TabsForm {...cmpProps} />;

      case 'select':
        return <SelectForm {...cmpProps} />;

      case 'calendar':
        return <CalendarForm {...cmpProps} />;

      default:
        return <Input {...cmpProps} />;
    }
  }
}
