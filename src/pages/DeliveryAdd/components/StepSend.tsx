import * as React from 'react';
import { Box, Heading, Text } from 'grommet';
import { If, Button } from 'components/ui';
import { DeliveryCard } from '../DeliveryCard';
import { Entities } from '../../../../entities';
import { UploadedFileList } from 'components/ui/DropFileWithList/List';
import TDelivery = Entities.TDelivery;

export const StepSend: React.FunctionComponent<IProps> = ({ ...props }) => {
  return (
    <If condition={props.stepName === props.step}>
      <Box>
        <Heading margin={{ bottom: 'xsmall' }}>Почти готово</Heading>
        <Text margin={{ vertical: 'small' }} size={'large'}>
          Пожалуйста, проверьте все данные перед началом поставки.
        </Text>
      </Box>
      <DeliveryCard delivery={props.data} />
      <Box alignSelf={'start'}>
        <Button
          id="delivery-stepSend-button-changeData"
          small={true}
          onClick={() => props.onNext(props.formStep)}
        >
          Изменить данные
        </Button>
      </Box>
      <Box margin={{ top: 'medium' }}>
        <UploadedFileList readOnly={true} documents={props.data.documents} namespace="delivery" />
      </Box>
      <Box margin={{ top: 'medium' }} alignSelf={'start'}>
        <Button
          id="delivery-stepSend-button-changeFiles"
          small={true}
          onClick={() => props.onNext(props.fileStep)}
        >
          Изменить файлы
        </Button>
      </Box>
      <Box margin={{ top: 'medium' }} alignSelf={'start'}>
        <Button
          id="delivery-stepSend-button-send"
          isLoading={props.isLoading}
          action={true}
          onClick={props.onSave}
        >
          Отправить
        </Button>
      </Box>
    </If>
  );
};

interface IProps {
  data: TDelivery;
  step: number;
  stepName: number;
  fileStep: number;
  formStep: number;
  onNext: (step: number) => void;
  onSave: () => void;
  isLoading?: boolean;
}
