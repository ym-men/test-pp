import * as React from 'react';
import { Text, Box } from 'grommet';
import { Entities } from '../../../../../entities';
import TUser = Entities.TUser;
import { UserIcon } from '../../../ui';
import * as style from './User.styl';

export const User: React.FunctionComponent<IProps> = ({ user, onLogout }) => {
  return (
    <Box className={style.user} align="center">
      {user && (
        <div id="user-box-logout" className={style.wrapper} onClick={onLogout}>
          <UserIcon />
          {user.displayName ? (
            <Text size="medium" margin={{ right: 'xsmall' }}>
              {user.displayName}
            </Text>
          ) : (
            <>
              <Text size="medium" margin={{ left: 'xsmall', right: 'xsmall' }}>
                {user.name}
              </Text>
              <Text size="medium" margin={{ right: 'xsmall' }}>
                {user.surName}
              </Text>
            </>
          )}
        </div>
      )}
    </Box>
  );
};

interface IProps {
  user: TUser;
  onLogout: () => void;
}
