import { Dictionary, FilterOnceApplied, Static } from 'ramda';

type TArrayLike<T> = ArrayLike<T>;

declare module 'ramda' {
  /* tslint:disable */
    interface Static {
        last<T>(data: TArrayLike<T>): T | undefined;

        prop<P extends keyof T, T>(p: P): (obj: Record<P, T>) => T;
    }


    /* tslint:enable */
}
