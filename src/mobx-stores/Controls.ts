import { controls as controlsService } from 'services';
import { Entities } from '../../entities';
import { ListStoreConstructor } from './ListStoreConstructor';
import { IStores } from './stores';

export default class Controls extends ListStoreConstructor<Entities.TControl> {
  constructor(stores: IStores) {
    super(controlsService, stores);
  }
}
