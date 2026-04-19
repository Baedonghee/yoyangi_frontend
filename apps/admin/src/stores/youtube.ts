import { atom, selector } from 'recoil';
import { IPage } from 'types/common';
import { IYoutube } from 'types/youtube';

interface IYoutubeState {
  list: IYoutube[];
  page: IPage | null;
}

const youtubeAtom = atom<IYoutubeState>({
  key: 'youtubeState',
  default: {
    list: [],
    page: null,
  },
});

const youtubeListSelector = selector<IYoutube[]>({
  key: 'youtubeListSelector',
  get: ({ get }) => {
    const { list } = get(youtubeAtom);
    return list;
  },
});

const youtubePageSelector = selector<IPage | null>({
  key: 'youtubePageSelector',
  get: ({ get }) => {
    const { page } = get(youtubeAtom);
    return page;
  },
});

export { youtubeAtom, youtubeListSelector, youtubePageSelector };
