import * as React from 'react';
import * as styles from './BreadCrumbs.styl';
import * as cn from 'classnames';
import { Text, Box, BoxProps } from 'grommet';
import { inject, observer } from 'mobx-react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { IStores } from 'mobx-stores/stores';
import { If } from '../If';

@inject('breadCrumbs')
@observer
class BreadCrumbsComponent extends React.Component<
  IProps & IStores & RouteComponentProps<IParams>
> {
  public componentWillMount() {
    this.props.breadCrumbs.setParams(this.props.match.params);
  }

  public render() {
    const links = this.props.path || this.props.breadCrumbs.links;
    const { className, breadCrumbs, ...props } = this.props;
    return (
      <Box className={cn(styles.breadCrumbs, className)} direction="row" {...props}>
        {links.map((item: IBreadCrumb, index) => {
          return (
            <Box id={`breadCrumbs_${index}`} key={`${item.link}-${index}`} direction="row">
              <Link to={item.link} className={styles.link}>
                <Text className={cn(styles.link)}>{item.text}</Text>
              </Link>
              <If condition={index !== links.length - 1}>
                <Text className={cn(styles.separator)}>/</Text>
              </If>
            </Box>
          );
        })}
      </Box>
    );
  }
}

export const BreadCrumbs = withRouter(BreadCrumbsComponent);

interface IProps extends BoxProps {
  path?: Array<IBreadCrumb>;
  className?: string;
}

export interface IBreadCrumb {
  text: string | React.ReactNode;
  link: string;
}

export interface IParams {
  controlId?: string;
  contractId?: string;
  orderId?: string;
  mtrId?: string;
  deliveryId?: string;
  complaintId?: string;
}
