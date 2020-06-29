import * as React from 'react';
import { Box, Text } from 'grommet';

export const OrderError: React.FunctionComponent<{ id: string }> = ({ id }) => (
  <Box>
    <Text>Ошибка. Разнарядка id: {id}, не загружена.</Text>
  </Box>
);
