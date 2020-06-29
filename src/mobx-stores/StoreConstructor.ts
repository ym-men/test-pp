import * as _ from 'lodash';
import { action, isComputedProp, isObservableProp, toJS } from 'mobx';
import { IStores } from './stores';
import { Error } from 'tslint/lib/error';

const logError = (error: object) => {
  console.error(error);
};

export default class StoreConstructor {
  public defaults: { [className: string]: any } = {};
  public stores: IStores;

  constructor(stores: object) {
    this.stores = stores;
  }

  public reset(): void {
    this.updateFromObject(this.defaults);
  }

  public updateDefaultsFromSelf(ignoreArray?: string[]) {
    for (const key in this) {
      if (!this[key]) {
        continue;
      }

      const current: any = this[key];
      let ignore = ['defaults', 'stores', 'state'];

      if (ignoreArray && _.isArray(ignoreArray)) {
        ignore = ignore.concat(ignoreArray);
      }

      if (
        this.hasOwnProperty(key) &&
        !_.isFunction(current) &&
        ignore.indexOf(key) === -1 &&
        !isComputedProp(this, key) &&
        isObservableProp(this, key)
      ) {
        this.defaults[key] = toJS(current);
      }
    }
  }

  @action
  public updateFromObject(obj: object) {
    if (!_.isPlainObject(obj)) {
      return logError(new Error('Trying to update Store from not an object'));
    }

    Object.keys(obj).forEach(key => {
      if (!_.isUndefined(this[key]) || isObservableProp(this, key)) {
        this[key] = obj[key];
      } else {
        logError(
          new Error(
            `There is no way to add a key:${key} in class:${
              this.constructor.name
            } since it is absent`
          )
        );
      }
    });

    return Promise.resolve();
  }
}
