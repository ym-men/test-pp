import * as React from 'react';
import { FlexiTable } from 'components/ui';
import { Entities } from '../../../../entities';
import TDelivery = Entities.TDelivery;

export class DeliverTable extends React.PureComponent<IProps> {
  public render() {
    const getRowColor = (delivery: TDelivery) => {
      if (delivery.status === 'custody') {
        return 'red';
      }
      if (delivery.status === 'accepted') {
        return 'green';
      }
      return 'black';
    };
    return (
      <FlexiTable
        columns={this.props.columns}
        rowProps={rowData => ({
          onClick: () => this.props.onClick && this.props.onClick(rowData),
          style: { color: getRowColor(rowData) },
        })}
        data={this.props.list}
        defaultSortBy={'dateTo'}
        idKey={'id'}
      />
    );
  }
}

interface IProps {
  list: Array<TDelivery<Date>>;
  columns: Array<FlexiTable.IFlexiTableColumn<TDelivery<Date>>>;
  onClick?: (rowData: TDelivery) => void;
}
