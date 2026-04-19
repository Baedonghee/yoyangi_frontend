import { atom, selector } from 'recoil';
import { IBanner } from 'types/banner';
import { IPage } from 'types/common';

interface IBannerState {
  list: IBanner[];
  page: IPage | null;
}

const bannerAtom = atom<IBannerState>({
  key: 'bannerState',
  default: {
    list: [],
    page: null,
  },
});

const bannerListSelector = selector<IBanner[]>({
  key: 'bannerListSelector',
  get: ({ get }) => {
    const { list } = get(bannerAtom);
    return list;
  },
});

const bannerPageSelector = selector<IPage | null>({
  key: 'bannerPageSelector',
  get: ({ get }) => {
    const { page } = get(bannerAtom);
    return page;
  },
});

export { bannerAtom, bannerListSelector, bannerPageSelector };
