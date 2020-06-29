import { Storage } from '../../Storage';
import { resolve } from 'path';
import { Entities } from '../../../entities';
import TOrder = Entities.TOrder;

export const storage = new Storage<Record<string, TOrder<string>>>(
  resolve(__dirname, '..', '..', 'db', 'orders.json')
);
