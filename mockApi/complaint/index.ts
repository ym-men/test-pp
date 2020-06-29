import { IApiList, TParams } from '../mocks';
import { storage } from './storage';
import { storage as deliveryStorage } from '../delivery/storage';
import { storage as orderStorage } from '../contracts/orders/storage';
import { Entities } from '../../entities';
import TComplaint = Entities.TComplaint;
import TDelivery = Entities.TDelivery;
import TOrder = Entities.TOrder;
import TMTR = Entities.TMTR;

export default [
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/complaints',
    get: ({ query }: TParams) => {
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;
      return storage
        .getAll()
        .then(complaints => Object.values(complaints))
        .then(async list => {
          return await Promise.all(
            list.map(async (complaint: TComplaint) => {
              const delivery: TDelivery = await deliveryStorage.get(String(complaint.deliveryId));
              const order: TOrder<string> | undefined = await orderStorage.get(delivery.orderId);
              const mtr: TMTR<string> | undefined =
                order && order.mtrs.find((m: TMTR<string>) => m.id === delivery.mtrId);

              return {
                ...complaint,
                supplier: order.supplier,
                receiver: mtr && mtr.receiver,
                contractId: order.contractId,
                contractNumber: order.contractNumber,
                orderId: order.id,
                orderNumber: order.number,
                mtrCode: mtr && mtr.code,
                mtrId: mtr && mtr.id,
                mtrName: mtr && mtr.name,
                deliveryNumber: delivery.number,
              };
            })
          );
        })
        .then((complaints: any) => ({
          limit,
          offset,
          total: complaints.length,
          content: complaints.slice(offset, limit + offset),
        }));
    },
    post: ({ body }: TParams) =>
      Promise.resolve()
        .then(() => {
          const toCreate = {
            deliveryId: '',
            status: 'representative',
            complaintDate: new Date().toISOString(),
            comissionDate: new Date().toISOString(),
            representativeName: '',
            representativePosition: '',
            representativeMissing: false,
            fixingMethod: '',
            fixingMethodCounter: 1,
            comments: [],
            documents: [],
            ...body,
          };

          return storage.set(toCreate);
        })
        .then(complaint => {
          return deliveryStorage
            .get(complaint.deliveryId)
            .then(delivery => deliveryStorage.set({ ...delivery, complaintId: complaint.id }));
        }),
  },
  {
    timeout: 'long',
    url: '/api/v0/vst-bb/complaints/:complaintId',
    get: ({ params, req }: TParams) => storage.get(params.complaintId).then(complaint => complaint),
    post: ({ params, body }: TParams) => {
      return storage
        .get(params.complaintId)
        .then(complaint => storage.set({ ...complaint, ...body }));
    },
  },
] as Array<IApiList>;
