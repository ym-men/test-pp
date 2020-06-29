import * as React from 'react';
import { prop, path } from 'ramda';
import { TextProps } from 'grommet';
import { TID } from '../../../interface';
import { Entities } from '../../../../entities';
import { Text } from 'components/ui';
import ICatalogs = Entities.ICatalogs;
import { IStores } from 'mobx-stores/stores';
import { inject, observer } from 'mobx-react';

@inject('catalogs')
@observer
export class CatalogItem extends React.Component<IProps & IStores> {
  public render() {
    const { id, namespace, catalogs, ...props } = this.props;

    const property = props.property || 'name';

    const method = Array.isArray(namespace) ? path(namespace) : prop(namespace);

    const value = prop(
      property,
      ((method(catalogs.data) as Array<any>) || []).find(c => String(c.id) === String(id))
    );

    return <Text {...props as any}>{value}</Text>;
  }
}

type IProps = {
  property?: string;
  namespace: ['documentTypes', keyof ICatalogs['documentTypes']] | keyof ICatalogs;
  className?: string;
  id: TID;
  type?: 'header' | 'title' | 'label';
} & TextProps;
