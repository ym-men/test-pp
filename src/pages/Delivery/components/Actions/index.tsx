import * as React from 'react';
import * as styles from './styles.styl';
import cn from 'classnames';
import { Box } from 'grommet';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { DashedBox, Text, Button, If, Pending } from 'components/ui';
import { IStores } from 'mobx-stores/stores';
import { actionBlocks, TActionBlock, TActionButton } from './ActionBlocks';
import { Entities } from '../../../../../entities';
import { DocumentIcon, CheckIcon } from 'components/ui';
import TRoles = Entities.TRoles;

const icons = {
  default: () => (
    <Box className={cn(styles.oval, styles.grey)}>
      <DocumentIcon color="Basic100" className={styles.icon} />
    </Box>
  ),
  accepted: () => (
    <Box className={cn(styles.oval, styles.green)}>
      <CheckIcon color="Basic100" className={styles.icon} />
    </Box>
  ),
  custody: () => (
    <Box className={cn(styles.oval, styles.red)}>
      <CheckIcon color="Basic100" className={styles.icon} />
    </Box>
  ),
};

@inject('activeDelivery', 'user')
@observer
export class ActionsBlock extends React.Component<IStores> {
  @computed
  private get actionBlock() {
    const { activeDelivery, user } = this.props;

    return actionBlocks.find((block: TActionBlock) =>
      block.condition(activeDelivery.data, user.role as TRoles)
    ) as TActionBlock;
  }

  public render() {
    const { actionBlock } = this;
    const { activeDelivery } = this.props;

    if (!actionBlock) {
      return null;
    }

    const ActionIcon = icons[activeDelivery.data.status] || icons.default;

    return (
      <DashedBox align="center" pad={{ vertical: 'medium' }} direction="column" width="100%">
        <ActionIcon />
        <Box margin={{ vertical: 'medium' }}>
          <Text type="title">{actionBlock.title}</Text>
        </Box>
        <If condition={actionBlock.description}>
          <Box direction="row" margin={{ bottom: 'medium' }}>
            <Text>{actionBlock.description}</Text>
          </Box>
        </If>
        <Pending pending={activeDelivery.pending}>
          <If condition={!!actionBlock.buttons}>
            <Box direction="row" margin={{ vertical: 'small' }}>
              {actionBlock.buttons &&
                actionBlock.buttons.map((button: TActionButton, idx) => {
                  return (
                    <Button
                      id={`delivery-actionsBlock-button-${button.id || idx}`}
                      key={idx}
                      label={button.text}
                      small={true}
                      action={button.isActionBtn}
                      margin={{ left: 'small' }}
                      onClick={() => button.exec({ activeDelivery })}
                    />
                  );
                })}
            </Box>
          </If>
        </Pending>
      </DashedBox>
    );
  }
}
