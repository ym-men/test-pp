import * as React from 'react';
import * as styles from './ContentHead.styl';
import { Box } from 'grommet';
import { Text } from 'components/ui';
import { BreadCrumbs, If, Tabs } from 'components/ui';
import { OrderInfo } from '../OrderInfo';
import { CatalogItem } from 'components/ui/CatalogItem';
import { TCb } from '../../../../../../interface';
import { defaultTo, length, pipe } from 'ramda';
import { Entities } from '../../../../../../../entities';

const len: TCb<Array<any> | null, number> = pipe(
  defaultTo([]),
  length
);

const TABS = [
  {
    id: 'orders',
    text: 'Разнарядки',
    className: styles.tab,
  },
  {
    id: 'files',
    text: (order: Entities.TOrder) => <Text>Файлы ({len(order.documents)})</Text>,
    className: styles.tab,
  },
  {
    id: 'comments',
    text: (order: Entities.TOrder) => <Text>Комментарии ({len(order.comments)})</Text>,
    className: styles.tab,
  },
];

// const BuyerButton = hasRole(['BUYER_CURATOR'], isContractStatus('approved', Button));

export const ContentHead: React.FunctionComponent<IProps> = ({
  contract,
  mode,
  setMode,
  order,
}) => {
  const tabs = TABS.map(item => ({
    ...item,
    text: typeof item.text === 'string' ? item.text : item.text(order),
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
            <Text className={styles.orderHeadText} overflow="ellipsis">
              Разнарядка № {order.number}
            </Text>
            <Box direction="row">
              <If condition={contract.supplier}>
                <Text className={styles.orderHeadText} margin="10px 15px 0 0">
                  с
                </Text>
                <CatalogItem
                  className={styles.orderHeadText}
                  property={'name'}
                  key="organizations"
                  namespace="organizations"
                  id={contract.supplier as number}
                />
              </If>
            </Box>
            <Box direction="row" fill="horizontal" justify="between" margin={{ top: 'small' }}>
              <Tabs selected={mode} onChange={setMode} tabs={tabs} className={styles.tabs} />

              {/*<BuyerButton  btnType={'link'} to={`/contracts/${contract.id}/orders/new`}>*/}
              {/*Добавить разнарядку*/}
              {/*</BuyerButton>*/}
            </Box>
          </Box>
        </Box>
        <Box>
          <OrderInfo order={(order || {}) as any} />
        </Box>
      </Box>
    </Box>
  );
};

interface IProps {
  contract: Entities.TContract;
  order: Entities.TOrder;
  mode: 'orders' | 'history' | 'files';
  setMode: (mode: 'orders' | 'history' | 'files') => void;
}
