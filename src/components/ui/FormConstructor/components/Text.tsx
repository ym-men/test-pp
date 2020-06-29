import * as React from 'react';
import { Text, TextProps, Heading } from 'grommet';
import { If, IfElse } from '../../If';

const TYPE = 'text';

export class TextForm extends React.PureComponent<TextForm.TProps> {
  public static type = TYPE;

  public render() {
    const { config, value } = this.props;
    const isText = ['string', 'number'].includes(typeof config.text) || !config.text;
    return (
      <React.Fragment>
        <If condition={isText}>
          <If condition={config.isHeader || config.isSubheader}>
            <Heading size={config.isSubheader ? 'small' : 'medium'}>
              {' '}
              {config.text || value || null}
            </Heading>
          </If>
          <IfElse condition={config.isHeader || config.isSubheader}>
            <Text {...config.props as any}>{config.text || value || null}</Text>
          </IfElse>
        </If>
        <If condition={!isText}>{config.text}</If>
      </React.Fragment>
    );
  }
}

export namespace TextForm {
  export type TProps = {
    config: TConfig;
    onChangeData?: any;
    value: string | number | null | React.ReactNode;
    errors?: Array<string>;
  };

  export type TConfig = {
    type: typeof TYPE;
    text?: string | React.ReactNode | React.ReactText;
    props?: TextProps & { className?: string } | null;
    isHeader?: boolean;
    isSubheader?: boolean;
  };
}
