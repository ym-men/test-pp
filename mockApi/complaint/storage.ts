import { Storage } from '../Storage';
import { resolve } from 'path';

export const storage = new Storage<Record<string, any>>(
  resolve(__dirname, '..', 'db', 'complaints.json')
);
