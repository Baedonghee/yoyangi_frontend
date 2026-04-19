import { useEffect } from 'react';
import { useMeActions } from 'actions/me-actions';
import { useRecoilState } from 'recoil';
import { authAtom } from 'stores/auth';
import { setToken } from 'utils/axios';

// 회원 인증 로직
const useAuth = () => {
  const { me } = useMeActions();
  const [user, setUser] = useRecoilState(authAtom);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
          await me();
        } else {
          setUser({
            token: '',
            user: null,
            loading: false,
          });
          setToken('');
        }
      } catch {
        // 실패시 로그아웃 처리
        setUser({
          token: '',
          user: null,
          loading: false,
        });
        setToken('');
      }
    };
    if (!user.user) {
      fetchMe();
    }
  }, []);

  return [user.user, user.loading];
};

export default useAuth;
