import * as React from 'react';
import * as cn from 'classnames';
import * as styles from './styles.styl';
import { Box, BoxProps } from 'grommet';

interface IProps {
  size?: 'small';
}

export const BlockChainLoader: React.FunctionComponent<IProps & BoxProps> = ({
  size,
  ...props
}) => {
  const mainStyles = [styles['sk-folding-cube']];
  if (size && size === 'small') {
    mainStyles.push(styles.small);
  } else {
    mainStyles.push(styles.normal);
  }

  return (
    <Box {...props}>
      <div className={cn(...mainStyles)}>
        <div className={cn(styles['sk-cube1'], styles['sk-cube'])} />
        <div className={cn(styles['sk-cube2'], styles['sk-cube'])} />
        <div className={cn(styles['sk-cube4'], styles['sk-cube'])} />
        <div className={cn(styles['sk-cube3'], styles['sk-cube'])} />
      </div>
    </Box>
  );
};
