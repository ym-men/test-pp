import * as React from 'react';
import * as styles from './ContentHead.styl';
import { Box, Text } from 'grommet';
import { BreadCrumbs, Tabs } from 'components/ui';
import { pipe, defaultTo, length } from 'ramda';
import { TCb } from 'interface';
import { inject, observer } from 'mobx-react';
import { Entities } from '../../../../../entities';
import { IStores } from 'mobx-stores/stores';
import { DeliveryInfo } from '../index';
import * as _ from 'lodash';

const len: TCb<Array<any> | null, number> = pipe(
  defaultTo([]),
  length
);

const TABS = [
  {
    id: 'main',
    text: 'Обзор',
    className: styles.tab,
  },
  {
    id: 'files',
    text: (delivery: Entities.TDelivery) => <Text>Файлы ({len(delivery.documents)})</Text>,
    className: styles.tab,
  },
  {
    id: 'comments',
    text: (delivery: Entities.TDelivery) => <Text>Комментарии ({len(delivery.comments)})</Text>,
    className: styles.tab,
  },
];

@inject('activeDelivery')
@observer
export class Head extends React.Component<IProps & IStores> {
  public render() {
    const { mode, setMode, activeDelivery } = this.props;

    const tabs = TABS.map(item => ({
      ...item,
      text: typeof item.text === 'string' ? item.text : item.text(activeDelivery.data),
    }));

    return (
      <Box align="start" direction="column" fill={'horizontal'}>
        <BreadCrumbs />
        <Box
          align="start"
          direction="row"
          wrap={false}
          width={'100%'}
          pad={{ right: '285px' }}
          className={styles.contractWrapper}
        >
          <Box direction="row" width={'100%'}>
            <Box direction="column" width={'100%'}>
              <Text className={styles.contractHeadText}>
                Поставка:{' '}
                {`${_.get(activeDelivery, 'data.mtrCode', '')} - ${_.get(
                  activeDelivery,
                  'data.number',
                  ''
                )}`}
              </Text>
              <Box direction="row" fill="horizontal" justify="between" margin={{ top: 'small' }}>
                <Tabs selected={mode} onChange={setMode} tabs={tabs} className={styles.tabs} />
              </Box>
            </Box>
          </Box>
          <Box>
            <DeliveryInfo delivery={activeDelivery.data} />
          </Box>
        </Box>
      </Box>
    );
  }
}

interface IProps {
  mode: 'main' | 'history' | 'files';
  setMode: (mode: 'main' | 'history' | 'files') => void;
}
