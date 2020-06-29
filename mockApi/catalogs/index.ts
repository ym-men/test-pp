import { IApiList } from '../mocks';
import { readJSON } from 'fs-extra';
import { resolve } from 'path';

function read() {
  return readJSON(resolve(__dirname, '..', 'db', 'catalogs.json'));
}

export default [
  {
    url: '/api/v0/vst-bb/catalogs',
    get: async () => {
      const {
        contractTypes,
        documentTypes,
        transportTypes,
        quantityTypes,
        fixingTypes,
      } = await read();

      return { contractTypes, documentTypes, transportTypes, quantityTypes, fixingTypes };
    },
  },
  {
    url: '/api/v0/vst-identity/company',
    get: async () => {
      const { organizations } = await read();

      return organizations;
    },
  },
] as Array<IApiList>;
