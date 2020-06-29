import { values, whereEq, filter, head, path, pathEq, prop, pipeP } from 'ramda';
import { Request } from 'express';
import { getToken, RequestError } from '../utils';
import { IApiList, TParams } from '../mocks';
import { storage, TUser } from './storage';
// import { getAllContractsList } from '../contracts/storage';

const getUserByProp = (
  propName: keyof TUser['data'],
  value: string
): Promise<TUser | null | undefined> =>
  storage
    .getAll()
    .then(values)
    .then(list => filter<TUser>(pathEq(['data', propName], value), list))
    .then(list => head(list));

export const getUserByReq = (req: Request): Promise<TUser | null | undefined> => {
  const token = getToken(req);

  if (token) {
    return storage
      .getAll()
      .then(values)
      .then(list => filter<TUser>(whereEq({ token }), list))
      .then(list => head(list));
  }

  return Promise.resolve(null);
};

export const getUserById: (personId: string) => Promise<TUser['data']> = pipeP(
  personId => storage.get(personId),
  prop('data')
);

export default [
  {
    url: '/api/v0/vst-identity/person/info',
    get: ({ req }: TParams) => getUserByReq(req).then(prop('data') as any),
  },
  {
    url: '/api/v0/vst-oauth2/oauth/token',
    post: ({ req }: TParams) => {
      const grant_type = path(['body', 'grant_type'], req) as
        | 'refresh_token'
        | 'password'
        | undefined;
      const refresh_token = path(['body', 'refresh_token'], req) as string | undefined;
      const email = path(['body', 'username'], req) as string | undefined;
      const password = path(['body', 'password'], req) as string | undefined;

      if (!grant_type) {
        throw new RequestError(400);
      }

      if (grant_type === 'password' && (!email || !password)) {
        throw new RequestError(400);
      }

      if (grant_type === 'refresh_token' && !refresh_token) {
        return new RequestError(400);
      }

      let userPromise: Promise<TUser | undefined | null>;

      if (grant_type === 'refresh_token') {
        userPromise = getUserByProp('personId', (refresh_token as string).replace('-token', ''));
      } else {
        userPromise = getUserByProp('email', email as string);
      }

      return userPromise.then(userData => {
        if (!userData) {
          throw new RequestError(404);
        }

        // disable password
        // if (password && userData.password !== password) {
        //   throw new RequestError(400);
        // }

        const token = userData.data.personId;
        if (!userData.id) {
          userData.id = userData.data.personId;
        }
        storage.set({ ...userData, token });

        return {
          access_token: userData.data.personId,
          token_type: 'bearer',
          refresh_token: `${userData.data.personId}-token`,
          expires_in: 43199,
          scope: 'read vst-client',
          jti: '4e995ac9-843f-4efb-8046-626899f9c8a3',
        };
      });
    },
  },
] as Array<IApiList>;
