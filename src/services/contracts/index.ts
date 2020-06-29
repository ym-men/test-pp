import {
  get as requestGet,
  post,
  TResponseList,
  getUrl,
  TSearchOptions,
  DEFAULT_SEARCH_OPTIONS,
} from '../utils';
import { TWithout } from 'interface';
import { toDate } from '../../utils';
import { Entities } from '../../../entities';
import { orders } from '../orders';
import stores from '../../mobx-stores/stores';

export namespace contracts {
  import TContract = Entities.TContract;
  import remapOrder = orders.remapOrder;
  import TOrder = Entities.TOrder;
  import TOrderMeta = Entities.TOrderMeta;

  const remapContract: IRemapContract = (contract: any) => {
    return {
      ...contract,
      date: toDate(contract.date),
      dateFrom: toDate(contract.dateFrom),
      dateTo: toDate(contract.dateTo),
      status:
        contract.status === 'PENDING'
          ? 'approving'
          : contract.status
          ? contract.status.toLowerCase()
          : contract.status,
      orders: (contract.orders || []).map(remapOrder),
      type: stores.catalogs.getContractTypeByCode(contract),
      comments: (contract.comments || []).map((cmt: any) => ({
        ...cmt,
        date: toDate(cmt.date),
      })),
      documents: (contract.documents || []).map((doc: any) => ({
        ...doc,
        type: Number(doc.type),
        date: toDate(doc.date),
      })),
    };
  };

  export function list(
    options: TSearchOptions = Object.create(null)
  ): Promise<TResponseList<TContract>> {
    const url = getUrl('CONTRACTS');

    return requestGet(url, {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    }).then(({ total, content }) => ({ total, content: content.map(remapContract) } as any));
  }

  export function get(id: string): Promise<TContract> {
    const url = getUrl('CONTRACT', id);

    return requestGet<TContract<string>>(url).then(remapContract);
  }

  export function create(contract: TWithout<TContract, 'id' | 'status'>): Promise<TContract> {
    const url = getUrl('CONTRACTS');

    return post<TContract<string>>(url, contract).then(remapContract);
  }

  export function update(contract: TContract): Promise<TContract> {
    const url = getUrl('CONTRACT', contract.id);

    return post<TContract<string>>(url, {
      ...contract,
      status: contract.status.toUpperCase(),
    }).then(remapContract);
  }

  export function approve(contract: TContract): Promise<TContract> {
    const url = getUrl('CONTRACT_APPROVE', contract.id);

    return post<TContract<string>>(url, contract).then(remapContract);
  }

  export function reject(contract: TContract): Promise<TContract> {
    const url = getUrl('CONTRACT_REJECT', contract.id);

    return post<TContract<string>>(url, contract).then(remapContract);
  }

  export const CONTRACT_STATUS = {
    APPROVING: 'approving' as 'approving',
    APPROVED: 'approved' as 'approved',
    REJECTED: 'rejected' as 'rejected',
  };

  export const CONTRACT_ORDER_STATUS = {
    ACTIVE: 'active' as 'active',
    CLOSED: 'closed' as 'closed',
    APPROVED: 'approved' as 'approved',
  };

  interface IRemapContract {
    (contract: TContract<string, TOrderMeta>): TContract<Date, TOrderMeta>;

    (contract: TContract<string, TOrder<string>>): TContract<Date, TOrder<Date>>;
  }
}
