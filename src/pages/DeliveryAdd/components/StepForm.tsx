import * as React from 'react';
import * as styles from './StepForm.styl';
import { Box, Text } from 'grommet';
import { Button, FormConstructor } from 'components/ui';
import TFormOption = FormConstructor.TFormOption;

export class StepForm<T> extends React.PureComponent<IFormProps<T>> {
  public render() {
    return this.props.stepName === this.props.step ? (
      <Box>
        <FormConstructor
          className={styles.StepForm}
          data={this.props.data}
          errors={this.props.errors}
          onChangeData={this.props.onChangeForm}
          formOptions={this.props.config}
        />
        <Box margin={{ top: 'medium' }} alignSelf={'start'} direction="row" align={'center'}>
          <Button onClick={this.onNextHandler} action={true}>
            Продолжить
          </Button>
          {this.props.hasError && (
            <Text margin={{ left: 'medium' }} color="Red600">
              Пожалуйста, заполните правильно все поля формы
            </Text>
          )}
        </Box>
      </Box>
    ) : null;
  }

  protected onNextHandler = () => this.props.onNext(this.props.nextStep);
}

interface IFormProps<T> {
  data: Partial<T>;
  errors: { [F in keyof T]: Array<string> };
  step: number;
  stepName: number | string;
  nextStep: number | string;
  onNext: (step: number | string) => void;
  config: Array<TFormOption<T>>;
  onChangeForm: (newValue: T[keyof T], oldValue: T[keyof T], field: keyof T) => void;
  hasError?: boolean;
}
