import * as React from 'react';
import { Box } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { columns } from './columns';
import { Entities } from '../../../entities';
import { FlexiTable } from 'components/ui/FlexiTable';
import TComplaint = Entities.TComplaint;
import { Loader } from 'components/ui/Item';

@inject('complaints', 'routing')
@observer
export class ComplaintList extends React.Component<
  Pick<IStores, 'complaints'> & Pick<IStores, 'routing'> & { onClick?: (data: TComplaint) => void }
> {
  public componentWillMount(): void {
    this.props.complaints.getList();
    this.props.complaints.startPolling();
  }

  public componentWillUnmount() {
    this.props.complaints.stopPolling();
  }

  public render(): React.ReactNode {
    if (this.props.complaints.status === 'first_fetching') {
      return <Loader />;
    }

    return (
      <Box margin={{ top: 'large' }} width={'100%'} direction="column">
        <FlexiTable
          columns={columns}
          rowProps={rowData => ({
            onClick: () => this.onComplaintClick(rowData),
          })}
          data={this.props.complaints.list}
          // defaultSortBy={'dateTo'}
          idKey={'id'}
        />
      </Box>
    );
  }

  private onComplaintClick = (data: TComplaint): void => {
    return this.props.onClick
      ? this.props.onClick(data)
      : this.props.routing.push(`/deliveries/${data.deliveryId}/complaint`);
  };
}
