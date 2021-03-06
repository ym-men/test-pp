import * as React from 'react';
import { StyledIcon } from 'grommet-icons/StyledIcon';

export const ClockIcon = (props: any) => {
  return (
    <StyledIcon viewBox="-1 -1 20 20" a11yTitle="UserIcon" {...props}>
      <path
        d="M8 0v.004c2.212 0 4.212.895 5.657 2.34a7.97 7.97 0 0 1 2.339 5.655H16V8h-.004a7.97 7.97 0 0 1-2.34 5.657 7.969 7.969 0 0 1-5.654 2.339V16H8v-.004a7.97 7.97 0 0 1-5.657-2.34A7.972 7.972 0 0 1 .004 8.001H0V8h.004a7.97 7.97 0 0 1 2.34-5.656A7.974 7.974 0 0 1 7.998.004V0H8zm.908 7.104V3.576a.89.89 0 0 0-.887-.888h-.029a.89.89 0 0 0-.886.888v5.32h4.947a.89.89 0 0 0 .888-.887v-.018a.89.89 0 0 0-.888-.887H8.908z"
        fillRule="nonzero"
      />
    </StyledIcon>
  );
};
