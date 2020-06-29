import * as React from 'react';
import * as styles from './styles.styl';
import * as cn from 'classnames';
import { Box, BoxProps } from 'grommet';

export const DashedBox: React.FunctionComponent<IProps> = props => (
  <Box
    align="center"
    direction="column"
    {...props}
    className={cn(styles.dashedBox, props.className)}
  >
    {props.children}
  </Box>
);

interface IProps extends BoxProps {
  className?: string;
}
