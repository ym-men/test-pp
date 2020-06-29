import * as React from 'react';
import * as styles from './styles.styl';
import { Box } from 'grommet';
import { Text, ComplaintStatus, DashedBox } from 'components/ui';
import { Entities } from '../../../../../entities';
import TDelivery = Entities.TDelivery;
import TComplaint = Entities.TComplaint;

const Item: React.FunctionComponent<{ title: string; value: any; className?: string }> = ({
  title,
  value,
  className,
}) => (
  <Box direction="column" margin={{ vertical: 'xsmall' }} className={className}>
    <Box>
      <Text color="Basic600">{title}</Text>
    </Box>
    <Box margin={{ top: 'xxsmall' }}>
      <Text>{value}</Text>
    </Box>
  </Box>
);

export const ComplaintInfo: React.FunctionComponent<IProps> = props => {
  return (
    <DashedBox direction="column" className={styles.complaintInfoContainer}>
      <Box margin={{ vertical: 'small' }}>
        <Text type="title" textAlign="center">
          Данные рекламации
        </Text>
      </Box>
      <Box>
        <Item title="Статус" value={<ComplaintStatus complaint={props.complaint} />} />
        <Item title="Поставляемые МТР" value={props.delivery.mtrName} />
      </Box>
    </DashedBox>
  );
};

interface IProps {
  delivery: TDelivery;
  complaint: TComplaint;
}
