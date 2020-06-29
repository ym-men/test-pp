import * as React from 'react';
import { Box } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { FormConstructor, Text } from 'components/ui';
import { action, computed } from 'mobx';
import { filter, map, pipe, propEq } from 'ramda';
import { Entities } from '../../../../../entities';
import TOrganizationType = Entities.TOrganizationType;
import IOrganization = Entities.IOrganization;
import { catalogs } from 'services/catalogs';
import ORGANIZATION_TYPE = catalogs.ORGANIZATION_TYPE;

const getSelectOptionsFromCatalog = (type: TOrganizationType) =>
  pipe(
    filter(propEq('type', type)),
    map((item: IOrganization) => ({ text: item.name, value: item.id }))
  );

@inject('activeControl', 'access', 'catalogs')
@observer
export class ControlInspector extends React.Component<IStores> {
  @computed
  private get access() {
    return this.props.access.components.inspector;
  }

  @computed
  private get formsConfig() {
    if (this.props.catalogs.data) {
      return [
        {
          type: this.access.isEditable ? 'select' : 'text',
          options: getSelectOptionsFromCatalog(ORGANIZATION_TYPE.CONTROL)(
            this.props.catalogs.data.organizations || []
          ),
          required: true,
          field: 'inspector',
          title: 'Название инспекционной компании',
          lassName: '',
        },
      ];
    }

    return [];
  }

  @computed
  private get data() {
    const { activeControl } = this.props;

    return {
      inspector: this.props.catalogs.getInspectorNameById(activeControl.data.inspector),
    };
  }

  public render() {
    if (!this.access.isVisible) {
      return null;
    }

    return (
      <Box direction="column">
        <Text type="title">Инспекционная компания</Text>
        <FormConstructor
          onChangeData={this.onChange}
          errors={{}}
          formOptions={this.formsConfig}
          data={this.data}
        />
      </Box>
    );
  }

  @action.bound
  private onChange(value: any, oldValue: any, field: string) {
    this.props.activeControl.data[field] = value;
  }
}
