import { evolve, map } from 'ramda';
import { toDate } from '../../utils';
import { post, getUrl } from '../utils';

export namespace file {
  export function upload(items: File[]): Promise<Array<IFileData>> {
    const formData = new FormData();
    const f = items[0];
    const url = getUrl('FILE_UPLOAD');
    formData.append('file', f, f.name);

    return post(url, formData)
      .then(data => [data] as any)
      .then(map<IFileData<string>, IFileData>(evolve({ date: toDate })));
  }

  export interface IFileData<DATE = Date> {
    size: number;
    name: string;
    extension: string;
    date: DATE;
    id: string;
  }
}
