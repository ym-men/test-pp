import * as React from 'react';
import { Box, Text } from 'grommet';
// import * as styles from './InfoStatusBar.styl';
import { If } from '../If';

export const InfoStatusBar: React.FunctionComponent<IProps> = ({
  icon,
  color,
  title,
  text,
  label,
  labelColor,
  textColor,
  children,
}) => (
  <Box
    fill="horizontal"
    border={{ color, style: 'dashed', side: 'all' }}
    pad={'medium'}
    round={'2px'}
  >
    <Box fill="horizontal" align="center">
      <Box justify="center" align="center">
        {icon}
      </Box>
    </Box>

    <Box margin={{ vertical: 'medium' }} align="center">
      <If condition={label}>
        <Text size="small" color={labelColor || 'Basic600'}>
          {label}
        </Text>
      </If>
      <If condition={title}>
        <Text size="30px" color={color} margin={{ bottom: 'xsmall' }}>
          {title}
        </Text>
      </If>
      <If condition={text}>
        <Text color={textColor || 'Basic1000'} margin={{ vertical: 'xsmall' }}>
          {text}
        </Text>
      </If>
    </Box>
    {children}
  </Box>
);

interface IProps {
  color: string;
  icon: React.ReactNode;
  title?: string;
  text?: string;
  textColor?: string;
  label?: string;
  labelColor?: string;
}
