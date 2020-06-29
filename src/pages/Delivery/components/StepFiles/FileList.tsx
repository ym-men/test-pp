import * as React from 'react';
import { Box } from 'grommet';
import { evolve, pipe, prop } from 'ramda';
import { CatalogItem, DownloadIcon, Text } from 'components/ui';
import 'components/ui/Icons/CustomizedIcons';
import { getNiceSize, roundTo, toStringFileSize, fullDateFormat } from 'utils';
import { Entities } from '../../../../../entities';
import TDocument = Entities.TDocument;
import TControlStatus = Entities.TControlStatus;
import TRoles = Entities.TRoles;
import { FlexiTable } from 'components/ui/FlexiTable';
import { getUrl } from 'services/utils';

export const FileList: React.FunctionComponent<IPropsFileList> = props => {
  return (
    <FlexiTable
      columns={FILES_LIST_CONFIG({
        isEditable: props.isEditable,
        stepStatus: props.stepStatus,
        onRemoveDocument: props.onRemoveDocument,
        userRole: props.userRole,
      })}
      defaultSortBy={'status'}
      data={props.documents}
      rowProps={{
        clickable: false,
      }}
    />
  );
};

interface IConfigData {
  onRemoveDocument: (id: string) => void;
  isEditable: boolean;
  stepStatus?: TControlStatus;
  userRole: TRoles | '';
}

interface IPropsFileList extends IConfigData {
  documents: TDocument[];
  onRemoveDocument: (id: string) => void;
  onDocumentClick: (id: string) => void;
  userRole: TRoles | '';
}

const FILES_LIST_CONFIG = (data: IConfigData): Array<FlexiTable.IFlexiTableColumn<TDocument>> => {
  return [
    {
      property: 'date',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Дата и время
        </Text>
      ),
      render: (doc: TDocument) => <Text>{fullDateFormat(doc.date)}</Text>,
      width: 140,
    },
    {
      property: 'name',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Имя
        </Text>
      ),
      render: (doc: TDocument) => <Text>{doc.name}</Text>,
      width: 240,
    },
    {
      property: 'size',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Размер
        </Text>
      ),
      render: pipe(
        prop('size'),
        getNiceSize,
        evolve({ size: roundTo(2) }),
        toStringFileSize as any
      ),
      width: 85,
    },
    {
      property: 'type',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Тип
        </Text>
      ),
      render: (doc: TDocument) => (
        <Box direction="row">
          <CatalogItem namespace={['documentTypes', 'delivery']} id={doc.type} />
        </Box>
      ),
      width: 180,
    },
    {
      property: 'downloadBtn',
      header: <Text size={'small'} color={'Basic600'} />,
      render: (doc: TDocument) => (
        <Box justify="start" onClick={evt => evt.stopPropagation()}>
          <a download={''} href={getUrl('FILE_DOWNLOAD', doc.id, 1)}>
            <DownloadIcon hover={true} size={'15px'} />
          </a>
        </Box>
      ),
      width: 30,
    },
  ] as Array<FlexiTable.IFlexiTableColumn<TDocument>>;
};
