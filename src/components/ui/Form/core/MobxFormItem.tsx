import * as _ from 'lodash';
import { autorun } from 'mobx';
import { observer, PropTypes } from 'mobx-react';
import * as React from 'react';
import { checkIsRequired } from '../helpers';
import { MobxForm, IRuleObj } from './MobxForm';
import { isRequired } from '../validations';

export interface IBasicMobxFormItemProps {
  changeTouchEvent?: string;
  name: string;
  label?: string | React.ReactNode | JSX.Element;
  required?: any;
  rules?: ReadonlyArray<object>;
  labelCol?: any;
  wrapperCol?: any;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  componentClassName?: string;
  componentStyle?: React.CSSProperties;
  onChange?(value: any): void;
  normalize?(value: any): any;
  [propName: string]: any;
}

export interface IFieldParams {
  component: any;
  wrapper: any;
  mobxFormItemProps?: Partial<IBasicMobxFormItemProps>;
  componentParams?: any;
  wrapperParams?: any;
  normalize?(value: any): any;
}

export interface IMobxFormItemProps extends IBasicMobxFormItemProps {
  name: string;
  fieldParams?: IFieldParams;
}

@observer
export class MobxFormItem extends React.Component<IMobxFormItemProps> {
  public static contextTypes = {
    form: PropTypes.observableObject, // the form object
    defaultItemProps: PropTypes.observableObject, // global default FormItem props
  };
  public context: {
    form: MobxForm;
    defaultItemProps: object;
  };

  public rules: IRuleObj[];
  public isRequired: boolean;

  public changeTouchEvent = 'onBlur';

  constructor(props: IMobxFormItemProps) {
    super(props);

    this.rules = props.rules || _.get(props, 'fieldParams.componentParams.rules') || [];

    if (!_.isArray(this.rules)) {
      this.rules = [this.rules];
    }
    const hasRequiredRule = checkIsRequired(this.rules);

    if (props.required && !hasRequiredRule) {
      // add required rule
      this.rules = this.rules.concat(isRequired);
    }

    this.isRequired = hasRequiredRule || props.required;
  }

  public componentDidMount() {
    const { form } = this.context;
    const { name } = this.props;

    const validFiled = _.debounce((value: any, rules: any) => {
      if (form.fieldTouched.get(name)) {
        form.validateField(name, value, rules);
      }
    }, 200);

    autorun(() => {
      if (form.fieldTouched.get(name)) {
        validFiled(form.getFieldValue(name), this.rules);
      }
    });
  }

  public componentWillUnmount() {
    const { removeField } = this.context.form;

    removeField(this.props.name);
  }

  public handlerOnTouch = () => {
    this.context.form.touchedField(this.props.name);
  };

  public render() {
    const { getFieldProps, getFieldValue } = this.context.form;
    const {
      onChange,
      label,
      labelCol,
      wrapperCol,
      wrapperClassName,
      wrapperStyle = {},
      componentClassName,
      componentStyle = {},
      name,
      fieldParams,
      rules,
      help,
      normalize,
      wrapperRef,
      componentRef,
      changeTouchEvent = this.changeTouchEvent,
      ...otherProps
    } = this.props;

    const {
      component: Component,
      wrapper: Wrapper,
      wrapperParams = {},
      componentParams = {},
    } = fieldParams;

    const userComponentProps: any = {};
    if (componentClassName) {
      userComponentProps.className = componentClassName;
    }
    if (!_.isEmpty(componentStyle)) {
      userComponentProps.style = componentStyle;
    }
    // generate component props
    const componentProps = getFieldProps(name, {
      ...componentParams,
      rules: this.rules,
      otherProps: {
        ref: componentRef,
        ...otherProps,
        ...userComponentProps,
      },
      onChange,
    });

    // generate wrapper props
    const wrapperProps = _.merge({}, this.props, wrapperParams, {
      label,
      labelCol,
      wrapperCol,
      style: wrapperStyle,
      className: wrapperClassName,
      required: this.isRequired,
      rootRef: wrapperRef,
    });

    const err = this.context.form.getFieldError(name);
    const hasError = Boolean(err && err.length);

    if (hasError) {
      wrapperProps.validateStatus = 'error';
      wrapperProps.help = err.map(({ message }: any) => [message, ' ']);
    } else {
      wrapperProps.validateStatus = componentProps.value
        ? (wrapperProps.validateStatus = 'success')
        : '';
    }

    let onValueChange = componentProps.onChange;

    if (_.isFunction(normalize)) {
      const onValueChangeOld = onValueChange;
      onValueChange = (value: any) => {
        const normalizeValue = normalize(value);

        if (normalizeValue !== false) {
          onValueChangeOld(normalizeValue);
        }
      };
    }

    if ('onChange' === changeTouchEvent) {
      const onValueChangeOld = onValueChange;
      onValueChange = (value: any) => {
        onValueChangeOld(value);
        this.handlerOnTouch();
      };
    } else {
      componentProps[changeTouchEvent] = this.handlerOnTouch;
    }

    return (
      <Wrapper {...wrapperProps} {...this.context.defaultItemProps}>
        <Component {...componentProps} onChange={onValueChange} data-value={getFieldValue(name)} />
      </Wrapper>
    );
  }
}
