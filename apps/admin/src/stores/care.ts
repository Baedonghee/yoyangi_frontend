import { atom, selector } from 'recoil';
import { ICare } from 'types/care';
import { IPage } from 'types/common';

interface ICareState {
  list: ICare[];
  page: IPage | null;
}

const careAtom = atom<ICareState>({
  key: 'careState',
  default: {
    list: [],
    page: null,
  },
});

const careListSelector = selector<ICare[]>({
  key: 'careListSelector',
  get: ({ get }) => {
    const { list } = get(careAtom);
    return list;
  },
});

const carePageSelector = selector<IPage | null>({
  key: 'carePageSelector',
  get: ({ get }) => {
    const { page } = get(careAtom);
    return page;
  },
});

export { careAtom, careListSelector, carePageSelector };
