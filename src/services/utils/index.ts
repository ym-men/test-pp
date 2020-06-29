import {
  pipe,
  toPairs,
  map,
  join,
  concat,
  pipeP,
  prop,
  ifElse,
  last,
  is,
  flatten,
  curry,
  apply,
  length,
  filter,
  isNil,
  not,
  always,
  tap,
  identity,
  then,
} from 'ramda';
import { get as httpGet, post as httpPost, Request } from 'superagent';
import { Entities } from '../../../entities';
import TToken = Entities.TToken;
import stores from 'mobx-stores/stores';
import { IUrl } from 'mobx-stores/ApiStore';

const { api: apiStore } = stores;

let AUTH_TOKEN: string | undefined;
let activeAuth: Promise<void> | undefined;

const getQueryName: (name: string | number) => string = pipe(
  String,
  encodeURIComponent
);
const getQueryValue: (value: string | number) => string = pipe(
  String,
  encodeURIComponent
);
const toQS = curry(
  (key: string, value: string | number) => `${getQueryName(key)}=${getQueryValue(value)}`
);

export type TSearchOptions = {
  page?: number;
  size?: number;
};

export const DEFAULT_SEARCH_OPTIONS: TSearchOptions = {
  page: 0,
  size: 100,
};

export const createQS: <T extends TRequestParams>(data: T) => string = pipe(
  toPairs,
  filter(
    pipe<[string, TRequestValues], TRequestValues, boolean, boolean>(
      last,
      isNil,
      not
    )
  ),
  ifElse(
    pipe(
      length,
      Boolean
    ),
    pipe(
      map(
        ifElse(
          pipe(
            last,
            is(Array)
          ),
          ([key, value]) => map(toQS(key), value),
          apply(toQS)
        )
      ),
      flatten,
      join('&'),
      concat('?')
    ),
    always('')
  )
);

export type TRequestParams = Record<string, TRequestValues>;
export type TRequestValues = TRequestValuePrimitive | Array<TRequestValuePrimitive>;
export type TRequestValuePrimitive = string | number | undefined;
export type TResponseList<T> = {
  total: number;
  offset: number;
  limit: number;
  content: Array<T>;
};

export const saveToken = tap((token: TToken | null) => {
  if (token) {
    localStorage.setItem('refresh_token', token.refresh_token);
    AUTH_TOKEN = token.access_token;
  } else {
    localStorage.removeItem('refresh_token');
    AUTH_TOKEN = undefined;
  }
});

export const dropToken = () => {
  localStorage.removeItem('refresh_token');
  AUTH_TOKEN = undefined;
};

export const auth = (): Promise<void> => {
  if (activeAuth) {
    return activeAuth;
  }

  if (AUTH_TOKEN) {
    return Promise.resolve();
  }

  const refresh_token = localStorage.getItem('refresh_token');

  if (!refresh_token) {
    return Promise.resolve();
  }
  const url = getUrl('AUTH_TOKEN');
  activeAuth = pipe(
    httpPost,
    addJSONHeader,
    addAuthHeader,
    addBody({ grant_type: 'refresh_token', refresh_token }),
    then(prop('body')),
    then(saveToken),
    then(() => void 0)
  )(url);

  activeAuth.catch(() => {
    saveToken(null);
  });

  activeAuth.finally(() => {
    activeAuth = undefined;
  });

  return activeAuth;
};

const addHeader = (name: string, value: string): ((request: Request) => Request) => request =>
  request.set(name, value);
const addAuthHeader = (req: Request) => {
  const authHeader = AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : `Basic ${process.env.CLIENT_AUTH_HASH}`;

  return addHeader('Authorization', authHeader)(req);
};
const addBody = (data: any): ((request: Request) => Request) => request => request.send(data);

const addJSONHeader = pipe(
  addHeader('Accept', 'application/json'),
  addHeader('Content-Type', 'application/json')
);

export const get: <T>(url: string, params?: TRequestParams) => Promise<T> = pipe(
  (url: string, params: TRequestParams = {}) => `${url}${createQS(params)}`,
  pipeP(
    url => auth().then(() => url),
    pipe(
      httpGet,
      addJSONHeader,
      addAuthHeader
    ),
    prop('body')
  )
);

export const post = <T>(url: string, params?: any): Promise<T> =>
  auth().then(() =>
    pipe(
      httpPost,
      ifElse(() => params instanceof FormData, identity, addJSONHeader),
      addAuthHeader,
      addBody(params),
      then(prop('body'))
    )(url)
  );

export function getUrl(url: IUrl, ...params: any) {
  return apiStore.getUrl(url, ...params);
}
