import { ICode, IPageQuery } from 'types/common';

export interface IBanner {
  bannerId: string;
  location: ICode;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  linkUrl: string;
  creator: string;
  createdAt: string;
}

export interface IBannerQuery extends IPageQuery {
  title?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface IBannerForm {
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  linkUrl: string;
  pcFileId: string | null;
  mobileFileId: string | null;
}

export interface IBannerDetail {
  bannerId: string;
  location: ICode;
  title: string;
  startDate: string;
  endDate: string;
  pcImageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
  creator: string;
  createdAt: string;
}
