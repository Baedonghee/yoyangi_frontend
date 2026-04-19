import { atom, selector } from 'recoil';
import { IAdmin } from 'types/admin';
import { IPage } from 'types/common';

interface IAdminState {
  list: IAdmin[];
  page: IPage | null;
}

const adminAtom = atom<IAdminState>({
  key: 'adminState',
  default: {
    list: [],
    page: null,
  },
});

const adminListSelector = selector<IAdmin[]>({
  key: 'adminListSelector',
  get: ({ get }) => {
    const { list } = get(adminAtom);
    return list;
  },
});

const adminPageSelector = selector<IPage | null>({
  key: 'adminPageSelector',
  get: ({ get }) => {
    const { page } = get(adminAtom);
    return page;
  },
});

export { adminAtom, adminListSelector, adminPageSelector };
