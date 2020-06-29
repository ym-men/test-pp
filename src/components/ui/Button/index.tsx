import * as React from 'react';
import * as style from './Button.styl';
import * as cn from 'classnames';
import { Button as GButton, ButtonProps as GButtonProps, Box } from 'grommet';
import { Link, LinkProps } from 'react-router-dom';
import { file } from 'services/files';
import { TCb } from 'interface';
import { ChangeEvent } from 'react';
import { dissoc } from 'ramda';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Pending } from '../Pending';
import { If } from '..';

@observer
export class Button extends React.Component<Button.ButtonProps> {
  @observable private isProcessing: boolean;

  constructor(props: Button.ButtonProps) {
    super(props as any);
    this.isProcessing = this.props.isLoading || false;
  }

  public componentWillReceiveProps(nextProps: Button.ButtonProps) {
    if (nextProps.isLoading !== this.props.isLoading) {
      this.isProcessing = nextProps.isLoading;
    }
  }

  public render() {
    const { className, action, small, children, ...props } = this.props;
    const myClass = cn(style.button, className, { [style.small]: small, [style.action]: action });

    if (isLink(this.props)) {
      return (
        <Link className={cn(myClass, style.btnFromLink)} {...dissoc('btnType', props)}>
          {this.props.children}
        </Link>
      );
    }

    if (isAhref(this.props)) {
      return (
        <a
          id={this.props.id}
          className={cn(myClass, style.btnFromLink)}
          {...dissoc('btnType', props)}
        >
          {this.props.children}
        </a>
      );
    }

    if (isFileProps(this.props)) {
      return (
        <label className={cn(myClass, style.btnFile)}>
          {children}
          <input
            id={this.props.id}
            onChange={this.onChangeFile}
            value={''}
            accept={this.props.accept || ''}
            type="file"
          />
        </label>
      );
    }

    const gbuttonProps = props as any;
    const overridedProps: any = {
      ...props,
      disabled: this.isProcessing || gbuttonProps.disabled,
      label: '',
      onClick: async () => {
        if (this.isProcessing) {
          return;
        }
        if (isPromise(this.props)) {
          this.isProcessing = true;
        }
        await gbuttonProps.onClick();
        if (isPromise(this.props)) {
          this.isProcessing = false;
        }
      },
    };

    return (
      <GButton plain={true} className={myClass} {...overridedProps as any}>
        <Box style={{ visibility: this.isProcessing ? 'hidden' : 'visible' }}>
          {gbuttonProps.label || children}
        </Box>
        <If condition={this.isProcessing}>
          <Box direction="row" justify={'center'} align={'center'} className={style.pending}>
            <Pending pending={true} size="small" />
          </Box>
        </If>
      </GButton>
    );
  }

  private onChangeFile = (event: ChangeEvent<HTMLInputElement>): void => {
    let files = Array.from(event.target.files || []);
    const props = this.props as Button.TFile;

    if (props.accept) {
      files = files.filter(fileBlob => {
        return (props.accept || '').split(',').some(type => {
          const [application, extension] = type.split('/');
          const [fileApplication, fileType] = fileBlob.type.split('/');
          return application === fileApplication && (extension === '*' || extension === fileType);
        });
      });
    }

    if (!files.length) {
      return void 0;
    }

    file.upload(files).then((this.props as Button.TFile).onChange);

    this.forceUpdate();
  };
}

function isFileProps(data: Button.ButtonProps): data is Button.TFile {
  return 'btnType' in data && data.btnType === 'file';
}

function isLink(data: Button.ButtonProps): data is Button.TLink {
  return 'btnType' in data && data.btnType === 'link';
}

function isAhref(data: Button.ButtonProps): data is Button.TAhref {
  return 'btnType' in data && data.btnType === 'ahref';
}

function isPromise(data: Button.ButtonProps): data is Button.TPromise {
  return 'btnType' in data && data.btnType === 'promise';
}

export namespace Button {
  import IFileData = file.IFileData;
  export type ButtonProps = TLink | TAhref | TFile | TPromise | ButtonPropsBtn;

  type TBtnProps = {
    action?: boolean;
    small?: boolean;
    className?: string;
    id?: string;
    isLoading?: boolean;
  };

  export type ButtonPropsBtn = TBtnProps & GButtonProps & JSX.IntrinsicElements['button'];

  export type TLink = TBtnProps &
    LinkProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      btnType: 'link';
    };

  export type TAhref = TBtnProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      btnType: 'ahref';
    };

  export type TFile = TBtnProps & {
    btnType: 'file';
    onChange: TCb<Array<IFileData>>;
    accept?: string;
  };

  export type TPromise = ButtonPropsBtn & {
    btnType: 'promise';
  };
}
