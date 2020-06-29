import * as React from 'react';
import { Box } from 'grommet';
import { Location } from '../Locations';
import { ActionsBlock } from '../Actions';

export class Main extends React.PureComponent {
  public render() {
    return (
      <Box align="start" direction="column" fill={'horizontal'} pad={{ top: 'medium' }}>
        <ActionsBlock />
        <Location />
      </Box>
    );
  }
}
