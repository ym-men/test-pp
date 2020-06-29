import * as React from 'react';
import { Box } from 'grommet';
import { Item } from 'components/ui';
import { dateFormatToString } from 'utils';
import { CatalogItem } from 'components/ui/CatalogItem';
import { Entities } from '../../../../../entities';
import TContract = Entities.TContract;

export const ContractCard: React.FunctionComponent<IProps> = ({ contract }) => (
  <Box direction="column" margin={{ bottom: 'small' }}>
    <Item
      title="Тип договора"
      value={<CatalogItem namespace={'contractTypes'} id={contract.type as number} />}
    />
    <Item title="Предмет" value={contract.subject} />
    <Item title="Номер" value={contract.number} />
    <Item title="Дата составления" value={dateFormatToString(contract.date)} />
    <Item title="Дата подписания" value={dateFormatToString(contract.dateFrom)} />
    <Item title="Дата завершения" value={dateFormatToString(contract.dateTo)} />
    <Item
      title="Покупатель"
      value={
        <CatalogItem namespace={'organizations'} property={'name'} id={contract.buyer as number} />
      }
    />
    <Item
      title="Поставщик"
      value={
        <CatalogItem
          namespace={'organizations'}
          property={'name'}
          id={contract.supplier as number}
        />
      }
    />
  </Box>
);

interface IProps {
  contract: Partial<TContract>;
}
