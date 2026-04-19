import { AxiosResponse } from 'axios';
import { useSetRecoilState } from 'recoil';
import { authAtom } from 'stores/auth';
import { IApi } from 'types/common';
import { IMe } from 'types/me';
import axios, { setToken } from 'utils/axios';

function useMeActions() {
  const setUser = useSetRecoilState(authAtom);

  async function me() {
    try {
      const accessToken = window.localStorage.getItem('token');
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<IMe>> = await axios.get('/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (status === 200) {
        setToken(accessToken!);
        setUser({
          token: accessToken!,
          user: {
            ...data,
          },
          loading: false,
        });
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { me };
}

export { useMeActions };
