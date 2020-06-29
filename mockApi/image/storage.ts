import { Storage } from '../Storage';
import { resolve } from 'path';

export interface ISavedImageData {
  name: string;
  size: number;
  date: string;
  id: string;
}

export const storage = new Storage<Record<string, ISavedImageData>>(
  resolve(__dirname, '..', 'db', 'image.json')
);
