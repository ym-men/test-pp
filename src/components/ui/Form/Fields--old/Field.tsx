import { isEmail, isWebsite, def } from '../validations';
import { omit } from 'lodash';
import * as React from 'react';
import { createField } from '../core';

const DefaultWrapper = (props: any) => (
  <div className={typeof props.className !== 'undefined' ? props.className : ''}>
    {props.children}
    <p style={{ color: 'red' }}>{props.help}</p>
  </div>
);

const defaultFieldParams = {
  wrapper: DefaultWrapper,
  wrapperParams: { hasFeedback: false },
  component: (props: any) => <input {...omit(props, ['maskChar', 'mask'])} />,
};

export const Input = createField({
  ...defaultFieldParams,
});

export const Name = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...def.name],
  },
});

export const Email = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [isEmail],
  },
});

export const Address = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...def.address],
  },
});

export const Website = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [isWebsite],
  },
});

// export const Checkbox = createField({
//   ...defaultFieldParams,
//   component: props => <AntCheckbox checked={props.value} {...props} />,
//   mobxFormItemProps: {
//     changeTouchEvent: 'onChange',
//   },
//   wrapperParams: {
//     ...defaultFieldParams.wrapperParams,
//     hasFeedback: false,
//   },
// });

// export const PhoneMask = createField({
//   ...defaultFieldParams,
//   componentParams: {
//     rules: phoneNumberRules,
//   },
//   component: props => <PhoneInput defaultCountry={'us'} {...props} />,
// });

// const wrapperWithLabel = props => {
//   const { label, extensions, labelInOneLine } = props;
//   let newLabel = label;
//
//   if (extensions) {
//     const supportedText = extensions.join(', ');
//
//     newLabel = (
//       <span>
//         {label} {labelInOneLine ? '' : <br />} (only {supportedText})
//       </span>
//     );
//   }
//
//   return (
//     <DefaultWrapper {...props} label={newLabel}>
//       {props.children}
//     </DefaultWrapper>
//   );
// };

// export const TextArea = createField({
//   ...defaultFieldParams,
//   component: AntTextArea,
//   wrapperParams: {
//     ...defaultFieldParams.wrapperParams,
//     hasFeedback: false,
//   },
// });

// export const InputNumber = createField({
//   ...defaultFieldParams,
//   component: AntInputNumber,
//   wrapperParams: {
//     ...defaultFieldParams.wrapperParams,
//     hasFeedback: false,
//   },
// });
