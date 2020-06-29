import * as React from 'react';
import { Button, If, Text } from 'components/ui';
import { Box, Layer } from 'grommet';
import { observer } from 'mobx-react';

@observer
export class ErrModal extends React.Component<IProps> {
  public render() {
    const { isShow } = this.props;

    return (
      <If condition={isShow}>
        <Layer modal={true} onEsc={this.props.onClose} style={{ width: 400 }}>
          <Box pad={'large'}>
            <Text margin={{ bottom: 'small' }} type="title">
              Невозможно выполнить действие
            </Text>
            <Box direction="row" pad={{ top: 'medium' }} justify={'between'}>
              {this.props.errText}
            </Box>
            <Box direction="row" pad={{ top: 'medium' }} justify={'between'}>
              <Button id="control-errModal-button-ok" small={true} onClick={this.props.onClose}>
                OK
              </Button>
            </Box>
          </Box>
        </Layer>
      </If>
    );
  }
}

interface IProps {
  isShow: boolean;
  errText: string;
  onClose: () => void;
}
