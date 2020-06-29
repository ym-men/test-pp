import * as React from 'react';
import { Box } from 'grommet';
import { Text, FlexiTable, Button, If, Pending } from 'components/ui';
import { inject, observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import { IStores } from 'mobx-stores/stores';
import { Entities } from '../../../../../entities';
import { AddLocationModal } from 'pages/Delivery/components/Locations/AddLocationModal';
import { dateFormatToString } from 'utils';
import TLocation = Entities.TLocation;

@inject('activeDelivery', 'user')
@observer
export class Location extends React.Component<IStores> {
  @observable private addInspectorModalVisible: boolean = false;

  @computed
  private get locationsColumns() {
    const locationsColumns: Array<FlexiTable.IFlexiTableColumn<TLocation & { index: number }>> = [
      {
        property: 'location',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Местоположение
          </Text>
        ),
        width: 300,
      },
      {
        property: 'locationDate',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Дата обновления
          </Text>
        ),
        render: control => <div>{dateFormatToString(control.locationDate)}</div>,
        width: 100,
      },
      {
        property: 'dateToUpdate',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Ожидаемая дата прибытия
          </Text>
        ),
        render: control => <div>{dateFormatToString(control.dateToUpdate)}</div>,
        width: 100,
      },
    ];
    return locationsColumns;
  }

  public render() {
    const { activeDelivery, user } = this.props;
    return (
      <Box align="start" direction="column" fill={'horizontal'}>
        <Box margin={{ vertical: 'small' }}>
          <Box direction="row" margin={{ top: 'medium' }} alignContent={'center'} width={'100%'}>
            <Box margin={{ right: 'small' }} alignSelf={'center'}>
              <Text type="title">Ход поставки</Text>
            </Box>
            <If
              condition={
                user.role === 'CUSTOMER_MANAGER' &&
                activeDelivery.status === 'delivery' &&
                !activeDelivery.data.dateArrivalCustomer
              }
            >
              <Pending pending={activeDelivery.pending}>
                <Box margin={{ left: 'medium' }} alignSelf={'center'} direction="row">
                  <Button
                    id="delivery-location-button-refreshData"
                    style={{ width: 240 }}
                    small={true}
                    label="Обновить данные"
                    isLoading={activeDelivery.updateStatus === 'fetching'}
                    onClick={() => (this.addInspectorModalVisible = true)}
                  />
                  <Button
                    id="delivery-location-button-approveArrivalCustomer"
                    style={{ marginLeft: '20px' }}
                    small={true}
                    label="Уведомить о прибытии груза"
                    isLoading={activeDelivery.updateStatus === 'fetching'}
                    onClick={() =>
                      activeDelivery.openModal(
                        'approveArrivalCustomer',
                        activeDelivery.approveArrivalCustomer
                      )
                    }
                  />
                </Box>
              </Pending>
            </If>
          </Box>
          <Box margin={{ vertical: 'medium' }}>
            <FlexiTable
              columns={this.locationsColumns}
              data={activeDelivery.data.locationList.map((data, idx) => ({ ...data, index: idx }))}
              rowProps={{ clickable: false }}
            />
          </Box>
          <AddLocationModal
            isShow={this.addInspectorModalVisible}
            data={null}
            onClose={() => (this.addInspectorModalVisible = false)}
            onApply={(location: TLocation) => activeDelivery.addLocation(location)}
          />
        </Box>
      </Box>
    );
  }
}
