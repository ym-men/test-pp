import * as React from 'react';
import { SelectForm } from './Select';
import { Box, Button, SelectProps, Text, Drop, BoxProps } from 'grommet';
import * as styles from './Select.styl';
import * as cn from 'classnames';
import { DownIcon } from '../../Icons';
import { dissoc, pipe } from 'ramda';

const TYPE = 'inlineSelect';

const ItemComponent = (props: any) => {
  return (
    <Text
      id={props.id}
      className={styles.inlineSelectItem}
      onClick={() => props.onClick(props.options)}
    >
      {props.value}
    </Text>
  );
};

export class InlineSelectForm extends SelectForm {
  public static type = TYPE;

  protected static getRenderValue(item: SelectForm.TOption | null): any {
    if (item == null) {
      return { options: item, value: null };
    }

    return { options: item, value: typeof item === 'string' ? item : item.text };
  }

  public readonly state = { isShow: false, value: '' } as any;
  public selectTarget = React.createRef();

  public componentWillUnmount(): void {
    this.removeClickout();
  }

  public render() {
    const { config, errors, ...args } = this.props;
    const boxProps = pipe(
      dissoc('onChangeData'),
      dissoc('value'),
      dissoc('errors')
    )(args);
    const value =
      this.state.value == null ? (this.props.config as any).placeholder : this.state.value;
    const renderOptions = config.options
      .map(InlineSelectForm.getRenderValue)
      .map((props, index) => (
        <ItemComponent
          id={`selectItem_${index}`}
          onClick={this.onSelectHandler}
          key={props.value}
          {...props}
        />
      ));

    return (
      <Box
        className={cn(styles.selectInline, { [styles.selectInlineError]: errors && errors.length })}
        ref={this.selectTarget as any}
        {...boxProps}
      >
        <Button
          id="inlineSelectForm-button"
          plain={true}
          onClick={this.onClickHandler}
          disabled={this.props.config.disabled}
        >
          <DownIcon size={'small'} />
          <Text margin={{ left: 'xsmall' }}>{value}</Text>
        </Button>
        {this.state.isShow && this.selectTarget.current ? (
          <Drop
            align={{ top: 'bottom', left: 'left' }}
            stretch={true}
            target={this.selectTarget.current as any}
            plain={true}
          >
            <Box className={styles.inlineSelectWrapper}>{renderOptions}</Box>
          </Drop>
        ) : null}
      </Box>
    );
  }

  protected onSelectHandler = (options: any) => {
    if (this.props.onChangeData) {
      this.props.onChangeData(options.value);
    }
  };

  protected addClickOut(): void {
    document.addEventListener('click', this.onClickHandler);
  }

  protected removeClickout(): void {
    document.removeEventListener('click', this.onClickHandler);
  }

  protected onClickHandler = () => {
    if (!this.state.isShow) {
      this.removeClickout();
      this.addClickOut();
    } else {
      this.removeClickout();
    }
    this.setState({ isShow: !this.state.isShow } as any);
  };
}

export namespace InlineSelectForm {
  export type TProps = BoxProps & {
    config: TConfig;
    placeholder: string;
    onChangeData?: any;
    value: string | number | null;
    errors?: Array<string>;
  };

  export type TConfig = {
    type: typeof TYPE;
    inlineSelect?: boolean;
    props?: Partial<SelectProps> | null;
    disabled?: boolean;
    required?: boolean;
    options: Array<TOption>;
  };

  export type TOption =
    | {
        value: any;
        text: string | number | React.ReactNode;
      }
    | string;
}
