import api from './orders';
import { IApiList, TParams } from '../mocks';
import { storage, getAllContractsList } from './storage';
import { storage as ordersStorage } from './orders/storage';
import { getUserByReq } from '../user';
import { RequestError } from '../utils';

export const getFullContract: (id: string) => Promise<any> = contractId => {
  return storage.get(contractId).then(contract => {
    return Promise.all((contract.orders || []).map(id => ordersStorage.get(String(id)))).then(
      orders => {
        return { ...contract, orders };
      }
    );
  });
};

export default [
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/contracts',
    get: async ({ query, req }: TParams) => {
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;
      const user = await getUserByReq(req);
      if (!user) {
        throw new RequestError(401);
      }
      return getAllContractsList()
        .then(list =>
          list.map(contract => ({
            ...contract,
            comments: contract.comments || [],
          }))
        )
        .then(list =>
          list
            .filter(c => {
              return user.data.companyId ? user.data.companyId === c.supplier : true;
            })
            .slice(offset, limit + offset)
        )
        .then(list => Promise.all(list.map(contract => getFullContract(contract.id))))
        .then(list => ({
          limit,
          offset,
          total: list.length,
          content: list,
        }));
      //
    },
    post: ({ body }: TParams) => {
      return storage.set({ ...body, status: 'APPROVING', orders: [] });
    },
  },
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/contracts/:id',
    get: ({ params, req }: TParams) => getFullContract(params.id),
    post: ({ params, body, req }: TParams) =>
      storage
        .get(params.id)
        .then(() => {
          const item = { ...body, status: 'APPROVING' };
          return storage.set(item);
        })
        .then(() => getFullContract(params.id)),
  },
  {
    url: '/api/v0/vst-bb/contracts/:id/approve',
    post: ({ params, body, req }: TParams) =>
      Promise.resolve()
        .then(() => {
          const contract = body;

          return storage.set(contract, { status: 'APPROVED' });
        })
        .then(() => getFullContract(params.id)),
  },
  {
    url: '/api/v0/vst-bb/contracts/:id/reject',
    post: ({ params, body, req }: TParams) =>
      Promise.resolve()
        .then(() => {
          const contract = body;

          return storage.set(contract, { status: 'REJECTED' });
        })
        .then(() => getFullContract(params.id)),
  },
  ...api,
] as Array<IApiList>;
