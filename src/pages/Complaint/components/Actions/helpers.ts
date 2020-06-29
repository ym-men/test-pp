import { IStores } from 'mobx-stores/stores';
import { IModalConfig } from 'components/Modals';
import { Entities } from '../../../../../entities';
import TComplaintStatus = Entities.TComplaintStatus;
import TRoles = Entities.TRoles;
import { TModalField } from '../../../../components/Modals';
import * as styles from './styles.styl';

export type TActionButton = {
  text: string;
  isActionBtn?: boolean;
  exec: (stores: IStores) => void;
  condition?: (stores: IStores) => boolean;
};

export type TActionBlock = {
  condition: (stores: IStores) => boolean;
  icon?: React.FunctionComponent<any>;
  title: string | ((stores: IStores) => string);
  description?: string;
  buttons?: TActionButton[];
};

export const button = (
  status: TComplaintStatus,
  text: string,
  modalConfig?: IModalConfig | false,
  isActionBtn?: boolean,
  condition?: (stores: IStores) => boolean
) =>
  ({
    text,
    isActionBtn,
    condition,
    exec: ({ modals, activeComplaint }: IStores) =>
      modalConfig
        ? modals.openModal(modalConfig, data => activeComplaint.changeStatus(status, data))
        : activeComplaint.changeStatus(status),
  } as TActionButton);

export const conditionBy = (checkStatus: TComplaintStatus, checkRole?: TRoles) => ({
  activeComplaint: { status },
  user: { role },
}: IStores) => status === checkStatus && (!checkRole || role === checkRole);

interface IModalWithProps {
  stores: IStores;
  docTypes: number[];
  title: string;
  status: TComplaintStatus;
  namespace?: string;
}

export const modalWithDoc = (props: IModalWithProps) => {
  const { modals, activeComplaint, catalogs } = props.stores;

  const neededDocs = props.docTypes.filter(
    docType => !activeComplaint.data.documents.find(d => d.type === docType)
  );

  if (neededDocs.length) {
    modals.openModal(
      {
        title: props.title,
        description: 'Необходимо приложить документы',
        fields: neededDocs.map(
          (docType, idx) =>
            ({
              type: 'dropFile',
              field: `document${idx}`,
              title: catalogs.getDocumentTypeName(props.namespace || 'complaint', docType),
              props: {
                documentType: docType,
              },
              className: styles.dropFile,
              required: true,
            } as TModalField)
        ),
        okBtn: 'Отправить',
      },
      data => activeComplaint.changeStatus(props.status, data)
    );
  } else {
    activeComplaint.changeStatus(props.status);
  }
};
