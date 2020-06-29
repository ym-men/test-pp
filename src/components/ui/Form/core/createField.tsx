import * as React from 'react';
import { IFieldParams, IMobxFormItemProps, MobxFormItem } from './MobxFormItem';

export const createField = (fieldParams: IFieldParams) => {
  return (props: IMobxFormItemProps) => {
    return (
      <MobxFormItem {...props} fieldParams={fieldParams} {...fieldParams.mobxFormItemProps || {}} />
    );
  };
};
