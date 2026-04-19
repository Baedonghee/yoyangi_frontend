import { atom, selector } from 'recoil';
import { IPage } from 'types/common';
import { IMember } from 'types/member';

interface IMemberState {
  list: IMember[];
  page: IPage | null;
}

const memberAtom = atom<IMemberState>({
  key: 'memberState',
  default: {
    list: [],
    page: null,
  },
});

const memberListSelector = selector<IMember[]>({
  key: 'memberListSelector',
  get: ({ get }) => {
    const { list } = get(memberAtom);
    return list;
  },
});

const memberPageSelector = selector<IPage | null>({
  key: 'memberPageSelector',
  get: ({ get }) => {
    const { page } = get(memberAtom);
    return page;
  },
});

export { memberAtom, memberListSelector, memberPageSelector };
