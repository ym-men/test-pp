import * as React from 'react';
import { Box } from 'grommet';
import { evolve, pipe, prop } from 'ramda';
import { CatalogItem, CloseIcon, DownloadIcon, Text } from 'components/ui';
import { getNiceSize, roundTo, toStringFileSize, fullDateFormat } from 'utils';
import { Entities } from '../../../../../entities';
import { FlexiTable } from 'components/ui/FlexiTable';
import { DocumentStatus } from 'components/ui/Statuses';
import 'components/ui/Icons/CustomizedIcons';
import TDocument = Entities.TDocument;
import TControlStatus = Entities.TControlStatus;
import TRoles = Entities.TRoles;
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { getUrl } from 'services/utils';

@inject('activeControl')
@observer
export class FileList extends React.Component<IPropsFileList & IStores> {
  public render() {
    const {
      documents,
      isEditable,
      stepStatus,
      onRemoveDocument,
      onDocumentClick,
      userRole,
      activeControl,
    } = this.props;
    return (
      <FlexiTable
        columns={FILES_LIST_CONFIG({
          isEditable,
          stepStatus,
          onRemoveDocument,
          userRole,
        })}
        defaultSortBy={'date'}
        data={documents}
        rowProps={document => ({
          actionAllowed:
            document &&
            (activeControl.isReportEditable(document) || activeControl.isNotifyEditable(document)),
          onClick: () => onDocumentClick(document.id),
        })}
        showLinks={true}
      />
    );
  }
}

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
      width: 180,
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
          <CatalogItem namespace={['documentTypes', 'control']} id={doc.type} />
        </Box>
      ),
      width: 160,
    },
    {
      property: 'status',
      header: (
        <Text size={'small'} color={'Basic600'}>
          Статус
        </Text>
      ),
      render: (doc: TDocument) => <DocumentStatus doc={doc} />,
      width: 120,
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
    {
      property: 'removeBtn',
      header: <Text size={'small'} color={'Basic600'} />,
      render: (doc: TDocument) => {
        const isForbiddenToDel =
          data.userRole === 'OUTSIDE_INSPECTOR' && data.stepStatus === 'inspection';
        const render = data.isEditable && !isForbiddenToDel && doc.status === null && doc.isDraft;

        return render ? (
          <Box
            justify="start"
            onClick={evt => {
              evt.stopPropagation();
              data.onRemoveDocument(doc.id);
            }}
          >
            <CloseIcon hover={true} size={'15px'} />
          </Box>
        ) : null;
      },
      width: 30,
    },
  ] as Array<FlexiTable.IFlexiTableColumn<TDocument>>;
};
