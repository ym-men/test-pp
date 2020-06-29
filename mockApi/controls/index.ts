import { IApiList, TParams } from '../mocks';
import { storage } from './storage';
import { values } from 'ramda';
import { getUserByReq } from '../user';
import { RequestError } from '../utils';

export default [
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/controls',
    get: async ({ query, req }: TParams) => {
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;
      const user = await getUserByReq(req);
      if (!user) {
        throw new RequestError(401);
      }

      return storage
        .getAll()
        .then(values)
        .then(list => ({
          limit,
          offset,
          total: list.length,
          content: list
            .filter(c => {
              return user.data.companyId ? user.data.companyId === c.supplier : true;
            })
            .slice(offset, limit + offset),
        }));
    },
  },
  {
    timeout: 'small',
    url: '/api/v0/vst-bb/controls/:id',
    get: ({ params }: TParams) => storage.get(params.id),
    post: ({ body }: TParams) => storage.set(body),
  },
  {
    timeout: 'small',
    url: '/api/v0/vst-bb/controls/:controlId/document/:documentId',
    post: async ({ params, body }: TParams) => {
      const control = await storage.get(params.controlId);
      const doc = control.documents.find(d => d.id === body.id);
      Object.assign(doc, body);
      return storage.set(control);
    },
  },
] as Array<IApiList>;
