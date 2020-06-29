import * as React from 'react';
import { FormConstructor, Switch, Case, If } from 'components/ui';
import { PositionFormConfig } from './FormConfig';
import { Box, Button, Text } from 'grommet';
import { Up, Down, Close } from 'grommet-icons';
import { Entities } from '../../../../../../../entities';
import TMTR = Entities.TMTR;
import { equals } from 'ramda';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';

@inject('catalogs')
@observer
export class PositionForm extends React.Component<IProps, IState> {
  public readonly state = Object.create(null);

  public componentWillUpdate(
    nextProps: Readonly<IProps>,
    nextState: Readonly<IState>,
    nextContext: any
  ): void {
    if (!equals(this.state.data, nextState.data)) {
      this.props.onChangeData({ ...nextProps.data, ...nextState.data });
    }
  }

  // public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>): boolean {
  //   return !(
  //     equals(this.state.data, nextState.data) &&
  //     equals(this.props.data, nextProps.data) &&
  //     equals(this.props.errors, nextProps.errors) &&
  //     nextState.isClosed === this.state.isClosed
  //   );
  // }

  public render(): React.ReactNode {
    const title = `Позиция ${this.props.position}`;
    const data = { ...this.props.data };
    const isCollapsed = this.state.isClosed;
    const IconDelete = this.props.canDelete ? <Close size="medium" color={'black'} /> : null;
    const CollapseIcon = !isCollapsed ? (
      <Up size="medium" color={'black'} />
    ) : (
      <Down size="medium" color={'black'} />
    );

    return (
      <Box margin={{ top: 'medium' }}>
        <Box
          background={'formBackground'}
          direction="column"
          pad={{ vertical: 'small', horizontal: 'medium' }}
          round={'xsmall'}
        >
          <Box direction="row" align={'center'}>
            <Box margin={{ right: 'small' }}>
              <Button id="order-positionForm-button-toggle" onClick={this.toggleState}>
                {CollapseIcon}
              </Button>
            </Box>
            <Switch condition={true}>
              <Case value={isCollapsed}>
                <Box width={'100%'}>
                  <Text>
                    Позиция {this.props.position} {data.name}, {data.quantity || ''}
                  </Text>
                </Box>
              </Case>
              <Case value={!isCollapsed}>
                <Box width={'100%'}>
                  <Text size="xlarge">{title}</Text>
                </Box>
              </Case>
            </Switch>
            <If condition={IconDelete}>
              <Box>
                <Button id="order-positionForm-button-delete" onClick={this.props.onDelete}>
                  {IconDelete}
                </Button>
              </Box>
            </If>
          </Box>
          <If condition={!this.state.isClosed}>
            <FormConstructor
              props={{ margin: { top: 'medium' } }}
              onChangeData={this.changeHandler}
              errors={this.props.errors}
              formOptions={PositionFormConfig(this.props.catalogs.data)}
              data={data}
            />
          </If>
        </Box>
      </Box>
    );
  }

  protected toggleState = () => {
    this.setState({ isClosed: !this.state.isClosed });
  };

  protected changeHandler = (data: any, oldData: any, field: string) => {
    this.setState(state => ({ ...state, data: { ...state.data, [field]: data } }));
  };
}

interface IProps extends IStores {
  data: TMTR;
  position: number;
  onChangeData: (data: TMTR) => void;
  canDelete: boolean;
  onDelete: () => void;
  errors: { [T in keyof Entities.TOrder]?: string | Array<string> };
}

interface IState {
  isClosed?: boolean;
  data: Partial<TMTR>;
}
