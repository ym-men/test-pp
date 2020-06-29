import * as React from 'react';
import { Box, Heading, Text } from 'grommet';
import { If } from '../../../ui/If';
import { FileList } from './FileList';
import { Button } from '../../../ui/Button';
import { Entities } from '../../../../../entities';
import TDocument = Entities.TDocument;
import { file } from '../../../../services/files';
import IFileData = file.IFileData;

export const FilesForm: React.FunctionComponent<IProps> = props => (
  <Box>
    <Box>
      {props.head || <Heading margin={{ bottom: 'xsmall' }}>Загрузка документов</Heading>}
      {props.title && (
        <Text margin={{ vertical: 'small' }} size={'large'}>
          {props.title}
        </Text>
      )}
    </Box>
    <If condition={props.documents}>
      <Box margin={{ top: 'medium' }}>
        <FileList
          documents={props.documents}
          nameRender={props.getNameComponent}
          typeRender={props.getTypeComponent}
        />
      </Box>
    </If>
    <If condition={!props.noEdit}>
      <Box direction={'row'} alignSelf={'start'} margin={{ vertical: 'large' }} align={'center'}>
        <Button
          id="contract-filesForm-file-overview"
          onChange={props.onChangeFiles}
          accept={'image/*,application/pdf'}
          small={true}
          btnType={'file'}
        >
          Обзор
        </Button>
        <Text margin={{ horizontal: 'medium' }} size={'small'} color={'Basic600'}>
          Добавьте файл в одном из следующих форматов:
          <br />
          PDF, JPG, PNG, GIF, TIF
        </Text>
      </Box>
    </If>
  </Box>
);

interface IProps {
  documents: Array<TDocument>;
  getNameComponent: (document: TDocument) => string | React.ReactNode;
  getTypeComponent: (document: TDocument) => string | React.ReactNode;
  onChangeFiles: (list: Array<IFileData>) => void;
  title: string | React.ReactNode;
  head?: string | React.ReactNode;
  noEdit: boolean;
}
