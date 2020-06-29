import * as React from 'react';
import * as styles from './Steps.styl';
import * as cn from 'classnames';
import { Box, BoxProps } from 'grommet';

export const Steps: React.FunctionComponent<IProps> = ({
  className,
  selected,
  onSelectStep,
  options,
  ...rest
}) => {
  const myClassName = cn(styles.steps, className);
  return (
    <Box className={myClassName} {...rest}>
      {options.map((props, index) => (
        <Step key={props.id} {...{ ...props, selected, onSelectStep, index }} />
      ))}
    </Box>
  );
};

const Step: React.FunctionComponent<IStepProps> = ({
  index,
  selected,
  id,
  text,
  onSelectStep,
  disabled,
  className,
}) => {
  const isActive = String(selected) === String(id);
  const myClassName = cn(styles.step, className, {
    [styles.first]: index === 0,
    [styles.disabled]: disabled,
    [styles.selected]: isActive,
  });
  // const onClick = () => disabled || onSelectStep && onSelectStep(id);

  return (
    <Box className={myClassName} direction="row">
      <Box className={styles.leftStep}>{id}</Box>
      <Box className={styles.rightStep}>{text}</Box>
    </Box>
  );
};

interface IStepProps extends IOption {
  index: number;
  selected: string | number;
  onSelectStep?: (id: string | number) => void;
  className?: string;
}

interface IProps extends BoxProps {
  options: Array<IOption>;
  selected: string | number;
  onSelectStep?: (id: string | number) => void;
  className?: string;
}

interface IOption {
  id: string | number;
  text?: string | React.ReactNode;
  className?: string;
  disabled?: boolean;
}
