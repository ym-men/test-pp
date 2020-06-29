import { prop, pipe } from 'ramda';

export namespace validators {
  export const makeValidator = <T>(validator: TValidateFunc<T>, message: string) => (
    data: T
  ): Array<string> => (validator(data) ? [] : [message]);

  export const size: (
    validator: TValidateFunc<number>,
    message: string
  ) => (file: File) => Array<string> = (validator, message) =>
    pipe(
      prop('size'),
      makeValidator(validator, message)
    );

  export type TValidateFunc<T> = (data: T) => boolean;
}
