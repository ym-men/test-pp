import * as React from 'react';
import * as styles from './Text.styl';
import { Text as GText, TextProps } from 'grommet';
import * as cn from 'classnames';

type TTextProps = IProps & TextProps & JSX.IntrinsicElements['button'];

export const Text: React.FunctionComponent<TTextProps> = ({ type, overflow, ...props }) => {
  return (
    <GText
      {...props}
      className={cn(
        props.className,
        type ? styles[type] : '',
        overflow ? styles[overflow] : styles.normal
      )}
    />
  );
};

interface IProps {
  type?: 'header' | 'title' | 'label';
  overflow?: 'ellipsis' | 'normal';
}
