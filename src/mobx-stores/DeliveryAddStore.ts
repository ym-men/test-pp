import { observable, action } from 'mobx';
import StoreConstructor from './StoreConstructor';
import { Entities } from '../../entities';
import TMTR = Entities.TMTR;
import { STEP_INFO, validateConf } from 'pages/DeliveryAdd/FormConfig';
import { applyValidators } from 'utils/validators';
import { not, pipe, propEq } from 'ramda';
import TDocument = Entities.TDocument;

export default class DeliveryAddStore extends StoreConstructor {
  @observable public step: number;
  @observable public delivery: Entities.TDelivery<Date>;
  @observable public errors: any;
  @observable public errorsCount: number;

  @action.bound
  public setDefault(mtr: TMTR = null) {
    this.step = 1;
    this.delivery = null;
    if (mtr) {
      this.delivery = { ...this.delivery, mtrCode: mtr.code, mtrName: mtr.name, mtrId: mtr.id };
    }
    this.errors = null;
    this.errorsCount = 0;
  }

  @action.bound
  public setStepHandler = (step: number): void => {
    if (this.step === STEP_INFO.FORM) {
      const result = applyValidators(validateConf)({ ...this.delivery });
      const errorsCount = Object.keys(result).length;

      this.errors = result;
      this.errorsCount = errorsCount;

      if (errorsCount) {
        return;
      }
    }

    this.step = step;
  };

  public onRemoveDocument = (id: string): void => {
    this.delivery = {
      ...this.delivery,
      documents: (this.delivery.documents || []).filter(
        pipe(
          propEq('id', id),
          not
        )
      ),
    };
  };

  public onChangeForm = (newValue: any, oldValue: any, field: string) => {
    this.delivery = { ...this.delivery, [field]: newValue };
  };

  public onChangeFiles = (documents: Array<TDocument>) => {
    this.delivery = { ...this.delivery, documents };
  };
}
