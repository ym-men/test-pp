import { curry } from 'ramda';

export const required = (value: any): boolean => {
  return value == null || value === '';
};

export const maxLength = curry(
  (len: number, value: string): boolean => {
    const length = (value || '').length;
    return length > len;
  }
);

export const minLength = curry(
  (len: number, value: string): boolean => {
    const length = (value || '').length;
    return length < len;
  }
);
