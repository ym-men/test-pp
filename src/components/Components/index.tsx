import * as React from 'react';
import { Box, Text, Heading } from 'grommet';
import {
  Button,
  CheckIcon,
  CloseIcon,
  ContractStatus,
  DownloadIcon,
  LeftIcon,
  RightIcon,
  RightLarge,
  DocumentIcon,
} from 'components/ui';
import {
  InputForm,
  SelectForm,
  InlineSelectForm,
  CalendarForm,
} from '../ui/FormConstructor/components';
import { CalendarIcon, UserIcon, DownIcon, UpIcon, TimeIcon } from 'components/ui/Icons';

const DEMO_CONFIG = [
  {
    component: ({ children, ...props }: any) => {
      return (
        <Box>
          <Box {...props} />
          <Box>
            <Text size={'large'} margin={{ top: 'small' }}>
              {props.background}
            </Text>
          </Box>
        </Box>
      );
    },
    name: 'colors',
    direction: 'row',
    items: [
      { background: 'Basic1000', width: 'small', height: 'xsmall' },
      { background: 'Basic800', width: 'small', height: 'xsmall' },
      { background: 'Basic600', width: 'small', height: 'xsmall' },
      { background: 'Basic400', width: 'small', height: 'xsmall' },
      { background: 'Basic300', width: 'small', height: 'xsmall' },
      { background: 'Basic200', width: 'small', height: 'xsmall' },
      { background: 'Yellow600', width: 'small', height: 'xsmall' },
      { background: 'Green600', width: 'small', height: 'xsmall' },
      { background: 'Red600', width: 'small', height: 'xsmall' },
    ],
  },
  {
    component: Heading,
    name: 'Heading',
    items: [{ text: 'Header-1' }, { size: 'small', text: 'Subheader-1' }],
  },
  {
    component: Text,
    name: 'Text',
    items: [
      { text: 'Body-1' },
      { text: 'Body-1', color: 'Basic600' },
      { text: 'Body-2', size: 'small' },
      { text: 'Body-2', size: 'small', color: 'Basic600' },
    ],
  },
  {
    component: (props: any) => (
      <Box>
        <ContractStatus {...props} />
        <Text size={'small'} margin={{ top: 'medium' }}>
          {props.children[1]}
        </Text>
      </Box>
    ),
    name: 'ContractStatus',
    direction: 'row',
    items: [
      { contract: { status: null } },
      { contract: { status: 'approving' } },
      { contract: { status: 'approved' } },
      { contract: { status: 'rejected' } },
    ],
  },
  {
    component: Button,
    name: 'Button',
    direction: 'row',
    items: [
      { label: 'Button' },
      { label: 'Disabled', disabled: true },
      { label: 'Action button', action: true },
      { label: 'Action disabled', action: true, disabled: true },
      { label: 'Small button', small: true },
    ],
  },
  {
    component: ({ label, children, ...props }: any) => (
      <Box>
        <SelectForm {...props} />
        <Box>
          <Text size={'large'} margin={{ top: 'small' }}>
            {label}
          </Text>
        </Box>
      </Box>
    ),
    name: 'Select',
    direction: 'row',
    items: [
      {
        label: 'Select attr',
        value: 'test',
        config: { props: {}, options: ['test', 'test2', 'test3'] },
      },
      {
        label: 'Select disable attr',
        value: 'test',
        config: { props: { disabled: true }, options: ['test', 'test2', 'test3'] },
      },
    ],
  },
  {
    component: ({ label, children, ...props }: any) => (
      <Box>
        <InlineSelectForm {...props} />
        <Box>
          <Text size={'large'} margin={{ top: 'small' }}>
            {label}
          </Text>
        </Box>
      </Box>
    ),
    name: 'InlineSelect',
    direction: 'row',
    items: [
      {
        label: 'Select attr',
        value: 'test',
        config: { props: {}, options: ['test', 'test2', 'test3'] },
      },
      {
        label: 'Select disable attr',
        value: 'test',
        config: {
          disabled: true,
          options: ['test', 'test2', 'test3'],
        },
      },
    ],
  },
  {
    component: ({ label, children, ...props }: any) => (
      <Box>
        <CalendarForm {...props} />
        <Box>
          <Text size={'large'} margin={{ top: 'small' }}>
            {label}
          </Text>
        </Box>
      </Box>
    ),
    name: 'Calendar',
    direction: 'row',
    items: [
      {
        label: 'Calendar attr',
        value: '',
        config: { props: {} },
      },
      {
        label: 'Calendar disable attr',
        value: '2003.10.01',
        config: { disabled: true },
      },
    ],
  },
  {
    component: ({ label, children, ...props }: any) => (
      <Box>
        <InputForm {...props} />
        <Box>
          <Text size={'large'} margin={{ top: 'small' }}>
            {label}
          </Text>
        </Box>
      </Box>
    ),
    name: 'Input',
    direction: 'row',
    items: [
      {
        label: 'Input placeholder',
        value: '',
        config: { props: { placeholder: 'placeholder' } },
      },
      {
        label: 'Input value',
        value: 'test value',
      },
      {
        label: 'Input disable attr',
        value: 'test value',
        config: { disabled: true },
      },
      {
        label: 'Input readonly attr',
        value: 'test value',
        config: { props: { readOnly: true } },
      },
      {
        label: 'Input error',
        value: 'test value',
        errors: ['error'],
      },
    ],
  },
  {
    name: 'Icons',
    component: ({ Component, title, ...props }: any) => {
      return (
        <Box direction={'column'} justify={'center'}>
          <Box alignSelf={'center'} direction={'row'} wrap={false}>
            <Component size={'small'} {...props} />
            <Component {...props} />
            <Component size={'large'} {...props} />
            <Component size={'xlarge'} {...props} />
          </Box>
          <Text size={'small'} color={'Basic600'} margin={{ top: 'small' }}>
            {title}
          </Text>
        </Box>
      );
    },
    direction: 'row',
    items: [
      {
        Component: UserIcon,
        title: '<UserIcon/>',
      },
      {
        Component: CalendarIcon,
        title: '<CalendarIcon/>',
      },
      {
        Component: UpIcon,
        title: '<UpIcon/>',
      },
      {
        Component: DownIcon,
        title: '<DownIcon/>',
      },
      {
        Component: TimeIcon,
        title: '<TimeIcon/>',
      },
      {
        Component: RightIcon,
        title: '<RightIcon/>',
      },
      {
        Component: LeftIcon,
        title: '<LeftIcon/>',
      },
      {
        Component: RightLarge,
        title: '<RightLarge/>',
      },
      {
        Component: DownloadIcon,
        title: '<DownloadIcon/>',
      },
      {
        Component: CloseIcon,
        title: '<CloseIcon/>',
      },
      {
        Component: CheckIcon,
        title: '<CheckIcon/>',
      },
      {
        Component: DocumentIcon,
        title: '<DocumentIcon/>',
      },
    ],
  },
];

const propsToString = ({ text, ...props }: any) =>
  Object.keys(props)
    .map(key => `${key}={${JSON.stringify(props[key], null, 4)}}`)
    .join(' ');

const RenderConfig = (props: any) => {
  return (
    <Box margin={{ top: 'large' }}>
      <Box direction="row" justify="center" margin={{ vertical: 'small' }} border="top">
        <Heading color={'grey'}>{props.name}</Heading>
      </Box>
      <Box justify={'between'} direction={props.direction} wrap={true}>
        {props.items.map(({ text, ...args }: any, index: number) => {
          return (
            <Box key={index} border="bottom" margin={'small'} alignSelf={'start'}>
              <props.component key={index} {...args}>
                {text}
                {` <${props.name} ${propsToString(args)}/>`}
              </props.component>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export const Components: React.FunctionComponent<any> = () => (
  <Box margin={'large'}>
    {DEMO_CONFIG.map(props => (
      <RenderConfig key={props.name} {...props} />
    ))}
  </Box>
);
