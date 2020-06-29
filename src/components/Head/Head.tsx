import * as React from 'react';
import { Box } from 'grommet';
import { User } from './components/User';
import { Logo } from './components/Logo';
import { Link } from 'react-router-dom';
import NextRole from './components/NextRole';
import { IStores } from 'mobx-stores/stores';
import { observer, inject } from 'mobx-react';

@inject('user')
@observer
export class Head extends React.Component<IStores> {
  public render(): React.ReactNode {
    return (
      <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        elevation="none"
        style={{ zIndex: 1 }}
        flex={{ shrink: 0 }}
      >
        <Link to="/">
          <Logo />
        </Link>
        <NextRole />
        <User user={this.props.user.userInfo} onLogout={this.props.user.logout} />
      </Box>
    );
  }
}
