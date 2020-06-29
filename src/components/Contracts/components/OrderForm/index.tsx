import * as React from 'react';
import * as styles from './OrderForm.styl';
import * as moment from 'moment';
import { Steps, BreadCrumbs } from 'components/ui';
import { Box, BoxProps } from 'grommet';
import { Text } from 'components/ui';
import { Step1Form, STEP_INFO, STEPS, validateConf } from './FormConfig';
import { file } from '../../../../services/files';
import { StepForm } from '../Steps/StepForm';
import { StepFiles } from '../Steps/StepFiles';
import { StepSend } from './components/StepSend';
import { Entities } from '../../../../../entities';
import { applyValidators } from 'utils/validators';
import { not, pipe, propEq } from 'ramda';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import TDocument = Entities.TDocument;
import TOrder = Entities.TOrder;
import { addDeleted } from 'utils/addDeleted';
import { toJS } from 'mobx';

@inject('catalogs')
@observer
export class OrderForm extends React.Component<IProps, IState> {
  public readonly state = {
    isChanged: false,
    order: this.props.order || ({} as Entities.TOrder),
    errors: {} as { [key in keyof Entities.TOrder]?: Array<string> },
    errorsCount: 0,
    orders: [] as TOrder[],
    files: [] as any[],
    step: 1,
  };

  public setStepHandler = (step: number) => {
    if (this.state.step === STEP_INFO.FORM) {
      const result = applyValidators(validateConf)({ ...this.props.order, ...this.state.order });
      const errorsCount = Object.keys(result).length;

      this.setState({ errors: result, errorsCount });

      if (errorsCount) {
        return;
      }
    }

    this.setState({ step });
  };

  public render(): React.ReactNode {
    const orderData = { ...this.props.order, ...this.state.order };
    const fileOptions = {
      step: this.state.step,
      noSteps: false as false,
      onNext: this.setStepHandler,
      stepName: STEP_INFO.FILES,
      nextStep: STEP_INFO.SEND,
    };
    return (
      <Box direction="row" {...this.props.boxProps}>
        <Box direction="column" className={styles.stepSide}>
          <BreadCrumbs />
          <Text className={styles.stepTitle}>{this.props.stepTitle || this.props.children}</Text>
          <Steps
            className={styles.step}
            options={STEPS}
            onSelectStep={this.setStepHandler}
            selected={this.state.step}
          />
        </Box>
        <Box
          direction="column"
          className={styles.formSide}
          fill={'horizontal'}
          margin={{ bottom: 'medium' }}
        >
          <StepForm
            data={orderData}
            errors={this.state.errors as any}
            step={this.state.step}
            stepName={STEP_INFO.FORM}
            nextStep={STEP_INFO.FILES}
            onNext={this.setStepHandler}
            config={Step1Form(this.props.catalogs.data)}
            onChangeForm={this.onChangeForm}
            hasError={!!this.state.errorsCount}
          />
          <StepFiles
            options={fileOptions}
            onRemoveDocument={this.onRemoveDocument}
            documents={orderData.documents || []}
            title="Пожалуйста, загрузите изображения всех страниц разнарядки."
            onChange={this.onChangeFiles}
            documentType="order"
          />
          <StepSend
            step={this.state.step}
            stepName={STEP_INFO.SEND}
            fileStep={STEP_INFO.FILES}
            formStep={STEP_INFO.FORM}
            onNext={this.setStepHandler}
            data={orderData as TOrder}
            isCreateLoading={this.props.isCreateLoading}
            onSave={this.onSave}
          />
        </Box>
      </Box>
    );
  }

  protected onRemoveDocument = (id: string): void => {
    this.setState({
      isChanged: true,
      order: {
        ...this.state.order,
        documents: (this.state.order.documents || []).filter(
          pipe(
            propEq('id', id),
            not
          )
        ),
      },
    });
  };

  protected onSave = () => {
    const now = new Date();
    this.state.order.mtrs = (this.state.order.mtrs || []).filter(Boolean).map((mtr, index) => ({
      ...mtr,
      createDate: moment(now)
        .add('ms', index)
        .toDate(),
      dateFrom: mtr.date[0],
      dateTo: mtr.date[1],
    }));

    const orderData = this.state.isChanged
      ? {
          ...this.props.order,
          ...this.state.order,
        }
      : this.props.order;
    if (this.props.order.mtrs && this.props.order.mtrs.length > 0) {
      let mtrs = toJS(this.props.order.mtrs);
      mtrs = mtrs.concat(this.state.order.mtrs.filter(item => !item.id));
      orderData.mtrs = addDeleted(mtrs, this.state.order.mtrs);
    }

    this.props.onSave(orderData);
  };

  protected onChangeForm = (newValue: any, oldValue: any, field: string) => {
    this.setState(state => {
      return { isChanged: true, order: { ...this.props.order, ...state.order, [field]: newValue } };
    });
  };

  protected onChangeFiles = (documents: Array<TDocument>) => {
    this.setState(state => {
      return { isChanged: true, order: { ...this.props.order, ...state.order, documents } };
    });
  };
}

export namespace OrderForm {
  export type TProps = IProps;
}

interface IProps extends IStores {
  order?: Entities.TOrder | null;
  onSave: (order: Entities.TOrder) => void;
  onChange?: (order: Entities.TOrder, orders: Array<any>, files: Array<any>) => void;
  className?: string;
  boxProps?: BoxProps;
  stepTitle?: string;
  isCreateLoading?: boolean;
}

interface IState {
  isChanged: boolean;
  order: Entities.TOrder;
  errors: any;
  files: Array<file.IFileData>;
  step: number;
  errorsCount: number;
}
