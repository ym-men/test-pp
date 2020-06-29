import { Storage } from '../Storage';
import { resolve } from 'path';
import { values } from 'ramda';
import { Entities } from '../../entities';
import TContract = Entities.TContract;

export const storage = new Storage<Record<string, TContract<string, number>>>(
  resolve(__dirname, '../', 'db', 'contracts.json')
);

export const getAllContractsList: () => Promise<Array<TContract<string, number>>> = () =>
  storage.getAll().then(values);
