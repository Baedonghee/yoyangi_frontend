import { AxiosResponse } from 'axios';
import { useSetRecoilState } from 'recoil';
import { authAtom } from 'stores/auth';
import { IAccessToken, ILoginForm } from 'types/auth';
import { IApi } from 'types/common';
import axios from 'utils/axios';

function useAuthActions() {
  const setUser = useSetRecoilState(authAtom);
  async function login(formData: ILoginForm) {
    try {
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<IAccessToken>> = await axios.post('/v1/auth/login', formData);
      if (status === 200) {
        // recoil 상태 업데이트
        window.localStorage.setItem('token', data.accessToken);
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function logout() {
    try {
      await axios.post('/v1/auth/logout');
      window.localStorage.removeItem('token');
      setUser({
        token: '',
        user: null,
        loading: false,
      });
    } catch (err) {
      throw err;
    }
  }

  return { login, logout };
}

export default useAuthActions;
