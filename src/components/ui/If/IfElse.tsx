import { PureComponent, ReactNode } from 'react';

export class IfElse extends PureComponent<IProps> {
  public render(): ReactNode {
    if (!this.props.condition) {
      return this.props.children;
    }
    return null;
  }
}

interface IProps {
  condition: any;
}
