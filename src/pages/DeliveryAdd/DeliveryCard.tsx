import * as React from 'react';
import { Box, Text } from 'grommet';
import * as styles from './DeliveryForm.styl';
import { dateFormatToString } from 'utils';
import { CatalogItem } from 'components/ui/CatalogItem';
import { Entities } from '../../../entities';
import TDelivery = Entities.TDelivery;
import { Quantity } from 'components/ui/Quantity';

const LeftText = (props: any) => (
  <Box width={'small'} margin={{ right: 'small' }}>
    <Text size={'small'} color={'Basic600'} className={styles.contractCardLeftText} {...props}>
      {props.children}
    </Text>
  </Box>
);

const RightText = (props: any) => (
  <Box>
    <Text size={'small'} className={styles.contractCardRightText} {...props}>
      {props.children}
    </Text>
  </Box>
);

const Item = (props: { text: any; value: any }) => (
  <Box direction="row" pad={{ vertical: 'xxsmall' }}>
    <LeftText>{props.text}</LeftText>
    <RightText>{props.value}</RightText>
  </Box>
);

export const DeliveryCard: React.FunctionComponent<IProps> = ({ delivery }) => (
  <Box direction="column" margin={{ bottom: 'small' }}>
    <Item text="Номер поставки" value={delivery.number} />
    <Item text="Поставляемые МТР" value={delivery.mtrName} />
    <Item
      text="Вид транспорта"
      value={
        <CatalogItem
          size={'small'}
          namespace={'transportTypes'}
          property={'name'}
          id={delivery.transportType as number}
        />
      }
    />
    <Item text="Номер ТС" value={delivery.transportId} />
    <Item text="Объем поставки" value={<Quantity control={delivery} />} />
    <Item text="Дата погрузки" value={dateFormatToString(delivery.dateFrom)} />
    <Item text="Планируемая дата поставки" value={dateFormatToString(delivery.dateTo)} />
  </Box>
);

interface IProps {
  delivery: TDelivery;
}
