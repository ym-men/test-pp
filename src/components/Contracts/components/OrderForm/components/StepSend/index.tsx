import * as React from 'react';
import { Box, Heading, Text } from 'grommet';
import { If, Button, CatalogItem } from 'components/ui';
import { Entities } from '../../../../../../../entities';
import { FileList } from '../../../Steps/FileList';
import { orderInfo } from '../OrderInfo';
import { Info } from '../Info';
import { positionInfo } from '../PositionInfo';
import TDocument = Entities.TDocument;
import TOrder = Entities.TOrder;

const InfoWithOrderList = orderInfo(Info);
const InfoWithPositionList = positionInfo(Info);

export class StepSend<T extends TOrder> extends React.PureComponent<ISendProps<T>> {
  public render() {
    return (
      <If condition={this.props.stepName === this.props.step}>
        <Heading margin={{ bottom: 'xsmall' }}>Отправка на согласование</Heading>
        <Text margin={{ bottom: 'small' }}>
          Пожалуйста, проверьте все данные перед отправкой разнарядки поставщику.
        </Text>

        <InfoWithOrderList order={this.props.data as TOrder} />

        {(this.props.data.mtrs || []).map((item: any, index: number) => (
          <InfoWithPositionList key={`mtr_${index}`} index={index} mtr={item} />
        ))}

        <Box alignSelf="start">
          <Button id="order-stepSend-button-changeData" small={true} onClick={this.onFormHandler}>
            Изменить
          </Button>
        </Box>

        <Box margin={{ top: 'medium' }}>
          <FileList
            documents={this.props.data.documents || []}
            typeRender={this.getTypeComponent}
          />
        </Box>

        <Box margin={{ top: 'medium' }} alignSelf={'start'}>
          <Button id="order-stepSend-button-changeFiles" small={true} onClick={this.onFileHandler}>
            Изменить
          </Button>
        </Box>

        <Box alignSelf={'start'}>
          <Button
            id="order-stepSend-button-send"
            isLoading={this.props.isCreateLoading}
            onClick={this.props.onSave}
            margin={{ top: 'medium' }}
            action={true}
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
    <CatalogItem namespace={['documentTypes', 'order']} id={document.type} />
  );
}

interface ISendProps<T> {
  data: Partial<T>;
  step: number;
  stepName: number | string;
  fileStep: number | string;
  formStep: number | string;
  onNext: (step: number | string) => void;
  onSave: () => void;
  isCreateLoading?: boolean;
}
