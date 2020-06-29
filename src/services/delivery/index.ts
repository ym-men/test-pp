import {
  get as requestGet,
  post,
  TResponseList,
  TSearchOptions,
  DEFAULT_SEARCH_OPTIONS,
  getUrl,
} from '../utils';
import { evolve, map } from 'ramda';
import { toDate } from '../../utils';
import { Entities } from '../../../entities';

export namespace delivery {
  import TDelivery = Entities.TDelivery;
  import TDocument = Entities.TDocument;
  import TComment = Entities.TComment;
  import TLocation = Entities.TLocation;

  const remapDelivery: (delivery: TDelivery<string>) => TDelivery<Date> = evolve({
    dateFrom: toDate,
    dateTo: toDate,
    comments: map<TComment<string>, TComment>(evolve({ date: toDate })),
    locationList: map<TLocation<string>, TComment>(
      evolve({ locationDate: toDate, dateToUpdate: toDate })
    ),
    documents: map<TDocument<string>, TDocument>(
      evolve({ date: toDate, type: type => Number(type) })
    ),
    status: (status: string) => status.toLowerCase(),
  }) as (delivery: TDelivery<string>) => TDelivery<Date>;

  export function mtrList(
    contractId: string,
    orderId: string,
    mtrId: string,
    options: TSearchOptions = Object.create(null)
  ): Promise<TResponseList<TDelivery<Date>>> {
    const url = getUrl('DELIVERY_BY_MTR', contractId, orderId, mtrId);
    return requestGet<TResponseList<TDelivery<string>>>(url, {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    }).then(
      evolve({
        content: map<TDelivery<string>, TDelivery<Date>>(remapDelivery),
      })
    );
  }

  export function list(
    options: TSearchOptions = Object.create(null)
  ): Promise<TResponseList<TDelivery<Date>>> {
    const url = getUrl('DELIVERIES');
    return requestGet<TResponseList<TDelivery<string>>>(url, {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    }).then(
      evolve({
        content: map<TDelivery<string>, TDelivery<Date>>(remapDelivery),
      })
    );
  }

  export function get(id: string): Promise<TDelivery> {
    const url = getUrl('DELIVERY', id);
    return requestGet<TDelivery<string>>(url).then(remapDelivery);
  }

  export function create(
    contractId: string,
    orderId: string,
    deliver: TDelivery
  ): Promise<TDelivery> {
    const url = getUrl('DELIVERY_CREATE', contractId, orderId);
    return post<TDelivery<string>>(url, deliver).then(remapDelivery);
  }

  export function update(deliver: TDelivery, params?: any): Promise<TDelivery> {
    const url = getUrl('DELIVERY', deliver.id);
    return post<TDelivery<string>>(url, {
      ...deliver,
      status: deliver.status.toUpperCase(),
      documents: deliver.documents.map((doc: TDocument<Date>) => ({
        ...doc,
        type: String(doc.type),
        status: doc.status ? doc.status.toUpperCase() : undefined,
      })),
    }).then(remapDelivery);
  }

  export const DELIVERY_STATUS = {
    PENDING: 'pending' as 'pending',
    IN_WAY: 'in_way' as 'in_way',
    APPROVED: 'approved' as 'approved',
    ARRIVE: 'arrive' as 'arrive',
    REJECTED: 'rejected' as 'rejected',
  };
}
