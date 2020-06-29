import * as React from 'react';
import { Entities } from '../../../../entities';
import { CheckIcon, CloseIcon, ClockIcon, DocumentIcon, TimeIcon } from 'components/ui';

import TContractStatus = Entities.TContractStatus;
import TControlStatus = Entities.TControlStatus;
import TDocumentStatus = Entities.TDocumentStatus;
import TDeliveryStatus = Entities.TDeliveryStatus;
import TComplaintStatus = Entities.TComplaintStatus;

type TCommonStatus<T extends keyof any> = {
  texts: Record<T, string>;
  icons?: Record<T, any> | { ANYCASE: any };
  colors?: Record<T, any> | { ANYCASE: any };
};

export const CONTRACT_STATUSES: TCommonStatus<TContractStatus> = {
  texts: {
    approving: 'Направлен поставщику',
    approved: 'Принят',
    rejected: 'Отклонен',
  },
  icons: {
    approving: null,
    approved: <CheckIcon size={'small'} color={'brand'} />,
    rejected: <CloseIcon size={'small'} color={'brand'} />,
  },
};

export const DOCUMENT_STATUSES: TCommonStatus<TDocumentStatus> = {
  texts: {
    approving: 'Согласование',
    approved: 'Согласовано',
    accepted: 'Принят',
    rejected: 'Отклонено',
    closed: 'Закрыто',
  },
  colors: {
    approving: 'Basic600',
    approved: 'Green600',
    accepted: 'Green600',
    rejected: 'Red600',
    closed: 'Basic1000',
  },
};

export const DELIVERY_STATUSES: TCommonStatus<TDeliveryStatus> = {
  texts: {
    delivery: 'Осуществляется доставка',
    accepting: 'Осуществляется приемка',
    accepted: 'Груз принят Покупателем',
    custody: 'Груз принят на отв. хранение',
  },
  icons: {
    ANYCASE: <ClockIcon size="medium" color={'Basic600'} />,
  },
};

export const COMPLAINT_STATUSES: TCommonStatus<TComplaintStatus> = {
  texts: {
    representative: 'Направление представителя Поставщика',
    docs_update: 'Внесение доп. документов',
    no_act_fix: 'Согласование устранения недостатков без акта',
    act: 'Формирование акта о выявленных недостатках',
    act_approving: 'Согласование акта о выявленных недостатках	',
    fix_method: 'Определение метода устранения недостатков',
    fix_method_approving: 'Согласование метода устранения недостатков',
    tech_docs_update: 'Обновление ТСД',
    tech_docs_approving: 'Согласование ТСД',
    delivery_add: 'Создание допоставки',
    delivery: 'Осуществляется допоставка',
    fix: 'Устранение недостатков',
    fix_approving: 'Подтверждение устранения недостатков',
    complaint_closed: 'Рекламация закрыта',
    claim_work: 'Ведется претензионная работа',
    claim_work_fixed: 'Ведется претензионная работа. Недостатки устранены',
  },
  icons: {
    ANYCASE: <ClockIcon size="medium" color={'Basic600'} />,
  },
};

export const CONTROL_STATUSES: TCommonStatus<TControlStatus> = {
  texts: {
    inspection_plan: 'Планирование ИК',
    ppi_approving: 'Согласование дат Инспектором',
    ppi_date_approving: 'Согласование дат Покупателем',
    ppi_fix: 'Доработка ППИ',
    dates_fix: 'Корректировка дат',
    order_applying: 'Внесение наряд-заказа',
    order_approving: 'Согласование наряд-заказа',
    order_fix: 'Доработка наряд-заказа',
    inspection_start: 'Начат инспекционный контроль',
    inspection_meeting: 'Проведение прединспекционного совещания',
    inspection: 'Инспектор направлен',
    final_report_approving: 'Согласование окончательного отчета',
    control_finish: 'Инспекционный контроль завершен',
    inspector_call: 'Ожидается запрос на проведение инспекции',
    inspector_sent: 'Направление инспектора',
    control_material: 'Входной контроль материалов',
    control_product: 'Контроль производства',
    control_docs: 'Проверка документов',
    delivery_allowed: 'Выдано разрешение на отгрузку',
    delivery_spoiled: 'Отгрузка с несоответствиями',
    control_shipment: 'Контроль погрузки',
  },
  icons: {
    inspection_plan: <ClockIcon size={'medium'} color={'Basic600'} />,
    ppi_approving: <ClockIcon size={'medium'} color={'Basic600'} />,
    ppi_date_approving: <ClockIcon size={'medium'} color={'Basic600'} />,
    ppi_fix: <ClockIcon size={'medium'} color={'Basic600'} />,
    dates_fix: <ClockIcon size={'medium'} color={'Basic600'} />,
    order_applying: <ClockIcon size={'medium'} color={'Basic600'} />,
    order_approving: <ClockIcon size={'medium'} color={'Basic600'} />,
    order_fix: <ClockIcon size={'medium'} color={'Basic600'} />,
    inspection_start: <DocumentIcon size={'medium'} color={'Basic600'} />,
    inspection_meeting: <DocumentIcon size={'medium'} color={'Basic600'} />,
    inspection: <DocumentIcon size={'medium'} color={'Basic600'} />,
    final_report_approving: <DocumentIcon size={'medium'} color={'Basic600'} />,
    control_finish: <CheckIcon size={'medium'} color={'Basic600'} />,
    inspector_call: <DocumentIcon size={'medium'} color={'Basic600'} />,
    inspector_sent: <DocumentIcon size={'medium'} color={'Basic600'} />,
    control_material: <DocumentIcon size={'medium'} color={'Basic600'} />,
    control_product: <DocumentIcon size={'medium'} color={'Basic600'} />,
    control_docs: <DocumentIcon size={'medium'} color={'Basic600'} />,
    delivery_allowed: <CheckIcon size={'medium'} color={'Basic600'} />,
    delivery_spoiled: <DocumentIcon size={'medium'} color={'Basic600'} />,
    control_shipment: <DocumentIcon size={'medium'} color={'Basic600'} />,
  },
};

export const ORDER_STATUSES: TCommonStatus<TContractStatus> = {
  texts: {
    approving: 'Направлена поставщику',
    approved: 'Принята',
    rejected: 'Отклонена',
  },
  icons: {
    approving: <TimeIcon size={'medium'} color={'Basic600'} />,
    approved: <CheckIcon size={'small'} color={'brand'} />,
    rejected: <CloseIcon size={'small'} color={'brand'} />,
  },
  colors: {
    approving: 'Basic600',
    approved: 'Green600',
    rejected: 'Red600',
  },
};

export const MTR_STATUSES: TCommonStatus<TContractStatus> = {
  texts: {
    approving: 'Планируется',
    approved: 'В работе',
    rejected: 'Есть проблемы',
  },
  colors: {
    approving: 'Basic600',
    approved: 'Basic1000',
    rejected: 'Red600',
  },
};
