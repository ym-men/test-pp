import * as React from 'react';
import { Box } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { FlexiTable, Button, CloseIcon, Text, If } from 'components/ui';
import { action, computed, observable } from 'mobx';
import { Entities } from '../../../../../entities';
import TInspector = Entities.TInspector;
import { AddInspectorModal } from './AddInspectorModal';

@inject('activeControl', 'access')
@observer
export class Inspectors extends React.Component<IStores> {
  @computed
  private get access() {
    return this.props.access.components.staff;
  }

  @computed
  private get selectedData() {
    return this.props.activeControl.data
      ? this.props.activeControl.data.inspectors[this.selectDataIndex]
      : null;
  }
  @computed
  private get showProductions() {
    return this.props.activeControl.data && this.props.activeControl.data.inspectors.length
      ? true
      : false;
  }
  @observable private addInspectorModalVisible: boolean = false;
  @observable private deleteMode: boolean = false;
  @observable private selectDataIndex: number;

  @computed
  private get inspectorsColumns() {
    const productListColumns: Array<
      FlexiTable.IFlexiTableColumn<TInspector & { index: number }>
    > = [
      {
        property: 'name',
        header: (
          <Text size={'small'} color={'Basic600'}>
            ФИО
          </Text>
        ),
      },
      {
        property: 'phone',
        header: (
          <Text size={'small'} color={'Basic600'}>
            Телефон
          </Text>
        ),
      },
    ];

    if (this.access.isEditable) {
      productListColumns.push({
        property: 'index',
        header: <Text />,
        render: data => (
          <Box
            direction="row"
            style={{ width: '100%', paddingRight: '15px' }}
            justify={'end'}
            onClick={() => this.deleteInspector(data.index)}
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

    if (!this.access.isVisible) {
      return null;
    }

    return (
      <Box direction="column">
        <Text type="title">Направляемый персонал</Text>
        <Box direction="column" margin={{ vertical: 'small' }}>
          <If condition={this.showProductions}>
            <FlexiTable
              columns={this.inspectorsColumns}
              data={activeControl.data.inspectors.map((data, idx) => ({ ...data, index: idx }))}
              rowProps={{ clickable: false }}
            />
          </If>
        </Box>
        <If condition={this.access.isEditable}>
          <Box direction="column" margin={{ vertical: 'small' }}>
            <Button
              id="control-inspectors-button-add"
              style={{ width: 240 }}
              small={true}
              label="Добавить контакт"
              onClick={() => (this.addInspectorModalVisible = true)}
            />
          </Box>
        </If>
        <AddInspectorModal
          isShow={this.addInspectorModalVisible}
          deleteMode={this.deleteMode}
          data={this.selectedData}
          onClose={() => {
            this.addInspectorModalVisible = false;
            this.deleteMode = false;
            this.selectDataIndex = null;
          }}
          onApply={(inspectorData: TInspector) => {
            return this.deleteMode
              ? activeControl.deleteInspector(this.selectDataIndex)
              : activeControl.addInspector(inspectorData);
          }}
        />
      </Box>
    );
  }

  @action.bound private deleteInspector(index: number) {
    this.selectDataIndex = index;
    this.deleteMode = true;
    this.addInspectorModalVisible = true;
  }
}
