import * as React from 'react';
import { Box } from 'grommet';
import { Entities } from '../../../../../../../entities';
import { MtrDetail } from './MtrDetail';
import TOrder = Entities.TOrder;

export const MtrsList: React.FunctionComponent<IProps> = props => (
  <Box margin={{ top: 'medium' }} fill={'vertical'}>
    {((props.order && props.order.mtrs) || []).map((mtr, index) => (
      <Box
        margin={{ bottom: 'medium' }}
        pad={{ left: 'large', right: 'small', vertical: 'medium' }}
        background={'Basic200'}
        key={`${mtr.id}-${index}-list`}
      >
        <MtrDetail index={index + 1} mtr={mtr} order={props.order} />
      </Box>
    ))}
  </Box>
);

interface IProps {
  order: TOrder;
}
