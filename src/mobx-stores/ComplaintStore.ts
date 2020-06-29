import { complaints as complaintsService } from 'services';
import { Entities } from '../../entities';
import TComplaint = Entities.TComplaint;
import { ListStoreConstructor } from './ListStoreConstructor';
import { IStores } from './stores';

export default class ComplaintStore extends ListStoreConstructor<TComplaint> {
  constructor(stores: IStores) {
    super(complaintsService, stores);
  }
}
