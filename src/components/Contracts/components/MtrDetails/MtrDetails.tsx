import * as React from 'react';
import { Box, Heading } from 'grommet';
import { RouteComponentProps } from 'react-router';
import { Button } from 'components/ui';
import { hasRole } from '../../../../hocs';

const CreateNewDelivery = hasRole(['CUSTOMER_MANAGER'], Button);

export class MtrDetails extends React.Component<RouteComponentProps<{ mtrId: string }>> {
  public render(): React.ReactNode {
    return (
      <Box>
        <Box direction="row" justify="between" align="center">
          <Box>
            <Heading>Поставки</Heading>
          </Box>
          <Box>
            <CreateNewDelivery
              id="constract-mtrDetails-button-add"
              small={true}
              btnType="link"
              to={`${this.props.match.params.mtrId}/delivery/new`}
            >
              Добавить поставку
            </CreateNewDelivery>
          </Box>
        </Box>
      </Box>
    );
  }
}
