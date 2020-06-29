import * as React from 'react';
import * as styles from './ContentHead.styl';
import * as cn from 'classnames';
import { Box, Text } from 'grommet';
import { BreadCrumbs, Tabs } from 'components/ui';
import { pipe, defaultTo, length } from 'ramda';
import { TCb } from 'interface';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { ControlProgress } from '../Progress';
import { Entities } from '../../../../../entities';
import TContract = Entities.TContract;
import TOrder = Entities.TOrder;

const len: TCb<Array<any> | null, number> = pipe(
  defaultTo([]),
  length
);

const TABS = (props: IStores) => {
  return [
    {
      id: 'main',
      text: () => <Text>Обзор</Text>,
      className: styles.tab,
    },
    {
      id: 'comments',
      text: ({ comments }: any) => <Text>Комментарии ({len(comments)})</Text>,
      className: styles.tab,
    },
    {
      id: 'files',
      text: ({ documents }: any) => <Text>Документы ({len(documents)})</Text>,
      className: styles.tab,
    },
    {
      id: 'notifications',
      text: ({ notifications }: any) => <Text>Уведомления ({len(notifications)})</Text>,
      className: cn(styles.editTab, props.activeControl.isNotifiesEditable() ? styles.status : ''),
    },
    {
      id: 'reports',
      text: ({ reports }: any) => <Text>Отчёты ({len(reports)})</Text>,
      className: cn(styles.editTab, props.activeControl.isReportsEditable() ? styles.status : ''),
    },
  ];
};

@inject('activeControl', 'user')
@observer
export class ContentHead extends React.Component<IProps & IStores> {
  public render() {
    const { mode, setMode, activeControl } = this.props;
    const tabs = TABS(this.props).map(item => ({
      ...item,
      text:
        typeof item.text === 'string'
          ? item.text
          : item.text({
              documents: activeControl.documents,
              notifications: activeControl.notifications,
              comments: activeControl.comments,
              reports: activeControl.reports,
            }),
    }));

    return (
      <Box align="start" direction="column" fill={'horizontal'}>
        <BreadCrumbs />
        <Box
          align="start"
          direction="row"
          wrap={false}
          width={'100%'}
          className={styles.contractWrapper}
        >
          <Box direction="row" width={'100%'}>
            <Box direction="column" width={'100%'}>
              <Text className={styles.contractHeadText}>
                Контроль: №{activeControl.data.orderNumber}/{activeControl.data.mtrName}
              </Text>
              <Box margin={{ vertical: 'medium' }}>
                <ControlProgress status={activeControl.data.status} />
              </Box>
              <Box direction="row" fill="horizontal" justify="between" margin={{ top: 'small' }}>
                <Tabs
                  selected={mode}
                  onChange={setMode}
                  tabs={tabs}
                  className={styles.tabs}
                  small={true}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

interface IProps {
  mode: 'main' | 'history' | 'files' | 'notifications' | 'reports';
  setMode: (mode: 'main' | 'history' | 'files' | 'notifications' | 'reports') => void;
  contract?: TContract;
  order?: TOrder;
}
