import * as React from 'react';
import { Steps, BreadCrumbs } from 'components/ui';
import * as styles from './ContractForm.styl';
import { Box, Text, BoxProps } from 'grommet';
import { STEP_INFO, STEPS } from './FormConfig';
import { Entities } from '../../../../../entities';
import TDocument = Entities.TDocument;
import { StepFiles } from '../Steps/StepFiles';
import { StepFormNew } from '../Steps/StepFormNew';
import { StepSend } from './components/StepSend';
import TContract = Entities.TContract;
import { IStores } from 'mobx-stores/stores';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

export namespace ContractForm {
  export type TProps = IProps;
}

interface IProps extends IStores {
  contract?: TContract | null;
  onSave: () => void;
  onChange?: (contract: TContract, orders: Array<any>, files: Array<any>) => void;
  className?: string;
  boxProps?: BoxProps;
  stepTitle?: string;
  documentTypes: 'contract' | 'order' | 'control' | 'delivery';
  isLoading?: boolean;
}

@inject('activeContract')
@observer
export class ContractForm extends React.Component<IProps> {
  @observable private step: number = STEP_INFO.FORM;

  public setStepHandler = (step: number): void => {
    this.step = step;
  };

  public render(): React.ReactNode {
    const fileOptions = {
      step: this.step,
      noSteps: false as false,
      onNext: this.setStepHandler,
      stepName: STEP_INFO.FILES,
      nextStep: STEP_INFO.SEND,
    };

    return (
      <Box direction="row" width={'100%'} margin={{ top: 'large' }} {...this.props.boxProps}>
        <Box direction="column" width={'100%'} className={styles.stepSide}>
          <BreadCrumbs />
          <Box margin={{ top: 'small' }}>
            <Text className={styles.stepTitle}>{this.props.stepTitle || 'Новый договор'}</Text>
          </Box>
          <Steps className={styles.step} options={STEPS} selected={this.step} />
        </Box>
        <Box direction="column" width={'100%'} className={styles.formSide}>
          {this.step === STEP_INFO.FORM && (
            <StepFormNew onSubmit={() => this.setStepHandler(STEP_INFO.FILES)} />
          )}
          {this.step === STEP_INFO.FILES && (
            <StepFiles
              options={fileOptions}
              documentType={this.props.documentTypes}
              onRemoveDocument={this.onRemoveDocument}
              documents={this.props.activeContract.data.documents || []}
              title="Пожалуйста, загрузите изображения всех страниц договора"
              onChange={this.onChangeFiles}
            />
          )}
          {this.step === STEP_INFO.SEND && (
            <StepSend
              step={this.step}
              stepName={STEP_INFO.SEND}
              fileStep={STEP_INFO.FILES}
              formStep={STEP_INFO.FORM}
              onNext={this.setStepHandler}
              data={this.props.activeContract.data as any}
              onSave={this.props.onSave}
              isLoading={this.props.isLoading}
            />
          )}
        </Box>
      </Box>
    );
  }

  protected onRemoveDocument = (id: string): void => {
    this.props.activeContract.data = {
      ...this.props.activeContract.data,
      documents: (this.props.activeContract.data.documents || []).filter(doc => doc.id !== id),
    };
  };

  protected onChangeFiles = (documents: Array<TDocument>) => {
    this.props.activeContract.data = {
      ...this.props.activeContract.data,
      documents,
    };
  };
}
