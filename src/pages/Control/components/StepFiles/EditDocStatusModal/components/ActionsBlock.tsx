import * as React from 'react';
import { Box } from 'grommet';
import { Button, If } from 'components/ui';
import { TControlAction } from 'mobx-stores/AccessStore';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';

interface IActionsBlockProps {
  actions: TControlAction[];
  showClose?: boolean;
}

@inject('docStatusManager')
@observer
export class ActionsBlock extends React.Component<IActionsBlockProps & IStores> {
  public render() {
    return (
      <Box direction="row" margin={{ top: 'medium' }} justify="between">
        <Box direction="row">
          {this.props.actions.map((action: TControlAction, idx) => {
            return (
              <Button
                id={`control-ActionsBlock-button-${idx}`}
                key={idx}
                label={action.text}
                small={true}
                action={action.isActionBtn}
                style={{ marginRight: 15 }}
                onClick={() => this.props.docStatusManager.execAction(action)}
              />
            );
          })}
        </Box>
        <Box>
          <If condition={this.props.showClose}>
            <Button
              id="control-actionsBlock-button-close"
              small={true}
              onClick={this.props.docStatusManager.closeModal}
            >
              Выйти
            </Button>
          </If>
        </Box>
      </Box>
    );
  }
}
