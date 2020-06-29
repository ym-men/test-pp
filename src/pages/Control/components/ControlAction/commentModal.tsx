import * as React from 'react';
import { Button, If, Text } from 'components/ui';
import { Box, Layer, TextArea } from 'grommet';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
export class CommentModal extends React.Component<IProps> {
  @observable private text: string = '';

  public render() {
    const { isShow, title, text, placeholder } = this.props;

    return (
      <If condition={isShow}>
        <Layer modal={true} onEsc={this.onCloseHandler}>
          <Box pad={'large'}>
            <Text margin={{ bottom: 'small' }} type="title">
              {title || 'Укажите причину'}
            </Text>
            <If condition={!!text}>
              <Text margin={{ bottom: 'small' }}>{text || ''}</Text>
            </If>
            <TextArea
              resize={'vertical'}
              value={this.text}
              placeholder={placeholder || 'Причина отклонения'}
              onChange={this.setCommentsHandler}
            />
            <Box direction="row" pad={{ top: 'medium' }} justify={'center'}>
              <Button
                id="control-controlAction-button-send"
                action={true}
                small={true}
                disabled={!this.text}
                onClick={this.onApproveHandler}
              >
                Отправить
              </Button>
              <Button
                id="control-controlAction-button-cancel"
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

  private setCommentsHandler = (event: any) => (this.text = event.target.value);

  private onCloseHandler = () => {
    this.props.onClose();
    this.text = '';
  };

  private onApproveHandler = () => {
    this.props.onApprove(this.text);
    this.text = '';
  };
}

interface IProps {
  isShow: boolean;
  title?: string;
  text?: string;
  placeholder?: string;
  onClose: () => void;
  onApprove: (comment: string) => void;
}
