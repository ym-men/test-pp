import * as React from 'react';
import { Box } from 'grommet';
import { Description } from '../Description';
import { ActionsBlock } from '../Actions';

export class Main extends React.PureComponent {
  public render() {
    return (
      <Box align="start" direction="column" fill={'horizontal'} pad={{ top: 'medium' }}>
        <ActionsBlock />
        <Description />
      </Box>
    );
  }
}
