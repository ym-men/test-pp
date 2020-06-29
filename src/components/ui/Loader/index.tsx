import * as React from 'react';
import { Box } from 'grommet';
import { Text } from 'components/ui';
import { ReactNode } from 'react';

export const Item = ({ title, value, ...props }: IItem) => {
  return (
    <Box direction="row" pad={{ vertical: 'xxsmall' }} width="100%" {...props}>
      <Box width={'small'} margin={{ right: 'small' }}>
        <Text overflow="ellipsis" color={'Basic600'} size={'small'}>
          {title}
        </Text>
      </Box>
      <Box width="100%">
        <Text overflow="ellipsis" size={'small'}>
          {value || props.children}
        </Text>
      </Box>
    </Box>
  );
};

interface IItem {
  title: string | React.ReactNode;
  value: string | React.ReactNode;
  className?: string;
  children?: ReactNode;
}
