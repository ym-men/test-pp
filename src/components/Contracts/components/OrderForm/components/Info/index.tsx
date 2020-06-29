import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { Item } from 'components/ui';

export const Info: React.FunctionComponent<any> = ({ list, ...props }: IProps) => {
  return (
    <Box margin={{ vertical: 'medium' }} {...props}>
      {list.map((item, index) => (
        <Item title={item.title} value={item.value} />
      ))}
    </Box>
  );
};

interface IProps extends BoxProps {
  list: Array<IItem>;
}

interface IItem {
  title: string | React.ReactNode;
  value: string | React.ReactNode;
  className?: string;
}
