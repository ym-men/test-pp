import * as React from 'react';
import * as styles from './DeliveryForm.styl';
import { Steps } from 'components/ui';
import { Box, Text, BoxProps } from 'grommet';
import { Step1Form, STEP_INFO, STEPS } from './FormConfig';
import { Entities } from '../../../entities';
import { StepForm } from './components/StepForm';
import { StepFiles } from 'components/Contracts/components/Steps/StepFiles';
import { StepSend } from './components/StepSend';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import TMTR = Entities.TMTR;
import TDelivery = Entities.TDelivery;

const DELIVERY_ADD_DOCUMENT_TYPES = [0, 1, 2, 3, 7, 10, 9];

@inject('deliveryAdd', 'catalogs')
@observer
export class DeliveryAddComponent extends React.Component<IProps & IStores, {}> {
  public componentWillMount() {
    this.props.deliveryAdd.setDefault(this.props.mtr);
  }

  public render(): React.ReactNode {
    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="column">
        <Box direction="row" width={'100%'} {...this.props.boxProps}>
          <Box direction="column" width={'100%'} className={styles.stepSide}>
            <Box margin={{ top: 'small' }}>
              <Text className={styles.stepTitle}>{this.props.stepTitle || 'Новая поставка'}</Text>
            </Box>
            <Steps className={styles.step} options={STEPS} selected={this.props.deliveryAdd.step} />
          </Box>
          <Box direction="column" width={'100%'} className={styles.formSide}>
            <StepForm
              step={this.props.deliveryAdd.step}
              config={Step1Form(this.props.catalogs.data)}
              data={this.props.deliveryAdd.delivery}
              errors={this.props.deliveryAdd.errors}
              onChangeForm={this.props.deliveryAdd.onChangeForm}
              onNext={this.props.deliveryAdd.setStepHandler}
              nextStep={STEP_INFO.FILES}
              stepName={STEP_INFO.FORM}
              hasError={!!this.props.deliveryAdd.errorsCount}
            />
            <StepFiles
              options={{
                step: this.props.deliveryAdd.step,
                noSteps: false as false,
                onNext: this.props.deliveryAdd.setStepHandler,
                stepName: STEP_INFO.FILES,
                nextStep: STEP_INFO.SEND,
              }}
              documentType={this.props.documentTypes}
              onRemoveDocument={this.props.deliveryAdd.onRemoveDocument}
              documents={this.props.deliveryAdd.delivery.documents || []}
              title="Пожалуйста, проверьте все данные перед началом поставки."
              head="Товарно-сопроводительные документы"
              onChange={this.props.deliveryAdd.onChangeFiles}
              allowedDocumentTypes={DELIVERY_ADD_DOCUMENT_TYPES}
              filesRequired={true}
            />
            <StepSend
              step={this.props.deliveryAdd.step}
              stepName={STEP_INFO.SEND}
              fileStep={STEP_INFO.FILES}
              formStep={STEP_INFO.FORM}
              onNext={step => this.props.deliveryAdd.setStepHandler(step)}
              data={this.props.deliveryAdd.delivery}
              isLoading={this.props.isLoading}
              onSave={() => {
                if (this.props.onSave) {
                  this.props.onSave(this.props.deliveryAdd.delivery);
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }
}

interface IProps {
  mtr: TMTR | null;
  onSave?: (delivery: TDelivery) => void;
  className?: string;
  boxProps?: BoxProps;
  stepTitle?: string;
  isLoading?: boolean;
  documentTypes: 'contract' | 'order' | 'control' | 'delivery';
}
