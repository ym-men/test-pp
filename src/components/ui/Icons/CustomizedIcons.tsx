import * as React from 'react';
import * as Icons from './index';
import * as styles from './styles.styl';
import cn from 'classnames';

const customizeHOC = (Component: React.ElementType) => (props: any) => {
  const { hover, ...params } = props;
  const className = cn(props.className, hover ? styles.hoverIcon : '');

  return <Component {...params} className={className} />;
};

export const UserIcon = customizeHOC(Icons.UserIcon);
export const CalendarIcon = customizeHOC(Icons.CalendarIcon);
export const DownIcon = customizeHOC(Icons.DownIcon);
export const UpIcon = customizeHOC(Icons.UpIcon);
export const TimeIcon = customizeHOC(Icons.TimeIcon);
export const RightIcon = customizeHOC(Icons.RightIcon);
export const LeftIcon = customizeHOC(Icons.LeftIcon);
export const RightLarge = customizeHOC(Icons.RightLarge);
export const DownloadIcon = customizeHOC(Icons.DownloadIcon);
export const CloseIcon = customizeHOC(Icons.CloseIcon);
export const CheckIcon = customizeHOC(Icons.CheckIcon);
export const DocumentIcon = customizeHOC(Icons.DocumentIcon);
export const ClockIcon = customizeHOC(Icons.ClockIcon);
export const NoDataIcon = customizeHOC(Icons.NoDataIcon);
export const OrderRightIcon = customizeHOC(Icons.OrderRightIcon);
export const AlertIcon = customizeHOC(Icons.AlertIcon);
