import { IApiList } from '../mocks';

export default [
  {
    timeout: 'long',
    url: '/api/health',
    get: () => {
      return Promise.resolve('OK');
    },
  },
] as Array<IApiList>;
