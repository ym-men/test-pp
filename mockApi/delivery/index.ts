import { IApiList, TParams } from '../mocks';
import { storage } from './storage';
import { Entities } from '../../entities';
import TDelivery = Entities.TDelivery;
import { getUserByReq } from '../user';
import { RequestError } from '../utils';

export default [
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/deliveries/contracts/:contractId/orders/:orderId/mtrs/:mtrId',
    get: async ({ params, query, req }: TParams) => {
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;
      const user = await getUserByReq(req);
      if (!user) {
        throw new RequestError(401);
      }

      return storage
        .getAll()
        .then(deliveries => Object.values(deliveries).filter(item => item.mtrId === params.mtrId))
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
    timeout: 'long',
    url: '/api/v0/vst-bb/deliveries',
    get: ({ query }: TParams) => {
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;
      return storage
        .getAll()
        .then(deliveries => Object.values(deliveries))
        .then((list: Array<TDelivery>) => ({
          limit,
          offset,
          total: list.length,
          content: list.slice(offset, limit + offset),
        }));
    },
  },
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/contracts/:contractId/orders/:orderId/deliveries',
    post: ({ body }: TParams) =>
      Promise.resolve().then(() => {
        const toCreate = {
          status: 'delivery',
          number: '',
          mtrName: '',
          mtrCode: '',
          orderNumber: '',
          contractNumber: '',
          supplier: '',
          transportType: '',
          transportId: '',
          comments: [],
          documents: [],
          locationList: [],
          ...body,
        };

        return storage.set(toCreate);
      }),
  },
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/deliveries/:id',
    get: ({ params, req }: TParams) => storage.get(params.id),
    post: ({ params, body }: TParams) => {
      if (body.params) {
        console.log('FOUND_DELIVERY_UPDATE_PARAMS', body.params);
      }

      return storage.get(params.id).then(delivery => storage.set({ ...delivery, ...body }));
    },
  },
] as Array<IApiList>;
