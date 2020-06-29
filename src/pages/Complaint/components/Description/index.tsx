import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { inject, observer } from 'mobx-react';
import { IStores } from 'mobx-stores/stores';
import { Text, CatalogItem, If, Button } from 'components/ui';
import { dateFormatToString } from 'utils';
import { Entities } from '../../../../../entities';
import TComplaint = Entities.TComplaint;
import { TID } from 'interface';

const Representative: React.FunctionComponent<{ complaint: TComplaint } & BoxProps> = ({
  complaint,
  ...props
}) => (
  <Box {...props}>
    <Text type="title" margin={{ bottom: 'small' }}>
      Представитель поставщика
    </Text>
    <Text margin={{ bottom: 'small' }}>{complaint.representativeName}</Text>
    <Text>{complaint.representativePhone}</Text>
  </Box>
);

const ComissionDate: React.FunctionComponent<{ complaint: TComplaint } & BoxProps> = ({
  complaint,
  ...props
}) => (
  <Box {...props}>
    <Text type="title" margin={{ bottom: 'small' }}>
      Дата проведения комиссии
    </Text>
    <Text>{dateFormatToString(complaint.comissionDate)}</Text>
  </Box>
);

const FixingMethod: React.FunctionComponent<{ complaint: TComplaint } & BoxProps> = ({
  complaint,
  ...props
}) => (
  <Box {...props}>
    <Text type="title" margin={{ bottom: 'small' }}>
      Устранение недостатков
    </Text>
    <Box direction="row" width={'100%'}>
      <Box width="50%">
        <Text margin={{ bottom: 'small' }} color={'Basic600'}>
          Метод устранения
        </Text>
        <CatalogItem namespace={'fixingTypes'} id={complaint.fixingMethod as number} />
      </Box>
      <Box width="50%">
        <Text margin={{ bottom: 'small' }} color={'Basic600'}>
          Дата обновления
        </Text>
        <Text>{dateFormatToString(complaint.fixingMethodDate)}</Text>
      </Box>
    </Box>
  </Box>
);

const AdditionalDeliveries: React.FunctionComponent<{ deliveriesIds: TID[] } & BoxProps> = ({
  deliveriesIds,
  ...props
}) => (
  <Box {...props} direction="row">
    <Text type="title" margin={{ bottom: 'small' }}>
      Допоставка
    </Text>
    <Button
      small={true}
      style={{ width: '250px', marginLeft: 20 }}
      btnType="ahref"
      href={`/deliveries/${deliveriesIds[0]}`}
    >
      Перейти к допоставке
    </Button>
  </Box>
);

@inject('activeComplaint')
@observer
export class Description extends React.Component<IStores> {
  public render() {
    const data = this.props.activeComplaint.data;

    return (
      <Box align="start" direction="column" fill={'horizontal'} pad={{ top: 'small' }}>
        <Box direction="row" width={'100%'} margin={{ vertical: 'medium' }}>
          <Representative complaint={data} width="50%" pad={{ right: 'small' }} />
          <ComissionDate complaint={data} width="50%" pad={{ left: 'small' }} />
        </Box>
        <Box direction="row" width={'100%'} margin={{ vertical: 'medium' }}>
          <FixingMethod complaint={data} width="50%" pad={{ right: 'small' }} />
          <If condition={data.additionalDeliveries && data.additionalDeliveries.length}>
            <AdditionalDeliveries
              deliveriesIds={data.additionalDeliveries}
              width="50%"
              pad={{ right: 'small' }}
            />
          </If>
        </Box>
      </Box>
    );
  }
}
