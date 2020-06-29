import * as React from 'react';
import { Tabs } from '../../Tabs';
import { TID } from '../../../../interface';

const TYPE = 'tabs';

export class TabsForm extends React.PureComponent<TabsForm.TProps, TState> {
  public static type = TYPE;

  public static getDerivedStateFromProps(props: TabsForm.TProps) {
    const { config, onChangeData } = props;
    let { value } = props;

    if (config.required) {
      const existValue = config.options.find(({ id }: { id: any }) => String(id) === String(value));

      if (!existValue) {
        value = config.options[0].id;
        onChangeData(value);
      }
    }

    return { value };
  }

  public readonly state = { value: '' };

  public render() {
    const { config } = this.props;
    const { value } = this.state;
    return (
      <Tabs
        onChange={this.changeHandler}
        tabs={config.options}
        selected={value}
        {...config.props}
      />
    );
  }

  private changeHandler = (val: string) => {
    if (this.props.onChangeData) {
      this.props.onChangeData(val);
    }
  };
}

export namespace TabsForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: TID;
    errors?: Array<string>;
  };

  export type TConfig = {
    type: typeof TYPE;
    props?: any;
    disabled?: boolean;
    required?: boolean;
    options: Array<ITabOptions>;
  };
}

interface ITabOptions {
  id: TID;
  text: string | React.ComponentType<any>;
  className?: string;
  disabled?: boolean;
}

type TState = {
  value: string;
};
