import { contracts as contractsService } from 'services';
import { Entities } from '../../entities';
import TContract = Entities.TContract;
import { IStores } from './stores';
import { ListStoreConstructor } from './ListStoreConstructor';

export default class ContractStore extends ListStoreConstructor<TContract> {
  constructor(stores: IStores) {
    super(contractsService, stores, 15e3);
  }
}
