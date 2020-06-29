import { dropToken, get as requestGet, post, saveToken, getUrl } from '../utils';
import { Entities } from '../../../entities';

export namespace user {
  import TUser = Entities.TUser;
  import TToken = Entities.TToken;

  function remapUser(userData: any) {
    return {
      ...userData,
      id: userData.personId,
      name: userData.firstName,
      surName: userData.lastName,
      role: userData.businessRoles[0],
    };
  }

  export function get(): Promise<TUser> {
    const url = getUrl('USER_INFO');

    return requestGet<TUser>(url).then(remapUser);
  }

  export function login(userName: string, password: string): Promise<TUser> {
    const url = getUrl('AUTH_TOKEN');

    return post<TToken>(url, { username: userName, password, grant_type: 'password' })
      .then(saveToken)
      .then(get);
  }

  export function logout(): Promise<void> {
    return Promise.resolve().then(dropToken);
  }
}
