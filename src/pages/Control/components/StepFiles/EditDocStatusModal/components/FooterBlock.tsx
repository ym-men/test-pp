import * as React from 'react';
import { Box } from 'grommet';
import { Button, If } from 'components/ui';

interface IFooterProps {
  buttons: {
    approve: 'visible' | 'disabled' | boolean;
    reject: boolean;
    cancel: boolean;
  };
  approveText?: string;
  onApprove: () => void;
  onReject?: () => void;
  onCancel: () => void;
  disabled: boolean;
}

export const FooterBlock: React.FunctionComponent<IFooterProps> = props => (
  <Box direction="row" margin={{ top: 'medium' }} justify="between">
    <Box direction="row">
      <If condition={!props.buttons || !!props.buttons.approve}>
        <Button
          id="control-footerBlock-button-actionOrApprove"
          small={true}
          action={true}
          disabled={props.buttons.approve === 'disabled'}
          onClick={props.onApprove}
        >
          {props.approveText || 'Согласовать'}
        </Button>
      </If>
      <If condition={!props.buttons || props.buttons.reject}>
        <Button
          id="control-footerBlock-button-reject"
          small={true}
          style={{ marginLeft: '15px' }}
          disabled={props.disabled}
          onClick={props.onReject}
        >
          Отклонить
        </Button>
      </If>
    </Box>
    <Box>
      <If condition={!props.buttons || props.buttons.cancel}>
        <Button
          id="control-footerBlock-button-close"
          small={true}
          onClick={props.onCancel}
          disabled={props.disabled}
        >
          Закрыть
        </Button>
      </If>
    </Box>
  </Box>
);
