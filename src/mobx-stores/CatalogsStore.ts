import { action, observable } from 'mobx';
import StoreConstructor from './StoreConstructor';
import { catalogs as catalogsService } from 'services';
import { statusFetching } from 'constants/types';
import { Entities } from '../../entities';
import ICatalogs = Entities.ICatalogs;
import { TID } from '../interface';
import IOrganization = Entities.IOrganization;
import TContract = Entities.TContract;

export default class CatalogsStore extends StoreConstructor {
  @observable public data: ICatalogs | null = null;

  @observable public status: statusFetching = 'init';

  @action.bound
  public init() {
    this.status = 'fetching';

    return Promise.all([catalogsService.get(), catalogsService.getCompanies()])
      .then(this.initSuccess)
      .catch(this.showError);
  }

  public getInspectorNameById(id: TID) {
    if (this.data) {
      const org = this.data.organizations.find((item: IOrganization) => item.id === id);

      if (org) {
        return org.name;
      }
    }

    return id;
  }

  public getQuantityNameByType(quantityType: TID) {
    if (this.data) {
      const found = this.data.quantityTypes.find(i => i.id === quantityType);

      if (found) {
        return found.name;
      }
    }

    return 'шт.';
  }

  public getDocumentTypeName(namespace: string, type: number) {
    const item = this.data.documentTypes[namespace].find((ctrl: any) => ctrl.id === type);

    return item ? item.name : '';
  }

  public getFixingTypesName(type: TID) {
    const item = this.data.fixingTypes.find(ctrl => String(ctrl.id) === String(type));

    return item ? item.name : '';
  }

  public getContractCodeByType(contract: TContract) {
    const typeInfo = this.data.contractTypes.find(item => item.id === contract.type);

    return typeInfo.code;
  }

  public getContractTypeByCode(contract: TContract) {
    const typeInfo = this.data.contractTypes.find(item => item.code === contract.type);

    return typeInfo.id;
  }

  @action.bound
  private showError(error: object) {
    this.status = 'error';

    console.error(error);
  }

  @action.bound
  private initSuccess([catalogs, organizations]: any) {
    this.status = 'success';

    this.data = catalogs;
    this.data.organizations = organizations;

    return this.data;
  }
}
