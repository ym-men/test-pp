import * as React from 'react';
import { Button, Text } from 'components/ui';
import { Box } from 'grommet';
import * as styles from './styles.styl';
import { Entities } from '../../../../../../../entities';
import { dateFormatToString } from 'utils';
import { DocumentStatus } from 'components/ui/Statuses';
import TDocument = Entities.TDocument;
import { getUrl } from 'services/utils';

const Item: React.FunctionComponent<{ text: any }> = props => (
  <Box direction="row" margin={{ vertical: 'xsmall' }}>
    <Text className={styles.label}>{props.text}:</Text>
    <Text className={styles.text}>{props.children}</Text>
  </Box>
);

export const FileInfoBlock: React.FunctionComponent<{ document: TDocument }> = ({ document }) => (
  <Box direction="row" margin={{ vertical: 'medium' }} justify="between">
    <Box className={styles.fileInfoContainer}>
      <Item text="Имя файла">{document.name}</Item>
      <Item text="Статус">
        <DocumentStatus doc={document} />
      </Item>
      <Item text="Когда добавлен">{dateFormatToString(new Date(document.date as Date))}</Item>
      <Item text="Кем добавлен">{document.author}</Item>
      {document.comment ? <Item text="Комментарий">{document.comment.text}</Item> : null}
    </Box>
    <Box>
      <Button
        id="control-fileInfoBlock-button-downloadFile"
        btnType="ahref"
        small={true}
        href={getUrl('FILE_DOWNLOAD', document.id, 1)}
        download={true}
      >
        Скачать
      </Button>
    </Box>
  </Box>
);
