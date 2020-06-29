import * as React from 'react';
import { datesToString } from 'utils';
import { Box, Text } from 'grommet';
import { CatalogItem } from 'components/ui/CatalogItem';
import { Quantity } from 'components/ui/Quantity';
import { Entities } from '../../../../../../../entities';
import TMTR = Entities.TMTR;

export const positionInfo = (Component: React.FunctionComponent) => ({
  mtr,
  index,
  ...props
}: {
  index: number;
  mtr: TMTR;
}) => {
  const list = [
    {
      title: 'Код МТР',
      value: mtr.code,
    },
    {
      title: 'Номенклатура',
      value: mtr.name,
    },
    {
      title: 'Объем поставки',
      value: <Quantity control={mtr} />,
    },
    {
      title: 'К дате',
      value: datesToString(mtr.date),
    },
    {
      title: 'Грузополучатель',
      value: (
        <CatalogItem namespace={'organizations'} id={mtr.receiver as number} property={'name'} />
      ),
    },
    {
      title: 'Адрес поставки',
      value: mtr.mtrDeliveryAddress,
    },
    {
      title: 'Инсп. контроль',
      value: mtr.inspectionNeeded ? 'Да' : 'Нет',
    },
  ];

  const myprops = { ...props, list };

  return (
    <Box>
      <Text margin={{ bottom: 'small' }}>Позиция {index + 1}</Text>
      <Component {...myprops as any} />
    </Box>
  );
};
