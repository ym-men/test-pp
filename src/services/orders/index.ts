import * as _ from 'lodash';
import {
  get as requestGet,
  post,
  TResponseList,
  getUrl,
  DEFAULT_SEARCH_OPTIONS,
  TSearchOptions,
} from '../utils';
import { evolve, map } from 'ramda';
import { toDate } from '../../utils';
import { Entities } from '../../../entities';

import TOrder = Entities.TOrder;
import TMTR = Entities.TMTR;

export namespace orders {
  export const remapOrder: any = (order: any) => {
    return {
      ...order,
      acceptDate: toDate(order.acceptDate),
      status:
        order.status === 'PENDING'
          ? 'approving'
          : order.status
          ? order.status.toLowerCase()
          : order.status,

      mtrs: _.orderBy(
        (order.mtrs || []).map((mtr: TMTR<string>) => ({
          ...mtr,
          date: [toDate(mtr.dateFrom), mtr.dateTo ? toDate(mtr.dateTo) : toDate(mtr.dateFrom)],
          controlStatus: mtr.controlStatus ? mtr.controlStatus.toLowerCase() : undefined,
          status: mtr.status ? mtr.status.toLowerCase() : undefined,
        })),
        'createDate',
        'asc'
      ),

      comments: (order.comments || []).map((cmt: any) => ({
        ...cmt,
        date: toDate(cmt.date),
      })),
      documents: (order.documents || []).map((doc: any) => ({
        ...doc,
        type: Number(doc.type),
        date: toDate(doc.date),
        downloadUrl: getUrl('FILE_DOWNLOAD', doc.id, order.id),
      })),
    };
  };

  export function list(
    options: TSearchOptions = Object.create(null)
  ): Promise<TResponseList<TOrder>> {
    const url = getUrl('ORDERS');

    return requestGet<TResponseList<TOrder<string>>>(url, {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    }).then(
      evolve({
        content: map<TOrder<string>, TOrder>(remapOrder),
      })
    );
  }

  export function get(orderId: string): Promise<TOrder> {
    const url = getUrl('ORDER', orderId);

    return requestGet<TOrder>(url).then(remapOrder);
  }

  export function create(order: TOrder): Promise<TOrder> {
    const url = getUrl('ORDERS', order.contractId);

    return post<TOrder>(url, order).then(remapOrder);
  }

  export function update(order: TOrder): Promise<TOrder> {
    const url = getUrl('ORDER', order.id);

    return post<TOrder>(url, {
      ...order,
      status: order.status.toUpperCase(),
    }).then(remapOrder);
  }

  export function approve(order: TOrder): Promise<TOrder> {
    const url = getUrl('ORDER_APPROVE', order.id);

    return post<TOrder>(url, {
      ...order,
      status: order.status.toUpperCase(),
    }).then(remapOrder);
  }

  export function reject(order: TOrder): Promise<TOrder> {
    const url = getUrl('ORDER_REJECT', order.id);

    return post<TOrder>(url, {
      ...order,
      status: order.status.toUpperCase(),
    }).then(remapOrder);
  }

  export const ORDER_STATUS = {
    APPROVING: 'approving' as 'approving',
    APPROVED: 'approved' as 'approved',
    REJECTED: 'rejected' as 'rejected',
  };
}
