import * as React from 'react';
import { Box, Text } from 'grommet';
import { Entities } from '../../../../../entities';
import TControlStatus = Entities.TControlStatus;

function getState(currentValue: number, elValue: number) {
  let state: State = 'hidden';
  if (elValue < currentValue) {
    state = 'done';
  } else if (currentValue === elValue) {
    state = 'active';
  }

  return state;
}

type State = 'done' | 'active' | 'hidden';

interface IPropsStep {
  value: number;
  active?: boolean;
  disabled?: boolean;
}

interface IPropsProgressItem {
  value: number;
  text: string;
  state: State;
}

interface IPropsProgress {
  status: TControlStatus;
}

const Step: React.FunctionComponent<IPropsStep> = ({ value, active, disabled }) => (
  <Box
    width="25px"
    height="25px"
    align="center"
    justify="center"
    background={active ? 'Yellow600' : 'none'}
    border={{ style: 'solid', color: `${disabled ? 'Basic600' : 'Basic1000'}`, size: '2px' }}
    style={{
      borderRadius: '50%',
    }}
  >
    <Text size="16px">{value}</Text>
  </Box>
);

const ProgressItem: React.FunctionComponent<IPropsProgressItem> = ({ value, text, state }) => (
  <Box direction="row" align="center">
    <Step value={value} active={state === 'active'} disabled={state === 'hidden'} />
    <Box style={{ maxWidth: '132px' }} margin={{ left: 'small' }}>
      <Text size="small" color={state !== 'done' ? 'Basic600' : 'Basic1000'}>
        {text}
      </Text>
    </Box>
  </Box>
);

export const ControlProgress: React.FunctionComponent<IPropsProgress> = ({ status }) => {
  const cfg = [
    {
      statuses: [
        'inspection_plan',
        'ppi_approving',
        'ppi_date_approving',
        'ppi_fix',
        'dates_fix',
        'order_applying',
        'order_approving',
        'order_fix',
        'inspection_meeting',
        'inspection',
        'inspector_call',
        'inspector_sent',
      ],
      value: 1,
      text: 'Планирование контроля',
    },
    {
      statuses: ['inspection_start'],
      value: 2,
      text: 'Начало контроля',
    },
    {
      statuses: ['control_material'],
      value: 3,
      text: 'Входной контроль материалов',
    },
    {
      statuses: ['control_product'],
      value: 4,
      text: 'Контроль производства',
    },
    {
      statuses: ['control_docs'],
      value: 5,
      text: 'Проверка документов',
    },
    {
      statuses: ['control_shipment', 'delivery_allowed', 'delivery_spoiled'],
      value: 6,
      text: 'Контроль погрузки',
    },
    {
      statuses: ['control_finish'],
      value: 7,
      text: 'Контроль завершен',
    },
  ];

  const current = cfg.find(item => {
    return item.statuses.includes(status);
  });
  return (
    <Box direction="row" justify="between">
      {cfg.map(el => {
        const state = getState(current.value, el.value);

        return <ProgressItem value={el.value} text={el.text} key={el.value} state={state} />;
      })}
    </Box>
  );
};
