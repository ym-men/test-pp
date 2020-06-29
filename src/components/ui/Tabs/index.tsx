import * as React from 'react';
import * as styles from './Tabs.styl';
import * as cn from 'classnames';
import { Box } from 'grommet';

export const Tabs: React.FunctionComponent<IProps> = ({
  onChange,
  selected,
  tabs,
  small,
  children,
  ...rest
}) => {
  return (
    <Box direction="row" {...rest}>
      {tabs.map(item => (
        <Tab key={item.id} onChange={onChange} selected={selected} small={small} {...item} />
      ))}
      {children}
    </Box>
  );
};

const Tab: React.FunctionComponent<ITabProps> = ({
  selected,
  id,
  text,
  onChange,
  className,
  titleText,
  small,
  ...rest
}) => {
  const tabsClassName = cn(
    styles.tab,
    className,
    { [styles.active]: selected === id },
    { [styles.small]: small === true }
  );
  return (
    <div className={tabsClassName} onClick={() => onChange && onChange(id)} {...rest}>
      {text}
    </div>
  );
};

export namespace Tabs {
  export type TTabsProps = IProps;
  export type TTabProps = ITabOptions;
}

interface ITabProps extends ITabOptions, React.ComponentProps<any> {
  selected?: string;
  onChange?: (id: string) => void;
  small?: boolean;
}

export interface ITabOptions {
  id: string;
  text: string | React.ReactNode;
  titleText?: string;
  className?: string;
  disabled?: boolean;
}

interface IProps {
  selected?: string;
  onChange?: (id: string) => void;
  className?: string;
  tabs: Array<ITabOptions>;
  small?: boolean;
}
