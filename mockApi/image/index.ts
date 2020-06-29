///<reference path="../types.d.ts"/>
import { move, readFile } from 'fs-extra';
import { storage } from './storage';
import { IApiList, TParams } from '../mocks';
import { resolve } from 'path';
import { RequestError, guid } from '../utils';

const imageStorageDist = resolve(__dirname, '..', 'db', 'images');

export default [
  {
    url: '/api/v0/vst-files/file/:fileId',
    get: ({ params }: TParams) =>
      Promise.all([storage.getAll()]).then(([files]) => {
        const data = Object.values(files).find(file => file.id === params.fileId);

        if (!data) {
          throw new RequestError(401);
        }

        return readFile(resolve(__dirname, '..', 'db', 'images', `${data.name}`));
      }),
  },
  {
    url: '/api/v0/vst-files/file/upload',
    post: ({ req }: TParams) => {
      const fileData = (req.files || {}).file as any;
      const { path, name, size } = fileData;
      const hash = guid();

      return storage
        .set({
          name,
          size,
          date: new Date().toISOString(),
          id: hash,
        })
        .then(() =>
          move(path, resolve(imageStorageDist, name), {
            overwrite: true,
          })
        )
        .then(() => storage.get(hash));
    },
  },
] as Array<IApiList>;
