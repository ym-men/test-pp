import * as React from 'react';
import { Box, Text } from 'grommet';
import { Entities } from '../../../../../entities';
import TControl = Entities.TControl;
import * as style from './styles.styl';
import { ControlStatus } from 'components/ui/Statuses';

export const StatusInfo: React.FunctionComponent<IProps> = ({ control }) => (
  <Box
    direction="column"
    height="127px"
    width="100%"
    margin={{ top: '-46px' }}
    justify="center"
    align="center"
    border={{ color: 'rgba(0, 0, 0, 0.3)', style: 'dashed', side: 'all' }}
  >
    <Text size="24px">Статус проверки</Text>
    <Box direction="row" align="start" justify="between">
      <ControlStatus control={control} className={style.status} showIcon={true} />
    </Box>
  </Box>
);

interface IProps {
  control: TControl;
}
