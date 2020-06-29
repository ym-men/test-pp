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

export namespace complaints {
  import TComplaint = Entities.TComplaint;
  import TDocument = Entities.TDocument;
  import TComment = Entities.TComment;

  const remapComplaint: (complaint: TComplaint<string>) => TComplaint<Date> = evolve({
    dateFrom: toDate,
    dateTo: toDate,
    comments: map<TComment<string>, TComment>(evolve({ date: toDate })),
    status: (status: string) => status.toLowerCase(),
    documents: map<TDocument<string>, TDocument>(
      evolve({ date: toDate, type: type => Number(type) })
    ),
  }) as (delivery: TComplaint<string>) => TComplaint<Date>;

  export function list(
    options: TSearchOptions = Object.create(null)
  ): Promise<TResponseList<TComplaint<Date>>> {
    const url = getUrl('COMPLAINTS');
    return requestGet<TResponseList<TComplaint<string>>>(url, {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    }).then(
      evolve({
        content: map<TComplaint<string>, TComplaint<Date>>(remapComplaint),
      })
    );
  }

  export function get(complaintId: string): Promise<TComplaint> {
    const url = getUrl('COMPLAINT', complaintId);
    return requestGet<TComplaint<string>>(url).then(remapComplaint);
  }

  export function create(complaintObj: TComplaint): Promise<TComplaint> {
    const url = getUrl('COMPLAINTS');
    return post<TComplaint<string>>(url, complaintObj).then(remapComplaint);
  }

  export function update(complaintObj: TComplaint): Promise<TComplaint> {
    const url = getUrl('COMPLAINT', complaintObj.id);
    return post<TComplaint<string>>(url, {
      ...complaintObj,
      status: complaintObj.status.toUpperCase(),
    }).then(remapComplaint);
  }
}
