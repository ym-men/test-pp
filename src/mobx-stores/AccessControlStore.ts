import * as moment from 'moment';
import * as _ from 'lodash';
import { computed } from 'mobx';
import { Entities } from '../../entities';
import TControlStatus = Entities.TControlStatus;
import TControl = Entities.TControl;
import { IStores } from './stores';
import AccessStore, { TAccess, TControlComponent } from './AccessStore';

export const controlComponents: TControlComponent[] = [
  'inspector',
  'dates',
  'production',
  'files',
  'staff',
  'meetingNeeded',
];

export type TControlComponentProps = {
  isVisible: boolean;
  isEditable: boolean;
};

export default class AccessControlStore extends AccessStore {
  @computed
  get iControl() {
    const { activeControl } = this.stores;

    const config =
      this.config[this.stores.activeControl.status] || (this.config.ppi_approving as TAccess);

    if (this.stores.user.role === config.role) {
      return {
        ...config,
        editableComponents: activeControl.pending ? [] : config.editableComponents,
      };
    } else {
      return {
        ...config,
        waiting: true,
        description: 'Пожалуйста дождитесь согласования данных',
        actions: [],
        editableComponents: [],
      };
    }
  }

  @computed
  public get components(): Record<TControlComponent, TControlComponentProps> {
    return controlComponents.reduce(
      (cmp: Record<TControlComponent, TControlComponentProps>, key: TControlComponent) => {
        cmp[key] = {
          isVisible: this.iControl.visibleComponents.indexOf(key) > -1,
          isEditable: this.iControl.editableComponents.indexOf(key) > -1,
        };

        return cmp;
      },
      {} as Record<TControlComponent, TControlComponentProps>
    );
  }

  private checkByFile = (type: number, customDocText?: string) => (data: TControl) => {
    if (!data.documents.some(doc => doc.type === type)) {
      const docType = this.getDocumentTypeName(type);
      const errMsg = `Приложите документ с типом ${customDocText ? customDocText : docType}`;
      return Promise.reject(new Error(errMsg));
    }

    return Promise.resolve();
  };

  private getDocumentTypeName(type: number) {
    const item = this.stores.catalogs.data.documentTypes.control.find(ctrl => ctrl.id === type);

    return item ? item.name : '';
  }

  private hasSome = (key: string, errorText: string) => (data: TControl) => {
    if (!data[key] || !data[key].length) {
      return Promise.reject(new Error(errorText));
    }

    return Promise.resolve();
  };

  private hasCorrectDates = (errorText: string) => (data: TControl) => {
    if (moment(data.dateStart.setHours(0, 0, 0, 0)).isAfter(data.dateEnd)) {
      return Promise.reject(new Error(errorText));
    }

    return Promise.resolve();
  };
  private hasCorrectTodayDates = (errorText: string) => (data: TControl) => {
    if (moment(new Date().setHours(0, 0, 0, 0)).isAfter(data.dateStart)) {
      return Promise.reject(new Error(errorText));
    }
    return Promise.resolve();
  };

  @computed
  public get config() {
    const meetingNeeded = _.get(this.stores.activeControl, 'data.meetingNeeded');

    const config: Record<TControlStatus | string, TAccess> = {
      inspection_plan: {
        role: 'CUSTOMER_MANAGER',
        headTitle: 'Планирование ИК',
        description:
          'Заполните сведения об адресах производственных площадок и данные контактных лиц (ФИО, телефоны)',
        actions: [
          {
            text: 'Отправить',
            isActionBtn: true,
            validations: [
              this.checkByFile(2),
              this.hasSome('addresses', 'Добавьте хотя бы одну производственную площадку'),
              this.hasCorrectDates('Дата начала контроля не может быть больше даты завершения'),
              this.hasCorrectTodayDates('Дата начала контроля не может быть ранее текущей даты'),
            ],
            exec: (stores: IStores) => stores.activeControl.approve('ppi_approving'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files'],
        editableComponents: ['production', 'files', 'dates'],
        allowedDocumentTypes: [15, 0, 1, 2],
      },
      ppi_approving: {
        role: 'OUTSIDE_INSPECTOR',
        headTitle: 'Согласование ППИ Инспектором',
        description: 'Проверьте ППИ и даты проведения инспекционного контроля',
        actions: [
          {
            text: 'Принять',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('ppi_date_approving'),
          },
          {
            text: 'Отклонить',
            validations: [],
            needComment: true,
            exec: (stores: IStores) => stores.activeControl.reject('inspection_plan'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files'],
        editableComponents: [],
        allowedDocumentTypes: [15],
      },
      ppi_date_approving: {
        role: 'BUYER_QUALITY_MANAGER',
        headTitle: 'Согласование ППИ Покупателем',
        description: 'Проверьте ППИ и даты проведения инспекционного контроля',
        actions: [
          {
            text: 'Согласовать',
            isActionBtn: true,
            validations: [this.checkByFile(4)],
            exec: (stores: IStores) => stores.activeControl.approve('order_approving'),
          },
          {
            text: 'Отклонить',
            validations: [],
            needComment: true,
            exec: (stores: IStores) => stores.activeControl.reject('inspection_plan'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'meetingNeeded'],
        editableComponents: ['inspector', 'files', 'meetingNeeded'],
        allowedDocumentTypes: [15, 4],
      },
      order_approving: {
        role: 'OUTSIDE_INSPECTOR',
        headTitle: 'Согласование наряд-заказа',
        description: 'Проверьте ППИ и даты проведения инспекционного контроля',
        actions: [
          {
            text: 'Согласовать',
            isActionBtn: true,
            validations: [this.checkByFile(5)],
            exec: (stores: IStores) =>
              stores.activeControl.approve(meetingNeeded ? 'inspection_meeting' : 'inspector_call'),
          },
          {
            text: 'На доработку',
            validations: [],
            exec: (stores: IStores) => stores.activeControl.reject('order_fix'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'meetingNeeded'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 5],
      },
      inspection_meeting: {
        role: 'BUYER_QUALITY_MANAGER',
        headTitle: 'Проведение прединспекционного совещания',
        description: 'Проверьте ППИ и даты проведения инспекционного контроля',
        actions: [
          {
            text: 'Начать инспекцию',
            isActionBtn: true,
            validations: [this.checkByFile(6)],
            exec: (stores: IStores) => stores.activeControl.approve('inspector_call'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 6],
      },
      order_fix: {
        role: 'BUYER_QUALITY_MANAGER',
        headTitle: 'Доработка наряд-заказа',
        description: 'Проверьте ППИ и даты проведения инспекционного контроля',
        actions: [
          {
            text: 'Внести',
            isActionBtn: true,
            validations: [this.checkByFile(4)],
            exec: (stores: IStores) => stores.activeControl.approve('order_approving'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 4],
      },

      inspector_call: {
        role: 'BUYER_QUALITY_MANAGER',
        actions: [
          {
            text: 'Отправить',
            isActionBtn: true,
            validations: [this.checkByFile(19)],
            exec: (stores: IStores) => stores.activeControl.approve('inspector_sent'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 19],
      },

      inspector_sent: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Отправить',
            isActionBtn: true,
            validations: [
              this.checkByFile(18),
              this.hasSome(
                'inspectors',
                'Добавьте хотя бы одного сотрудника инспекционного контроля'
              ),
            ],
            exec: (stores: IStores) => stores.activeControl.approve('inspection'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['staff', 'files'],
        allowedDocumentTypes: [15, 18],
      },

      inspection: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Начать контроль',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('inspection_start'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10],
      },

      inspection_start: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Контроль материалов',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('control_material'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10],
      },

      control_material: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Контроль производства',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('control_product'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10],
      },

      control_product: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Проверка документов',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('control_docs'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10],
      },

      control_docs: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Несоответствия отсутствуют',
            isActionBtn: true,
            validations: [this.checkByFile(14)],
            exec: (stores: IStores) => stores.activeControl.approve('delivery_allowed'),
          },
          {
            text: 'Отгрузка с несоответствиями',
            needComment: true,
            commentTitle: 'Укажите несоответствия',
            commentPlaceholder: 'Причина несоответствия',
            validations: [],
            exec: (stores: IStores) => stores.activeControl.reject('delivery_spoiled'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10, 14],
      },

      delivery_allowed: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Контроль погрузки',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('control_shipment'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10],
      },

      delivery_spoiled: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Контроль погрузки',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('control_shipment'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10],
      },

      control_shipment: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [
          {
            text: 'Завершить ИК',
            isActionBtn: true,
            validations: [],
            exec: (stores: IStores) => stores.activeControl.approve('control_finish'),
          },
        ],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9, 10, 13],
      },

      control_finish: {
        role: 'OUTSIDE_INSPECTOR',
        actions: [],
        visibleComponents: ['inspector', 'dates', 'production', 'files', 'staff'],
        editableComponents: ['files'],
        allowedDocumentTypes: [15, 7, 9],
      },
    };

    return config;
  }
}
