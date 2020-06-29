import * as React from 'react';
import { Box, Heading, Text } from 'grommet';
import { If, Button, CatalogItem } from 'components/ui';
import { ContractCard } from '../ContractCard';
import { Entities } from '../../../../../../entities';
import { FileList } from '../../Steps/FileList';
import TContract = Entities.TContract;
import TDocument = Entities.TDocument;

export class StepSend<T extends TContract> extends React.Component<ISendProps<T>> {
  public render() {
    return (
      <If condition={this.props.stepName === this.props.step}>
        <Box>
          <Heading margin={{ bottom: 'xsmall' }}>Отправка на согласование</Heading>
          <Text margin={{ vertical: 'small' }} size={'large'}>
            Пожалуйста, проверьте все данные перед отправкой договора поставщику.
          </Text>
        </Box>
        <ContractCard contract={this.props.data} />
        <Box alignSelf={'start'}>
          <Button
            id="contract-contractForm-button-changeData"
            small={true}
            onClick={this.onFormHandler}
          >
            Изменить данные
          </Button>
        </Box>
        <Box margin={{ top: 'medium' }}>
          <FileList
            documents={this.props.data.documents || []}
            typeRender={this.getTypeComponent}
          />
        </Box>
        <Box margin={{ top: 'medium' }} alignSelf={'start'}>
          <Button
            id="contract-contractForm-button-changeFiles"
            small={true}
            onClick={this.onFileHandler}
          >
            Изменить файлы
          </Button>
        </Box>
        <Box margin={{ top: 'medium' }} alignSelf={'start'}>
          <Button
            id="contract-contractForm-button-send"
            action={true}
            onClick={this.props.onSave}
            isLoading={this.props.isLoading}
          >
            Отправить
          </Button>
        </Box>
      </If>
    );
  }

  protected onFormHandler = () => this.props.onNext(this.props.formStep);
  protected onFileHandler = () => this.props.onNext(this.props.fileStep);
  protected getTypeComponent = (document: TDocument) => (
    <CatalogItem namespace={['documentTypes', 'contract']} id={document.type} />
  );
}

interface ISendProps<T extends TContract> {
  data: Partial<T>;
  step: number;
  stepName: number | string;
  fileStep: number | string;
  formStep: number | string;
  onNext: (step: number | string) => void;
  onSave: () => void;
  isLoading?: boolean;
}
