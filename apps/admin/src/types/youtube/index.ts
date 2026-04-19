import { IPageQuery } from 'types/common';

export interface IYoutube {
  youtubeId: string;
  title: string;
  url: string;
  order: number;
  status: string;
  creator: string;
  createdAt: string;
}

export interface IYoutubeQuery extends IPageQuery {
  name?: string;
  sort?: string;
}

export interface IYoutubeForm {
  title: string;
  url: string;
}

export interface IYoutubeDetail {
  title: string;
  url: string;
  status: string;
}

export interface IYoutubeOrderForm {
  youtubeId: string;
  order: number;
}
