import * as React from 'react';
import { columns } from './columns';
import { FlexiTable, Loader } from 'components/ui';
import { Box } from 'grommet';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../entities';
import TControl = Entities.TControl;

@inject('access', 'user', 'controls', 'routing')
@observer
export class ControlTable extends React.Component<IProps & IStores> {
  public componentDidMount() {
    this.props.controls.getList();
    this.props.controls.startPolling();
  }

  public componentWillUnmount() {
    this.props.controls.stopPolling();
  }

  public render() {
    const { access, user } = this.props;

    if (this.props.controls.status === 'first_fetching') {
      return <Loader />;
    }

    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="column">
        <FlexiTable
          columns={columns}
          rowProps={rowData => ({
            actionAllowed:
              (rowData &&
                rowData.status !== 'control_finish' &&
                access.config[rowData.status] &&
                access.config[rowData.status].role) === user.role,
            onClick: () => this.onClick(rowData),
          })}
          data={this.props.controls.list}
          defaultSortBy={'dateEnd'}
          idKey={'id'}
        />
      </Box>
    );
  }

  private onClick = (control: TControl): void => {
    return this.props.onClick
      ? this.props.onClick(control)
      : this.props.routing.push(`/controls/${control.id}`);
  };
}

interface IProps {
  onClick?: (control: TControl) => void;
}
