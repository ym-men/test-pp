import * as React from 'react';
import { Layer, Box, Text } from 'grommet';

export const Loader: React.FunctionComponent = () => (
  <Layer position="center">
    <Box pad="small" gap="small">
      <Text>Загрузка...</Text>
    </Box>
  </Layer>
);
