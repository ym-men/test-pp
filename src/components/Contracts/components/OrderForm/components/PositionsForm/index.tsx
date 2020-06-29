import * as React from 'react';
import { PositionForm } from './PositionForm';
import { Box } from 'grommet';
import { Button } from 'components/ui';
import { Entities } from '../../../../../../../entities';
import TMTR = Entities.TMTR;

export class PositionsForm extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const renderData = this.getRenderedData();

    return (
      <Box pad={{ bottom: 'medium' }}>
        {renderData.map(
          config => (config && <PositionForm key={config.key} {...config} />) || null
        )}
        <Box alignSelf={'start'}>
          <Button
            id="order-positionForm-button-addPosition"
            small={true}
            margin={{ top: 'small' }}
            onClick={this.addPositionHandler}
          >
            Добавить позицию
          </Button>
        </Box>
      </Box>
    );
  }

  protected deleteHandler(index: number) {
    const { mtrs: oldMtrs } = this.props.data;
    const mtrs = [...(oldMtrs || [])];
    mtrs.splice(index, 1);
    if (!mtrs.length) {
      mtrs.push({ date: [new Date(), new Date()] } as TMTR<Date>);
    }
    this.props.onChangeData(mtrs, this.props.data.mtrs, 'mtrs');
  }

  protected changeHandler = (id: number, receiveData: TMTR) => {
    const { mtrs = [] } = this.props.data;
    const positions = [...(mtrs || [])];
    positions[id] = receiveData;
    this.props.onChangeData(positions, this.props.data.mtrs, 'mtrs');
  };

  protected addPositionHandler = () => {
    const data = { ...this.props.data };
    const { mtrs = [] } = data;
    data.mtrs = [...(mtrs || []), Object.create(null)];
    const index = (this.props.data.mtrs && this.props.data.mtrs.length) || 0;
    this.changeHandler(index, {} as TMTR);
  };

  protected getRenderedData() {
    const dataProps = [...(this.props.data.mtrs || [{} as any])];
    const errors = (this.props.errors && this.props.errors.mtrs) || ([] as any[]);
    let position = 0;

    return dataProps
      .map((data, index) => {
        if (!data) {
          return null;
        }
        position++;
        const onChangeData = this.changeHandler.bind(this, index);
        const onDelete = () => this.deleteHandler(index);
        return {
          data,
          position,
          errors: errors[index] || ({} as any),
          onDelete,
          onChangeData,
          key: index,
          canDelete: true,
        };
      })
      .filter(Boolean);
  }
}

interface IProps {
  data: Entities.TOrder;
  onChangeData: (...args: Array<any>) => void;
  errors: { [T in keyof Entities.TOrder]: string };
}
