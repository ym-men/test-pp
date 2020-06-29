import * as moment from 'moment';
import 'moment/locale/ru';
import { Ord, ifElse, is, identity, concat, divide, head, curry, __ } from 'ramda';
import * as _ from 'lodash';

moment.locale('ru');

const SIZE_FACTOR = 1024;
const sizeConvertUp = divide(__, SIZE_FACTOR);

export const roundTo = curry(
  (len: number, num: number) => Math.floor(num * Math.pow(10, len)) / Math.pow(10, len)
);

export function getNiceSize(origin: number): ISizeData {
  const units = ['Кб', 'Мб', 'Гб'] as Array<TSizeUnit>;

  const loop = (size: number, unit: TSizeUnit): ISizeData => {
    const next = units.indexOf(unit) + 1;

    if (size < SIZE_FACTOR || !units[next]) {
      return { size, unit };
    }

    return loop(sizeConvertUp(size), units[next]);
  };

  return loop(sizeConvertUp(origin), head(units) as TSizeUnit);
}

export function toStringFileSize(data: ISizeData): string {
  return `${data.size} ${data.unit}`;
}

export function dateFormatToString(date: Date | null | undefined, isFull?: boolean): string {
  if (!date) {
    return '';
  }

  return moment(date).format(isFull ? 'DD MMMM YYYY' : 'DD MMM YYYY');
}

export function isNotEqualTwoDates(dates: Array<Date>) {
  return dates.length > 1 && dates[0].valueOf() - dates[1].valueOf() !== 0;
}

export function datesToString(dates: Array<Date>): string {
  return isNotEqualTwoDates(dates)
    ? moment(dates[0]).format('MMMM YYYY')
    : dateFormatToString(dates[0]);
}

export function isArrayAndLenght(data: any) {
  return Array.isArray(data) && !!data.length;
}

export function fullDateFormat(date: number | Date | string): string {
  return `${dateFormat(date)} ${timeFormat(date)}`;
}

export function dateFormat(date: number | Date | string): string {
  return moment(date).format('DD.MM.YYYY');
}

export function timeFormat(date: number | Date | string): string {
  return moment(date).format('HH:mm:ss');
}

export const getUniqId = (() => {
  let start = 0;
  return (prefix?: string) => `${prefix || 'uniq-'}-${start++}`;
})();

export function toDate(date: string): any {
  const d = date;

  if (!d) {
    return d;
  }

  // To support UTC for browser
  if (_.last(d) === 'Z' || d.includes('+0000')) {
    return new Date(d);
  } else {
    return new Date(d + 'Z');
  }
}

export function arrayToDates(dates: string[]): Date[] {
  return dates.map(i => toDate(i));
}

export function toOrd(item: unknown): Ord {
  switch (typeof item) {
    case 'number':
    case 'string':
    case 'boolean':
      return item;
    case 'object':
      return item instanceof Date ? item : 0;
    default:
      return 0;
  }
}

export const toArray: <T>(item: T | Array<T>) => Array<T> = ifElse(is(Array), identity, concat([]));

export interface ISizeData {
  size: number;
  unit: TSizeUnit;
}

export type TSizeUnit = 'Кб' | 'Мб' | 'Гб';

export const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));
