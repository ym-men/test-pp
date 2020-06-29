import * as React from 'react';
import { Box } from 'grommet';
import { ProductionSites } from '../ProductionSites';
import { Inspectors } from '../Inspectors';
import { ControlDates } from '../ControlDates';
import { ControlInspector } from '../ControlInspector';

export class ControlMain extends React.PureComponent {
  public render() {
    return (
      <Box align="start" direction="column" fill={'horizontal'}>
        <Box margin={{ vertical: 'medium' }}>
          <ControlInspector />
        </Box>
        <Box margin={{ vertical: 'medium' }}>
          <ControlDates />
        </Box>
        <Box margin={{ vertical: 'medium' }}>
          <ProductionSites />
        </Box>
        <Box margin={{ vertical: 'medium' }}>
          <Inspectors />
        </Box>
      </Box>
    );
  }
}
