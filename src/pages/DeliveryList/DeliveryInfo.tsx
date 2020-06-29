import * as React from 'react';
import { Box, Text } from 'grommet';
import * as style from './styles.styl';
import { CatalogItem } from 'components/ui/CatalogItem';
import { If } from '../../components/ui/If';

const Item: React.FunctionComponent<{ text: any }> = props => (
  <Box className={style.item}>
    <Text className={style.title}>{props.text}</Text>
    <Text className={style.text}>{props.children}</Text>
  </Box>
);

export const DeliveryInfo: React.FunctionComponent<IProps> = props => (
  <Box className={style.mtrInfoContainer} {...props}>
    <Text className={style.headTitle}>Данные позиции</Text>
    <Item text="Код МТР">{props.mtrCode}</Item>
    <Item text="Поставщик">
      <CatalogItem namespace={'organizations'} id={props.supplier} property={'name'} />
    </Item>
    <Item text="Номер разнарядки">{props.number}</Item>
    <Item text="Поставок">{props.length}</Item>
    <If condition={props.inspectionNeeded}>
      <Box className={style.item}>
        <Text className={style.title}>Статус инспекционного контроля</Text>
        {props.hasPermissionToShip ? (
          <Text className={style.text}>Отгрузка разрешена</Text>
        ) : (
          <Text className={style.text} color="Red600">
            Отгрузка без разрешения
          </Text>
        )}
      </Box>
    </If>
  </Box>
);

interface IProps {
  mtrCode: string;
  supplier: string;
  number: string;
  length: number;
  hasPermissionToShip: boolean;
  inspectionNeeded: boolean;
}
