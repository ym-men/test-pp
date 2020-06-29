import { IModalConfig, TModalField } from 'components/Modals';
import { action, observable } from 'mobx';
import StoreConstructor from './StoreConstructor';

export class ModalsStore extends StoreConstructor {
  @observable public displayModal: boolean = false;
  @observable public config: IModalConfig;
  private onApplyCallback: ((arg1?: any, arg2?: any) => void) | false;

  public generateFieldOptions = (field: TModalField) => {
    const options = field.genOptions ? field.genOptions(this.stores) : null;

    return options ? { ...field, options } : field;
  };

  @action.bound
  public openModal(config: IModalConfig, onApply?: (arg1?: any, arg2?: any) => void) {
    const fields = config.fields ? config.fields.map(this.generateFieldOptions) : config.fields;

    this.config = { ...config, fields };
    this.displayModal = true;
    this.onApplyCallback = onApply;
  }

  @action.bound
  public closeModal() {
    this.displayModal = false;
    this.onApplyCallback = false;
    this.config = null;
  }

  @action.bound
  public onModalApply(data: any) {
    if (typeof this.onApplyCallback === 'function') {
      this.onApplyCallback(data);
    }
    this.closeModal();
  }
}
