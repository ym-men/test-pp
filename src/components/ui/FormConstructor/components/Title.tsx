import * as React from 'react';
import { TextForm } from './Text';
import * as styles from './Title.styl';

export const Title: React.FunctionComponent<{ text: any }> = ({ text }) => {
  return (
    <TextForm config={{ props: { className: styles.title }, type: 'text' }} value={text || null} />
  );
};
