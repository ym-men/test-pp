import * as React from 'react';
import { Box, Text } from 'grommet';
import { BreadCrumbs, If, Tabs, Button } from 'components/ui';
import { ContractInfo } from '../ContractInfo';
import * as styles from './ContentHead.styl';
import { CatalogItem } from 'components/ui/CatalogItem';
import { hasRole, isContractStatus } from 'hocs';
import { pipe, defaultTo, length } from 'ramda';
import { TCb } from '../../../../../../interface';
import { Entities } from '../../../../../../../entities';

const len: TCb<Array<any> | null, number> = pipe(
  defaultTo([]),
  length
);

const TABS = [
  {
    id: 'orders',
    text: 'Обзор',
    className: styles.tab,
  },
  {
    id: 'files',
    text: (contract: Entities.TContract) => <Text>Файлы ({len(contract.documents)})</Text>,
    className: styles.tab,
  },
  {
    id: 'comments',
    text: (contract: Entities.TContract) => <Text>Комментарии ({len(contract.comments)})</Text>,
    className: styles.tab,
  },
];

const BuyerButton = hasRole(['BUYER_CURATOR'], isContractStatus('approved', Button));

export const ContentHead: React.FunctionComponent<IProps> = ({ contract, mode, setMode }) => {
  const tabs = TABS.map(item => ({
    ...item,
    text: typeof item.text === 'string' ? item.text : item.text(contract),
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
              Договор № {contract.number}
              <If condition={contract.supplier}>
                <Text className={styles.contractHeadText}> с </Text>
                <CatalogItem
                  className={styles.contractHeadText}
                  property={'name'}
                  key="organizations"
                  namespace="organizations"
                  id={contract.supplier as number}
                />
              </If>
            </Text>

            <Box direction="row" fill="horizontal" justify="between" margin={{ top: 'small' }}>
              <Tabs selected={mode} onChange={setMode} tabs={tabs} className={styles.tabs} />

              <If condition={contract.orders && contract.orders.length}>
                <BuyerButton
                  id="contract-contentHead-button-add"
                  btnType={'link'}
                  to={`/contracts/${contract.id}/orders/new`}
                >
                  Добавить разнарядку
                </BuyerButton>
              </If>
            </Box>
          </Box>
        </Box>
        <Box>
          <ContractInfo contract={contract} />
        </Box>
      </Box>
    </Box>
  );
};

interface IProps {
  contract: Entities.TContract;
  mode: 'orders' | 'history' | 'files';
  setMode: (mode: 'orders' | 'history' | 'files') => void;
}
