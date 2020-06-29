import * as React from 'react';
import { Button, If } from 'components/ui';
import { Box, Layer, TextArea, Heading } from 'grommet';

export class ContractModal extends React.PureComponent<IProps> {
  public readonly state = { text: '' };

  public render() {
    const { isShow } = this.props;

    return (
      <If condition={isShow}>
        <Layer modal={true} onEsc={this.onCloseHandler}>
          <Box pad={'large'}>
            <Heading size="small">Отклонение договора</Heading>

            <TextArea
              resize={'vertical'}
              value={this.state.text}
              placeholder="причина отклонения договора"
              onChange={this.setCommentsHandler}
            />
            <Box direction="row" pad={{ top: 'medium' }} justify={'center'}>
              <Button
                id="contract-contractModal-button-send"
                action={true}
                small={true}
                disabled={!this.state.text}
                onClick={this.onApproveHandler}
              >
                Отправить
              </Button>
              <Button
                id="contract-contractModal-button-cancel"
                margin={{ left: 'small' }}
                small={true}
                onClick={this.onCloseHandler}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        </Layer>
      </If>
    );
  }

  private setCommentsHandler = (event: any) => this.setState({ text: event.target.value });

  private onCloseHandler = () => {
    this.setState({ text: '' });
    this.props.onClose();
  };

  private onApproveHandler = () => this.props.onApply(this.state.text);
}

interface IProps {
  isShow: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
}
