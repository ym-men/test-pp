import { Entities } from '../../../../../entities';
import TComplaintStatus = Entities.TComplaintStatus;
import { IStores } from 'mobx-stores/stores';

type StatusRoleInfo = {
  description: string | ((stores: IStores) => string);
};

export const COMPLAINT_TEXTS: Record<TComplaintStatus, Record<string, StatusRoleInfo>> = {
  representative: {
    CUSTOMER_MANAGER: {
      description:
        'Направьте представителя, запросите документы или предложите устранить недостатки без формирования акта о выявленных недостатках.',
    },
    DEFAULT: {
      description: 'Ожидается направление представителя поставщика.',
    },
  },
  docs_update: {
    BUYER_QUALITY_MANAGER: {
      description: 'Дополнительные документы запрошены поставщиком.',
    },
    DEFAULT: {
      description: 'Ожидается внесение дополнительных документов менеджером службы качества.',
    },
  },
  no_act_fix: {
    BUYER_QUALITY_MANAGER: {
      description:
        'Согласуйте устранение недостатков без формирования акта о выявленных недостатках.',
    },
    DEFAULT: {
      description: 'Ожидается согласование устранения недостатков без формирования акта.',
    },
  },
  act: {
    BUYER_QUALITY_MANAGER: {
      description:
        'Выберите способ формирования акта или отметьте устранение недостатков представителем поставщика.',
    },
    DEFAULT: {
      description: 'Ожидается внесение акта о выявленных недостатках менеджером службы качества.',
    },
  },
  act_approving: {
    BUYER_QUALITY_MANAGER: {
      description: 'Ожидается информация от поставщика.',
    },
    DEFAULT: {
      description: 'Ожидается информация от поставщика.',
    },
  },
  fix_method: {
    CUSTOMER_MANAGER: {
      description: 'Предложите способ устранения недостатков.',
    },
    DEFAULT: {
      description: 'Ожидается внесение поставщиком предложения о способе устранения недостатков.',
    },
  },
  fix_method_approving: {
    BUYER_QUALITY_MANAGER: {
      description: 'Согласуйте или отклоните предложенный способ устранения недостатков.',
    },
    DEFAULT: {
      description:
        'Ожидается согласование способа устранения недостатков менеджером службы качества.',
    },
  },
  tech_docs_update: {
    CUSTOMER_MANAGER: {
      description: 'Внесите обновленную товарно-сопроводительную документацию.',
    },
    DEFAULT: {
      description:
        'Ожидается внесение обновленной товарно-сопроводительной документации поставщиком.',
    },
  },
  tech_docs_approving: {
    BUYER_QUALITY_MANAGER: {
      description:
        'Согласуйте обновленную товарно-сопроводительную документацию или укажите причину отказа.',
    },
    DEFAULT: {
      description:
        'Ожидается согласование обновленной товарно-сопроводительной документации менеджером службы качества.',
    },
  },
  delivery_add: {
    CUSTOMER_MANAGER: {
      description: 'Внесите информацию о поставке в счет замены МТР.',
    },
    DEFAULT: {
      description: 'Ожидается внесение информации о дополнительной поставке поставщиком.',
    },
  },
  delivery: {
    BUYER_QUALITY_MANAGER: {
      description: 'Подтвердите успешную замену МТР или укажите причины отказа.',
    },
    DEFAULT: {
      description: 'Ожидается завершение поставки МТР в счет замены.',
    },
  },
  fix: {
    CUSTOMER_MANAGER: {
      description: (stores: IStores) => {
        switch (stores.activeComplaint.data.fixingMethod) {
          case '1':
            return 'Приложите обновленные ТСД';
          case '2':
            return 'Сообщите об устранении недостатков';
          case '3':
            return 'Создайте допоставку';
          default:
            return 'Приложите обновленные ТСД';
        }
      },
    },
    DEFAULT: {
      description: 'Ожидается устранение недостатков поставщиком.',
    },
  },
  fix_approving: {
    BUYER_QUALITY_MANAGER: {
      description: 'Подтвердите устранение недостатков поставщиком.',
    },
    DEFAULT: {
      description: 'Ожидается подтверждение устранения недостатков.',
    },
  },
  complaint_closed: {
    DEFAULT: {
      description: 'Рекламационная работа с поставщиком завершена.',
    },
  },
  claim_work: {
    BUYER_QUALITY_MANAGER: {
      description:
        'Осуществлен переход к претензионной работе.\n' +
        '\n' +
        'Внесите сведения об устранении недостатков поставщиком.',
    },
    DEFAULT: {
      description: 'Ведется претензионная работа. Недостатки не устранены поставщиком.',
    },
  },
  claim_work_fixed: {
    DEFAULT: {
      description: 'Осуществлен переход  к претензионной работе. Недостатки устранены поставщиком.',
    },
  },
};
