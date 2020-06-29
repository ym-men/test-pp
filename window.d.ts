import { IStores } from 'mobx-stores/stores';

declare global {
    interface Window {
      stores?: IStores;
    }
}