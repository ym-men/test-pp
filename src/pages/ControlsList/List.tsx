import * as React from 'react';
import { Box, Heading } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { ControlTable } from './Table/ControlTable';
import { DeliveryList } from 'pages/DeliveryList/DeliveryList';
import { Tabs, If, Case, Switch, Loader } from 'components/ui';
import * as styles from './list.styl';
import { ComplaintList } from 'pages/ComplaintList';

const tabs = [
  {
    id: '/controls',
    text: 'Контроль',
    titleText: 'Инспекционный контроль',
    className: styles.tab,
  },
  {
    id: '/deliveries',
    text: 'Поставки (отгружено)',
    className: styles.tab,
  },
  {
    id: '/complaints',
    text: 'Рекламации',
    className: styles.tab,
  },
];

@inject('routing', 'user')
@observer
export class ControlsList extends React.Component<IStores & { match: any }> {
  public render(): React.ReactNode {
    if (this.props.user.status === 'fetching') {
      return <Loader />;
    }

    const mode = this.props.match.path;

    const currentTab = tabs.find(t => t.id === mode);

    return (
      <Box margin={{ top: 'large' }} direction="column">
        <Box direction="row" margin={{ top: 'medium' }} alignContent={'center'}>
          <Heading level="1" margin="none">
            {currentTab.titleText || currentTab.text}
          </Heading>
        </Box>

        <If condition={this.props.user.role === 'BUYER_QUALITY_MANAGER'}>
          <Box direction="row" fill="horizontal" justify="between" margin={{ top: 'medium' }}>
            <Tabs
              selected={mode}
              onChange={(newMode: ModeTypes) => this.props.routing.push(newMode)}
              tabs={tabs}
            />
          </Box>
        </If>

        <Switch condition={mode}>
          <Case value="/controls">
            <ControlTable />
          </Case>
          <Case value="/deliveries">
            <DeliveryList />
          </Case>
          <Case value="/complaints">
            <ComplaintList />
          </Case>
        </Switch>
      </Box>
    );
  }
}

type ModeTypes = '/controls' | '/deliveries' | '/complaints';
