import { prop } from 'ramda';
import { TCb } from '../../interface';

export * from './validate-funcs';

export type TValidate<T> = <Key extends keyof T>(
  key: Key,
  validator: TValidator<T>
) => (state: T) => TError<T, Key>;
export type TSimpleValidate<T> = <Key extends keyof T>(
  key: Key,
  ...validators: TValidatorWithMessage<T[Key]>[]
) => (state: T) => TSimpleError<T, Key>;
export type TValidateList<T> = <Key extends keyof T>(
  key: string,
  ...validators: Array<TCb<T[Key] extends Array<infer R> ? R : never, TError<T, Key>>>
) => (state: T) => TError<T, T[Key] extends Array<any> ? Key : never>;

export type TError<T, Key extends keyof T> = {
  [K in Key]?: Array<string> | TError<T[Key], keyof T[Key]>
};
export type TSimpleError<T, Key extends keyof T> = { [K in Key]?: Array<string> };

export type TValidator<T> = (
  data: T
) => Array<string> | TError<T, keyof T> | Array<TError<T, keyof T>>;
export type TAtomValidator<T> = (value: T) => boolean;
export type TValidatorWithMessage<T> = (value: T) => string | null;

export type TValidateBy<T> = (
  message: string,
  atom: TAtomValidator<T>
) => (value: T) => string | null;
export type TValidateConstructor<T> = (
  ...args: Array<TValidatorWithMessage<T>>
) => (value: T) => Array<string>;

export const validateBy: TValidateBy<any> = (message, validator) => value =>
  validator(value) ? message : null;
export const validateConstructor: TValidateConstructor<any> = (...args) => value =>
  args.reduce((acc: Array<string>, validator) => {
    const result = validator(value);
    if (result !== null) {
      acc.push(result);
    }
    return acc;
  }, []);

export const validate: TValidate<any> = (key, validator) => (state: any) => {
  const result = validator(state);
  if (Object.keys(result).length) {
    // TODO!
    return { [key]: result } as any;
  } else {
    return {};
  }
};

export const validateSimpleList: TValidateList<any> = (key, ...validators) => state => {
  const errors = state[key].reduce((acc: Array<TError<any, any>>, data: any) => {
    const result = applyValidators(validators as any)(data);
    acc.push(result);
    return acc;
  }, []);

  const hasError = errors.some((item: any) => !!Object.keys(item).length);

  if (hasError) {
    return { [key]: errors } as TError<any, any>;
  } else {
    return {};
  }
};

export const simpleValidate: TSimpleValidate<any> = (key, ...validators) =>
  validate(key, state => validateConstructor(...validators)(prop(key, state))) as any;

export const applyValidators = <T>(list: Array<ReturnType<TValidate<T>>>) => (state: T) =>
  list.reduce((acc, item) => Object.assign(acc, item(state)), Object.create(null));
