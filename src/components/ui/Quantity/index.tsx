import * as React from 'react';
import { Box, Text } from 'grommet';
import { TID } from 'interface';
import { observer, inject } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';

@inject('catalogs')
@observer
export class Quantity extends React.Component<IProps & IStores> {
  public render() {
    const { control, catalogs } = this.props;
    return (
      <Box direction={'row'} align={'center'}>
        <Text>
          {control.quantity} {catalogs.getQuantityNameByType(control.quantityType)}
        </Text>
      </Box>
    );
  }
}

interface IProps {
  control: { quantity: number; quantityType: TID };
}
