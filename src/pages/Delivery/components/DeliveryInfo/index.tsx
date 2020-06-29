import * as React from 'react';
import * as styles from './styles.styl';
import { Box } from 'grommet';
import { dateFormatToString } from 'utils';
import { CheckIcon, Text, CatalogItem, If } from 'components/ui';
import { Entities } from '../../../../../entities';
import { DeliveryStatus } from 'components/ui/Statuses';
import { Quantity } from 'components/ui/Quantity';
import TDelivery = Entities.TDelivery;

const FIELDS = [
  {
    title: 'Статус',
    value: (delivery: TDelivery) => (
      <DeliveryStatus delivery={delivery} className={styles.status} />
    ),
  },
  {
    title: 'Поставляемые МТР',
    value: (delivery: TDelivery) => delivery.mtrName,
  },
  {
    title: 'Количество МТР',
    value: (delivery: TDelivery) => <Quantity control={delivery} />,
  },
  {
    title: 'Тип транспорта',
    value: (delivery: TDelivery) => (
      <CatalogItem property={'name'} namespace={'transportTypes'} id={delivery.transportType} />
    ),
  },
  {
    title: 'Номер ТС',
    value: (delivery: TDelivery) => delivery.transportId,
  },
  {
    title: 'Дата погрузки',
    value: (delivery: TDelivery) => dateFormatToString(delivery.dateFrom),
  },
];

const Item: React.FunctionComponent<{ title: string; value: any; className?: string }> = ({
  title,
  value,
  className,
}) => (
  <Box direction="column" margin={{ vertical: 'xsmall' }} className={className}>
    <Box>
      <Text color="Basic600">{title}</Text>
    </Box>
    <Box margin={{ top: 'xxsmall' }}>
      <Text>{value}</Text>
    </Box>
  </Box>
);

const isDocumentAdded = (type: number, delivery: TDelivery) =>
  delivery.documents.some(doc => doc.type === type);

const DocumentItem: React.FunctionComponent<{ type: number; isAdded: boolean }> = ({
  type,
  isAdded,
}) => (
  <Box
    direction="row"
    justify="between"
    margin={{ vertical: 'xxsmall' }}
    className={!isAdded ? styles.grey : ''}
  >
    <CatalogItem namespace={['documentTypes', 'delivery']} id={type} />
    <If condition={isAdded}>
      <CheckIcon size="15px" />
    </If>
  </Box>
);

export const DeliveryInfo: React.FunctionComponent<IProps> = props => {
  return (
    <Box direction="column" className={styles.deliveryInfoContainer}>
      <Box margin={{ vertical: 'small' }}>
        <Text type="title">Данные поставки</Text>
      </Box>
      <Box>
        {FIELDS.map(item => (
          <Item key={item.title} {...item} value={item.value(props.delivery)} />
        ))}
      </Box>
      <Box margin={{ top: 'medium' }}>
        <Text color="Basic600">Акты</Text>
        <Box margin={{ top: 'xsmall' }}>
          <DocumentItem type={5} isAdded={isDocumentAdded(5, props.delivery)} />
          <DocumentItem type={4} isAdded={isDocumentAdded(4, props.delivery)} />
          <DocumentItem type={6} isAdded={isDocumentAdded(6, props.delivery)} />
        </Box>
      </Box>
    </Box>
  );
};

interface IProps {
  delivery: TDelivery;
}
