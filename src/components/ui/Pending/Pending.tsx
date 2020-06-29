import * as React from 'react';
import { BlockChainLoader } from 'components/ui';
import { BoxProps } from 'grommet';

export class Pending extends React.PureComponent<IProps & BoxProps> {
  public render(): React.ReactNode {
    const { pending, children, ...props } = this.props;
    if (!pending) {
      return children || null;
    }
    return <BlockChainLoader {...props} />;
  }
}

interface IProps {
  pending: boolean;
  size?: 'small';
  reverseColor?: boolean;
}
