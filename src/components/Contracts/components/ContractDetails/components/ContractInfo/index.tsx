import * as React from 'react';
import { Box, Text } from 'grommet';
import { dateFormatToString } from 'utils';
import * as style from './ContractInfo.styl';
import { CatalogItem } from '../../../../../ui/CatalogItem';
import { ContractStatus } from '../../../../../ui/Statuses';
import { Entities } from '../../../../../../../entities';

const getText = (t: any) => (t ? t : 'Не заполнено');

const Item: React.FunctionComponent<{ text: any }> = props => (
  <Box className={style.item}>
    <Text className={style.title}>{props.text}</Text>
    <Text className={style.text}>{props.children}</Text>
  </Box>
);

export const ContractInfo: React.FunctionComponent<IProps> = ({ contract, ...props }) => (
  <Box className={style.container} {...props}>
    <Text className={style.headTitle}>Данные договора</Text>
    <Item text="Статус">
      <ContractStatus contract={contract as any} />
    </Item>
    <Item text="Предмет договора">{getText(contract.subject)}</Item>
    <Item text="Номер">{getText(contract.number)}</Item>
    <Item text="Покупатель">
      <CatalogItem
        namespace={'organizations'}
        id={contract.buyer as number}
        property={'name'}
      />
    </Item>
    <Item text="Поставщик">
      <CatalogItem
        namespace={'organizations'}
        id={contract.supplier as number}
        property={'name'}
      />
    </Item>
    <Item text="Тип договора">
      <CatalogItem namespace={'contractTypes'} id={contract.type as number} />
    </Item>
    <Item text="Дата составления">{dateFormatToString(new Date(contract.date as Date))}</Item>
    <Item text="Дата подписания">{dateFormatToString(new Date(contract.dateFrom as Date))}</Item>
    <Item text="Дата завершения">{dateFormatToString(new Date(contract.dateTo as Date))}</Item>
  </Box>
);

interface IProps {
  contract: Entities.TContract;
}
