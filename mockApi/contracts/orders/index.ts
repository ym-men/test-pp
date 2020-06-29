import { IApiList, TParams } from '../../mocks';
import { storage as contractStorage } from '../storage';
import { storage as controlStorage } from '../../controls/storage';
import { storage } from './storage';
import { RequestError, guid } from '../../utils';
import { Entities } from '../../../entities';
import TMTR = Entities.TMTR;
import TDocument = Entities.TDocument;

export default [
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/orders',
    post: ({ body }: TParams) =>
      contractStorage
        .get(body.contractId)
        .then(contract => {
          const order = {
            ...body,
            status: 'APPROVING',
            mtrs: (body.mtrs || []).map((item: TMTR<string>) => ({
              ...item,
              id: guid(),
              status: 'APPROVING',
              pending: true,
            })),
          };

          return storage
            .set(order, {
              mtrs: order.mtrs.map((mtr: TMTR) => {
                mtr.pending = false;
                return mtr;
              }),
            })
            .then(created => {
              const orders = contract.orders || [];
              orders.push(created.id as any);
              const contractToUpd = { ...contract, orders };

              return contractStorage.set(contractToUpd).then(() => created);
            });
        })
        .catch(() => Promise.reject(new RequestError(400))),
  },
  {
    timeout: 'small',
    url: '/api/v0/vst-bb/orders/:id',
    get: ({ params, req }: TParams) =>
      storage.get(params.id).then(async data => {
        const mtrs = await Promise.all(
          data.mtrs.map(async mtr => {
            if (!mtr.inspectionNeeded || !mtr.inspectionId) {
              return mtr;
            }
            const control = await controlStorage.get(mtr.inspectionId);

            return {
              ...mtr,
              controlStatus: control.status,
              hasPermissionToShip: control.documents.some(doc => Number(doc.type) === 14),
              hasNotClosedNotify: control.documents.some(
                (doc: TDocument) =>
                  Number(doc.type) === 10 && (doc.status || '').toLowerCase() !== 'closed'
              ),
            };
          })
        );

        data.mtrs = mtrs;

        return data;
      }),
    post: async ({ params, body }: TParams) => {
      const contract = await contractStorage.get(body.contractId);

      const order = {
        ...body,
        status: 'APPROVING',
        mtrs: (body.mtrs || []).map((item: TMTR<string>) =>
          item.code
            ? item
            : {
                ...item,
                pending: true,
                status: 'APPROVING',
              }
        ),
      };
      // contractStorage.set(contract) to handle contract pending
      return contractStorage.set(contract).then(() =>
        storage.set(order, {
          mtrs: order.mtrs.map((mtr: TMTR) => {
            mtr.pending = false;
            return mtr;
          }),
        })
      );
    },
  },
  {
    url: '/api/v0/vst-bb/orders/:id/approve',
    post: async ({ params, body }: TParams) => {
      const order = body;
      const contract = await contractStorage.get(order.contractId);
      await Promise.all(
        order.mtrs
          .filter((mtr: TMTR<string>) => mtr.inspectionNeeded)
          .map((mtr: TMTR<string>) => {
            const id = guid();
            mtr.inspectionId = id;
            const control: any = {
              id,
              orderId: order.id,
              orderNumber: order.number,
              mtrCode: mtr.code,
              contractNumber: contract.number,
              meetingNeeded: false,
              comments: [],
              status: 'inspection_plan',
              mtrName: mtr.name,
              supplier: order.supplier,
              volume: mtr.quantity,
              quantity: mtr.quantity,
              quantityType: mtr.quantityType,
              inspector: mtr.inspector,
              inspectors: [],
              addresses: [],
              dateStart: null,
              dateEnd: null,
              documents: [],
            };

            return controlStorage.set(control);
          })
      );

      return contractStorage.set(contract).then(() =>
        storage.set(order, {
          status: 'APPROVED',
          mtrs: order.mtrs.map((mtr: TMTR) => {
            mtr.pending = false;
            return mtr;
          }),
        })
      );
    },
  },
  {
    url: '/api/v0/vst-bb/orders/:id/reject',
    post: async ({ params, body }: TParams) => {
      const order = { ...body };
      const contract = await contractStorage.get(order.contractId);

      return contractStorage.set(contract).then(() =>
        storage.set(order, {
          status: 'REJECTED',
          mtrs: order.mtrs.map((mtr: TMTR) => {
            mtr.pending = false;
            return mtr;
          }),
        })
      );
    },
  },
] as Array<IApiList>;
