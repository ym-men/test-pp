import {
  get as requestGet,
  post,
  TResponseList,
  TSearchOptions,
  DEFAULT_SEARCH_OPTIONS,
  getUrl,
} from '../utils';
import { evolve, map } from 'ramda';
import { TCb } from 'interface';
import { toDate } from '../../utils';
import { Entities } from '../../../entities';

export namespace controls {
  import TControl = Entities.TControl;
  import TDocument = Entities.TDocument;
  import TComment = Entities.TComment;

  const remapControl: TCb<TControl<string>, TControl> = evolve({
    dateStart: date => toDate(date || new Date().toISOString()),
    dateEnd: date => toDate(date || new Date().toISOString()),
    comments: map<TComment<string>, TComment>(evolve({ date: toDate })),
    documents: map<TDocument<string>, TDocument>(
      evolve({
        date: toDate,
        type: type => Number(type),
        status: status => (status ? status.toLowerCase() : undefined),
        comment: comment => (comment && comment[0] ? comment[0] : undefined),
      })
    ),
    inspectors: inspectors => inspectors || [],
    addresses: addresses => addresses || [],
    status: (status: string) => status.toLowerCase(),
  }) as TCb<TControl<string>, TControl>;

  export function list(
    options: TSearchOptions = Object.create(null)
  ): Promise<TResponseList<TControl<Date>>> {
    const url = getUrl('CONTROLS');

    return requestGet<TResponseList<TControl<string>>>(url, {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    }).then(
      evolve({
        content: map<TControl<string>, TControl>(remapControl),
      })
    );
  }

  export function get(id: string): Promise<TControl> {
    const url = getUrl('CONTROL', id);
    return requestGet<TControl<string>>(url).then(remapControl);
  }

  export function update(control: TControl): Promise<TControl> {
    const url = getUrl('CONTROL', control.id);
    return post<TControl<string>>(url, {
      ...control,
      status: control.status.toUpperCase(),
      documents: control.documents.map((doc: TDocument<Date>) => ({
        ...doc,
        comment: doc.comment ? [doc.comment] : undefined,
        type: String(doc.type),
        status: doc.status ? doc.status.toUpperCase() : undefined,
      })),
    }).then(remapControl);
  }

  export function updateDocument(controlId: string, doc: TDocument): Promise<TControl> {
    const url = getUrl('UPDATE_CONTROL_DOCUMENT', controlId, doc.id);

    return post<TControl<string>>(url, {
      ...doc,
      type: String(doc.type),
      comment: doc.comment ? [doc.comment] : undefined,
      status: doc.status ? doc.status.toUpperCase() : undefined,
    }).then(remapControl);
  }

  export const CONTROL_STATUS = {
    APPROVING: 'approving' as 'approving',
    APPROVED: 'approved' as 'approved',
    REJECTED: 'rejected' as 'rejected',
  };
}
