import { atom, selector } from 'recoil';
import { IPage } from 'types/common';
import { IPremium } from 'types/premium';

interface IPremiumState {
  list: IPremium[];
  page: IPage | null;
}

const premiumAtom = atom<IPremiumState>({
  key: 'premiumState',
  default: {
    list: [],
    page: null,
  },
});

const premiumListSelector = selector<IPremium[]>({
  key: 'premiumListSelector',
  get: ({ get }) => {
    const { list } = get(premiumAtom);
    return list;
  },
});

const premiumPageSelector = selector<IPage | null>({
  key: 'premiumPageSelector',
  get: ({ get }) => {
    const { page } = get(premiumAtom);
    return page;
  },
});

export { premiumAtom, premiumListSelector, premiumPageSelector };
