import * as React from 'react';
import { Box } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { FlexiTable, Button, CloseIcon, Text, If } from 'components/ui';
import { action, computed, observable } from 'mobx';
import { AddProductionModal } from './AddProductionModal';
import { Entities } from '../../../../../entities';
import TProduction = Entities.TProduction;

@inject('activeControl', 'access')
@observer
export class ProductionSites extends React.Component<IStores> {
  @computed
  private get access() {
    return this.props.access.components.production;
  }

  @computed
  private get selectedData() {
    return this.props.activeControl.data
      ? this.props.activeControl.data.addresses[this.selectDataIndex]
      : null;
  }
  @computed
  private get showProductions() {
    return this.props.activeControl.data && this.props.activeControl.data.addresses.length
      ? true
      : false;
  }
  @observable private addProductionModalVisible: boolean = false;
  @observable private deleteMode: boolean = false;
  @observable private selectDataIndex: number;

  @computed
  private get columns() {
    const productListColumns: Array<
      FlexiTable.IFlexiTableColumn<TProduction & { index: number }>
    > = [
      {
        property: 'address',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Производственная площадь
          </Text>
        ),
        width: 400,
      },
      {
        property: 'name',
        header: (
          <Text size={'small'} color={'Basic600'}>
            ФИО
          </Text>
        ),
        width: 250,
      },
      {
        property: 'phone',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Контакты
          </Text>
        ),
        width: 200,
      },
    ];

    if (this.access.isEditable) {
      productListColumns.push({
        property: 'index',
        header: <Text />,
        render: data => (
          <Box
            onClick={() => this.deleteProduction(data.index)}
            direction="row"
            style={{ width: '100%', paddingRight: '15px' }}
            justify={'end'}
          >
            <CloseIcon hover={true} size="15px" />
          </Box>
        ),
      });
    }

    return productListColumns;
  }

  public render() {
    const { activeControl } = this.props;

    return (
      <Box direction="column">
        <Text type="title">Производственные площадки</Text>
        <Box direction="column" margin={{ vertical: 'small' }}>
          <If condition={this.showProductions}>
            <FlexiTable
              columns={this.columns}
              data={activeControl.data.addresses.map((data, idx) => ({ ...data, index: idx }))}
              rowProps={{ clickable: false }}
            />
          </If>
        </Box>
        <If condition={this.access.isEditable}>
          <Box direction="column" margin={{ vertical: 'small' }}>
            <Button
              id="control-productionSites-button-add"
              style={{ width: 240 }}
              small={true}
              label="Добавить площадку"
              onClick={() => (this.addProductionModalVisible = true)}
            />
          </Box>
        </If>
        <AddProductionModal
          isShow={this.addProductionModalVisible}
          deleteMode={this.deleteMode}
          data={this.selectedData}
          onClose={() => {
            this.addProductionModalVisible = false;
            this.deleteMode = false;
            this.selectDataIndex = null;
          }}
          onApply={(productionData: TProduction) => {
            return this.deleteMode
              ? activeControl.deleteProduction(this.selectDataIndex)
              : activeControl.addProduction(productionData);
          }}
        />
      </Box>
    );
  }

  @action.bound private deleteProduction(index: number) {
    this.selectDataIndex = index;
    this.deleteMode = true;
    this.addProductionModalVisible = true;
  }
}
