import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../entities';
import TRoles = Entities.TRoles;
import { observable } from 'mobx';

const roles: TRoles[] = [
  'BUYER_QUALITY_MANAGER',
  'CUSTOMER_MANAGER',
  // 'OUTSIDE_INSPECTOR',
  // 'BUYER_OPERATOR',
];

@inject('user')
@observer
class NextRole extends React.Component<IStores> {
  @observable private idx = 0;

  public render() {
    // return null;

    return (
      <>
        Роль: {this.props.user.role}
        <div style={{ cursor: 'pointer', color: 'red' }} onClick={this.nextRole}>
          NEXT ROLE
        </div>
      </>
    );
  }

  private nextRole = () => {
    if (this.idx >= roles.length) {
      this.idx = 0;
    }

    this.props.user.userInfo.role = roles[this.idx++];
  };
}

const Zero: React.FunctionComponent<any> = () => <></>;

export default (process.env.NODE_ENV === 'production' ? Zero : NextRole);
