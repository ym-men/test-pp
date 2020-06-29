import * as React from 'react';
import { Box, Heading, Text } from 'grommet';
import { Button } from '../';
import { UploadedFileList } from './List';
import { Entities } from '../../../../entities';
import TDocument = Entities.TDocument;
import ICatalogs = Entities.ICatalogs;
import { file } from '../../../services/files';
import IFileData = file.IFileData;

interface IProps {
  documents: Array<TDocument>;
  onRemoveDocument: (id: string) => void;
  onChangeType: (doc: TDocument) => void;
  onChangeFiles: (list: Array<IFileData>) => void;
  title: string | React.ReactNode;
  namespace: keyof ICatalogs['documentTypes'];
  allowedDocumentTypes?: number[];
  head?: string | React.ReactNode;
}

export const DropFileWithList: React.FunctionComponent<IProps> = props => (
  <Box>
    <Box>
      {props.head && <Heading margin={{ bottom: 'xsmall' }}>{props.head}</Heading>}
      {props.title && (
        <Text margin={{ vertical: 'small' }} size={'large'}>
          {props.title}
        </Text>
      )}
    </Box>
    <Box margin={{ top: 'medium' }}>
      <UploadedFileList
        namespace={props.namespace}
        allowedDocumentTypes={props.allowedDocumentTypes}
        onRemoveDocument={props.onRemoveDocument}
        documents={props.documents}
        onChangeType={props.onChangeType}
      />
    </Box>
    <Box direction={'row'} alignSelf={'start'} margin={{ vertical: 'large' }} align={'center'}>
      <Button
        id="dropFileWithList-file-overview"
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
  </Box>
);
