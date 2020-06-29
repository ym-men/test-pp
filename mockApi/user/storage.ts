import { Storage } from '../Storage';
import { resolve } from 'path';

export type TUser = {
  password: string;
  token: string;
  id: string;
  data: {
    firstName: string;
    lastName: string;
    id: string;
    personId: string;
    email: string;
    role: string;
    companyId: string;
  };
};
export const storage = new Storage<Record<string, TUser>>(
  resolve(__dirname, '..', 'db', 'users.json')
);
