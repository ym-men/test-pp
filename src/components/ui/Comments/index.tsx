import * as React from 'react';
import { Box } from 'grommet';
import { Text } from 'components/ui';
import { dateFormatToString } from 'utils';
import { Entities } from '../../../../entities';
import TComment = Entities.TComment;

interface IProps {
  comments: TComment[];
}

export const Comments: React.FunctionComponent<IProps> = ({ comments }) => (
  <Box>
    {comments.map(item => (
      <Box key={`${item.text}-${item.date.getTime()}`} direction="row" margin={{ bottom: 'large' }}>
        <Box margin={{ right: 'large' }}>
          <Text size={'large'}>{dateFormatToString(item.date)}</Text>
        </Box>
        <Box>
          <Text size={'large'}>{item.text}</Text>
          <Box margin={{ top: 'small' }}>
            <Text size={'large'} color={'Basic600'}>
              – {item.author}
            </Text>
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);
