import { PATH } from './path';

interface SideMenuList {
  title: string;
  code?: string;
  name?: string;
  path?: string;
  list?: SideMenuList[];
}

export const sideMenuLis: SideMenuList[] = [
  {
    title: '회원',
    name: 'member',
    code: 'A1',
    list: [
      {
        title: '회원 목록',
        path: PATH.MEMBER_LIST,
      },
    ],
  },
  {
    title: '요양원',
    name: 'care',
    code: 'A2',
    list: [
      {
        title: '일반 요양원 목록',
        path: PATH.CARE_LIST,
      },
      {
        title: '일반 요양원 등록',
        path: PATH.CARE_ADD,
      },
    ],
  },
  {
    title: '프리미엄',
    name: 'premium',
    code: 'A3',
    list: [
      {
        title: '프리미엄 요양원 목록',
        path: PATH.PREMIUM_LIST,
      },
      {
        title: '프리미엄 요양원 등록',
        path: PATH.PREMIUM_ADD,
      },
    ],
  },
  {
    title: '요양이TV',
    name: 'youtube',
    code: 'A4',
    list: [
      {
        title: '요양이TV 목록',
        path: PATH.YOUTUBE_LIST,
      },
      {
        title: '요양이TV 등록',
        path: PATH.YOUTUBE_ADD,
      },
    ],
  },
  {
    title: '요양여지도',
    name: 'care-youtube',
    code: 'A8',
    list: [
      {
        title: '요양여지도 목록',
        path: PATH.CARE_YOUTUBE_LIST,
      },
      {
        title: '요양여지도 등록',
        path: PATH.CARE_YOUTUBE_ADD,
      },
    ],
  },
  {
    title: '배너',
    name: 'banner',
    code: 'A5',
    list: [
      {
        title: '배너 목록',
        path: PATH.BANNER_LIST,
      },
      {
        title: '배너 등록',
        path: PATH.BANNER_ADD,
      },
    ],
  },
  {
    title: '리뷰',
    name: 'review',
    code: 'A7',
    list: [
      {
        title: '리뷰 목록',
        path: PATH.REVIEW_LIST,
      },
    ],
  },
  {
    title: '관리자',
    name: 'admin',
    code: 'A6',
    list: [
      {
        title: '관리자 목록',
        path: PATH.ADMIN_LIST,
      },
      {
        title: '관리자 등록',
        path: PATH.ADMIN_ADD,
      },
    ],
  },
];
