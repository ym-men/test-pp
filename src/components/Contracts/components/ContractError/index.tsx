import * as React from 'react';
import { Box, Text } from 'grommet';

export const ContractError: React.FunctionComponent<{ id: string }> = ({ id }) => (
  <Box>
    <Text>Ошибка. Контракт Id: {id}, не загружен.</Text>
  </Box>
);
