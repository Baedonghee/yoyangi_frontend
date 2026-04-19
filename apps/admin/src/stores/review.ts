import { atom, selector } from 'recoil';
import { IPage } from 'types/common';
import { IReview } from 'types/review';

interface IReviewState {
  list: IReview[];
  page: IPage | null;
}

const reviewAtom = atom<IReviewState>({
  key: 'reviewState',
  default: {
    list: [],
    page: null,
  },
});

const reviewListSelector = selector<IReview[]>({
  key: 'reviewListSelector',
  get: ({ get }) => {
    const { list } = get(reviewAtom);
    return list;
  },
});

const reviewPageSelector = selector<IPage | null>({
  key: 'reviewPageSelector',
  get: ({ get }) => {
    const { page } = get(reviewAtom);
    return page;
  },
});

export { reviewAtom, reviewListSelector, reviewPageSelector };
