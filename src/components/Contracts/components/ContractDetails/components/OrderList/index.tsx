import * as React from 'react';
import * as styles from './OrderList.styl';
import * as cn from 'classnames';
import { Box } from 'grommet';
import { Text } from 'components/ui';
import { FlexiTable, OrderStatus } from 'components/ui';
import { Entities } from '../../../../../../../entities';
import { Link } from 'react-router-dom';
import { IStores } from 'mobx-stores/stores';
import columns from './columns';
import TContract = Entities.TContract;
import TOrder = Entities.TOrder;
import { inject, observer } from 'mobx-react';

@inject('user')
@observer
export class OrderList extends React.Component<IProps & IStores> {
  public isActionAllowed = (order: TOrder) => {
    return this.props.user.role === 'CUSTOMER_MANAGER' && order.status === 'approving';
  };

  public render() {
    const { contract } = this.props;
    return (
      <Box margin={{ top: 'large' }}>
        {(contract.orders || []).map(order => (
          <Box
            margin={{ bottom: 'medium' }}
            key={order.id}
            background={'Basic200'}
            className={cn(styles.actionAllowed, this.isActionAllowed(order) ? styles.status : '')}
          >
            <Link
              className={styles.orderListLink}
              to={`/contracts/${contract.id}/orders/${order.id}`}
            >
              <Box
                align={'center'}
                direction={'row'}
                pad={{ vertical: 'small', horizontal: 'small' }}
              >
                <Text
                  className={styles.orderTitle}
                  overflow="ellipsis"
                  size={'large'}
                  margin={{ right: 'small' }}
                  color={'Basic1000'}
                >
                  {order.number}
                </Text>
                <Box direction="row" justify="end" width={'100%'}>
                  <OrderStatus order={order} />
                </Box>
              </Box>
              <Box className={styles.boxOrderStyle}>
                <FlexiTable
                  columns={columns}
                  data={order.mtrs.map((item, index) => ({ ...item, index: index + 1 }))}
                  rowProps={{ clickable: false }}
                />
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    );
  }
}

interface IProps {
  contract: TContract;
  rowProps?: ((data: TContract) => React.ComponentProps<'tr'>) | React.ComponentProps<'tr'>;
  bodyProps?: (() => React.ComponentProps<'tbody'>) | React.ComponentProps<'tbody'>;
  headProps?: (() => React.ComponentProps<'thead'>) | React.ComponentProps<'thead'>;
}
