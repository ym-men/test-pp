import { Storage } from '../Storage';
import { resolve } from 'path';
import { Entities } from '../../entities';
import TControl = Entities.TControl;

export const storage = new Storage<Record<string, TControl>>(
  resolve(__dirname, '..', 'db', 'controls.json'),
);
