import { get as httpGet, getUrl } from '../utils';
import { Entities } from '../../../entities';

export namespace catalogs {
  import ICatalogs = Entities.ICatalogs;

  export function get(): Promise<ICatalogs> {
    const url = getUrl('CATALOGS');

    return httpGet<ICatalogs>(url);
  }

  export function getCompanies(): Promise<ICatalogs> {
    const url = getUrl('COMPANY');

    return httpGet<ICatalogs>(url);
  }

  export const ORGANIZATION_TYPE = {
    BUYER: 'BUYER' as 'BUYER',
    CONTROL: 'CONTROL' as 'CONTROL',
    SUPPLIER: 'SUPPLIER' as 'SUPPLIER',
  };
}
