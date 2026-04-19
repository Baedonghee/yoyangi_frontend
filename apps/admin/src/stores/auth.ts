import { atom, selector } from 'recoil';
import { IMe } from 'types/me';

interface IAuthState {
  token: string;
  user: IMe | null;
  loading: boolean;
}

const authAtom = atom<IAuthState>({
  key: 'authState',
  default: {
    token: '',
    user: null,
    loading: true,
  },
});

const authUserSelector = selector<IMe | null>({
  key: 'authUserSelector',
  get: ({ get }) => {
    const { user } = get(authAtom);
    return user;
  },
});

export { authAtom, authUserSelector };
