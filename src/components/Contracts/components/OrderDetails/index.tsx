import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Box, Text } from 'grommet';
import {
  ContentHead,
  OrderApprove,
  OrderEdit,
  OrderApproved,
  OrderModal,
  MtrsList,
} from './components';

import { Case, Switch, Loader, CatalogItem, DownloadIcon, If } from 'components/ui';
import { OrderError } from '../OrderError';
import { ContractError } from '../ContractError';
import { hasRole } from 'hocs';
import { FileList } from '../Steps/FileList';
import { dateFormatToString } from 'utils';
import { Entities } from '../../../../../entities';
import TDocument = Entities.TDocument;
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { getUrl } from 'services/utils';

const ApproveByManager = hasRole(['CUSTOMER_MANAGER'], OrderApprove);
const EditByBuyer = hasRole(['BUYER_CURATOR'], OrderEdit);
const Approved = hasRole(['CUSTOMER_MANAGER', 'BUYER_CURATOR'], OrderApproved);

@inject('activeContract', 'activeOrder')
@observer
export class OrderDetails extends React.Component<IProps, IState> {
  public readonly state = {
    mode: 'orders' as 'orders',
    needComments: false,
  };

  public componentWillMount() {
    const { contractId, orderId } = this.props.match.params;
    this.props.activeContract.get(contractId);
    this.props.activeOrder.get(orderId);
  }
  public componentWillUnmount() {
    this.props.activeContract.clearData();
    this.props.activeOrder.clearData();
  }

  public render(): React.ReactNode {
    const { match, activeContract, activeOrder } = this.props;
    const { data: contract = {} as Entities.TContract } = activeContract;
    const { data: order = {} as Entities.TOrder } = activeOrder;

    return (
      <Box align="start" justify="between" margin={{ top: 'large' }}>
        <Switch condition={true}>
          <Case value={activeContract.getStatus === 'fetching'}>
            <Loader />
          </Case>
          <Case value={activeContract.getStatus === 'error'}>
            <ContractError id={this.props.match.params.contractId} />
          </Case>
          <Case value={activeContract.getStatus !== 'error' && activeOrder.getStatus === 'error'}>
            <OrderError id={match.params.orderId} />
          </Case>
          <Case
            value={activeContract.getStatus === 'success' && activeOrder.getStatus === 'success'}
          >
            <ContentHead
              mode={this.state.mode}
              order={order}
              contract={contract}
              setMode={this.setModeHandler}
            />
            <Box width={'calc(100% - 285px)'}>
              <If condition={this.state.mode === 'orders'}>
                <Switch condition={true}>
                  <Case value={order && order.status === 'approving'}>
                    <ApproveByManager
                      onApprove={() => this.contractSetStatus(true)}
                      onReject={() => this.contractSetStatus(false)}
                      boxProps={{ margin: { top: 'xlarge' }, flex: { shrink: 0 } }}
                      pending={order.pending}
                    />
                  </Case>
                  <Case value={order && order.status === 'approved'}>
                    <Approved
                      myOrder={order}
                      myContract={contract as any}
                      boxProps={{ margin: { top: 'xlarge' }, flex: { shrink: 0 } }}
                    />
                  </Case>
                  <Case value={order && order.status === 'rejected'}>
                    <EditByBuyer
                      myOrder={order}
                      myContract={contract as any}
                      boxProps={{ margin: { top: 'xlarge' }, flex: { shrink: 0 } }}
                    />
                  </Case>
                </Switch>
              </If>

              <Switch condition={this.state.mode}>
                <Case value={'orders'}>
                  <MtrsList order={order} />
                </Case>
                <Case value={'files'}>
                  <Box margin={{ top: 'medium' }}>
                    <FileList
                      documents={(order && order.documents) || []}
                      typeRender={this.getTypeComponent}
                    />
                  </Box>
                </Case>
                <Case value={'comments'}>
                  <Box margin={{ top: 'large' }}>
                    {((order && order.comments) || []).map(item => (
                      <Box
                        key={`${item.text}-${item.date.getTime()}`}
                        direction="row"
                        margin={{ bottom: 'large' }}
                      >
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
                </Case>
              </Switch>
            </Box>
          </Case>
        </Switch>
        <OrderModal
          onClose={this.cancelComments}
          isShow={this.state.needComments}
          onApply={this.sendReject}
        />
      </Box>
    );
  }

  protected getTypeComponent = (document: TDocument) => (
    <Box direction="row" justify="center" style={{ width: '100%' }}>
      <Box style={{ width: '200px' }}>
        <CatalogItem namespace={['documentTypes', 'order']} id={document.type} />
      </Box>
      <Box direction="row" justify="end" style={{ width: '100%', paddingRight: 15 }}>
        <a download={''} href={getUrl('FILE_DOWNLOAD', document.id, 1)}>
          <DownloadIcon hover={true} size={'15px'} />
        </a>
      </Box>
    </Box>
  );

  private sendApprove = () => {
    this.props.activeOrder.approve();
  };

  private sendReject = (comment: string) => {
    this.cancelComments();
    this.props.activeOrder.reject(comment);
  };

  private contractSetStatus = (approve: boolean) => {
    if (approve) {
      this.sendApprove();
      return;
    }

    this.setState({
      needComments: true,
    });
  };

  private cancelComments = () => this.setState({ needComments: false });

  private setModeHandler = (mode: 'orders' | 'history' | 'files') => this.setState({ mode });
}

interface IProps
  extends RouteComponentProps<{ contractId: string; orderId: string }>,
    Pick<IStores, 'activeContract'>,
    Pick<IStores, 'activeOrder'> {}

interface IState {
  mode: 'orders' | 'history' | 'files';
  needComments: boolean;
}
