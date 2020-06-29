import * as React from 'react';
import * as styles from './ContractDetails.styl';
import { RouteComponentProps } from 'react-router-dom';
import { Box, Text } from 'grommet';
import {
  ContentHead,
  ContractApprove,
  ContractEdit,
  ContractModal,
  ContractApproved,
  ContractApproveWait,
} from './components';
import { Case, Switch, Loader, If, CatalogItem, DownloadIcon } from 'components/ui';
import { ContractError } from '../ContractError';
import { OrderList } from './components/OrderList';
import { Entities } from '../../../../../entities';
import TContract = Entities.TContract;
import { hasRole, isContractStatus } from 'hocs';
import { FileList } from '../Steps/FileList';
import { dateFormatToString } from 'utils';
import TDocument = Entities.TDocument;
import { IStores } from 'mobx-stores/stores';
import { inject, observer } from 'mobx-react';
import { getUrl } from 'services/utils';

const CustomerApprove = hasRole(
  ['CUSTOMER_MANAGER'],
  isContractStatus('approving', ContractApprove)
);
const CustomerApproveWait = hasRole(
  ['BUYER_CURATOR'],
  isContractStatus('approving', ContractApproveWait)
);
const CustomerApproved = isContractStatus('approved', ContractApproved);
const BuyerEdit = isContractStatus('rejected', ContractEdit);

@inject('activeContract')
@observer
export class ContractDetails extends React.Component<
  Pick<IStores, 'activeContract'> & IProps,
  IState
> {
  public readonly state = {
    mode: 'orders' as 'orders',
    needComments: false,
  };

  public componentWillMount() {
    const { contractId } = this.props.match.params;
    this.props.activeContract.get(contractId);
  }

  public componentWillUnmount() {
    this.props.activeContract.clearData();
  }

  public render(): React.ReactNode {
    const { data: contract = {} as TContract } = this.props.activeContract;

    return (
      <Box align="start" justify="between" margin={{ top: 'large' }}>
        <Switch condition={this.props.activeContract.getStatus}>
          <Case value={'fetching'}>
            <Loader />
          </Case>
          <Case value={'error'}>
            <ContractError id={this.props.match.params.contractId} />
          </Case>
          <Case value={'success'}>
            <ContentHead
              mode={this.state.mode}
              contract={this.props.activeContract.data}
              setMode={this.setModeHandler}
            />

            <Box width={'calc(100% - 285px)'}>
              <Switch condition={this.state.mode}>
                <Case value={'orders'}>
                  <If condition={!contract.orders || !contract.orders.length}>
                    <CustomerApproved
                      myContract={contract as TContract}
                      boxProps={{ margin: { top: 'xlarge' } }}
                    />
                    <CustomerApproveWait boxProps={{ margin: { top: 'xlarge' } }} />
                  </If>
                  <BuyerEdit
                    myContract={contract as TContract}
                    boxProps={{ margin: { top: 'xlarge' } }}
                  />
                  <CustomerApprove
                    onApprove={() => this.contractSetStatus(true)}
                    onReject={() => this.contractSetStatus(false)}
                    boxProps={{ margin: { top: 'xlarge' } }}
                    pending={contract.pending}
                  />
                  <OrderList contract={contract as TContract} />
                </Case>
                <Case value={'files'}>
                  <Box margin={{ top: 'medium' }}>
                    <FileList
                      documents={contract.documents || []}
                      typeRender={this.getTypeComponent}
                    />
                  </Box>
                </Case>
                <Case value={'comments'}>
                  <Box margin={{ top: 'large' }}>
                    {(contract.comments || []).map(item => (
                      <Box
                        key={`${item.text}-${item.date.getTime()}`}
                        direction="row"
                        margin={{ bottom: 'large' }}
                      >
                        <Box margin={{ right: 'small' }} width={'small'}>
                          <Text size={'large'}>{dateFormatToString(item.date)}</Text>
                        </Box>
                        <Box className={styles.textStyle}>
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

            <ContractModal
              isShow={this.state.needComments}
              onClose={this.cancelComments}
              onApply={this.sendReject}
            />
          </Case>
        </Switch>
      </Box>
    );
  }

  protected getTypeComponent = (document: TDocument) => (
    <Box direction="row" justify="between" width={'100%'}>
      <CatalogItem namespace={['documentTypes', 'contract']} id={document.type} />
      <Box margin={{ horizontal: 'large' }} onClick={evt => evt.stopPropagation()}>
        <a download={''} href={getUrl('FILE_DOWNLOAD', document.id, 1)}>
          <DownloadIcon hover={true} size={'15px'} />
        </a>
      </Box>
    </Box>
  );

  private sendReject = (comment: string) => {
    this.cancelComments();
    this.props.activeContract.reject(comment);
  };

  private contractSetStatus = (approve: boolean) => {
    if (approve) {
      this.props.activeContract.approve();
      return;
    }

    this.setState({
      needComments: true,
    });
  };

  private cancelComments = () => this.setState({ needComments: false });

  private setModeHandler = (mode: 'orders' | 'history' | 'files') => this.setState({ mode });
}

interface IProps extends RouteComponentProps<{ contractId: string }> {}

interface IState {
  mode: 'orders' | 'history' | 'files';
  needComments: boolean;
}
