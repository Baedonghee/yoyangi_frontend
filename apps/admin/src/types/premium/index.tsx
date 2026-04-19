import { ICode, IPageQuery, IRegion } from 'types/common';

export interface IPremium {
  residenceId: string;
  code: string;
  name: string;
  type: ICode;
  plan: ICode;
  startDate: string;
  endDate: string;
  creator: string;
  createdAt: string;
  valid: string;
}

export interface IPremiumQuery extends IPageQuery {
  code?: string;
  name?: string;
  type?: string;
  plan?: string;
  startDate?: string;
  endDate?: string;
  expiring?: string;
}

export interface IPremiumDetail {
  residenceId: string;
  code: string;
  name: string;
  comment: string;
  explain: string;
  capacity: number;
  mealAmount: number;
  snackAmount: number;
  type: ICode;
  plan: {
    // 요금제 정보
    type: ICode;
    startDate: string;
    endDate: string;
  };
  address: {
    // 주소정보
    zipcode: string;
    address1: string;
    address2: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
  };
  regions: IRegion[];
  themes: ICode[];
  services: ICode[];
  youtubeUrls: string[];
  imageUrls: string[];
  creator: string;
  createdAt: string;
  valid: string;
}

export interface IPremiumForm {
  residenceId: string;
  plan: {
    code: string;
    startDate: string;
    endDate: string;
  };
  address: {
    zipcode: string;
    address1: string;
    address2: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
  };
  comment: string;
  explain: string;
  capacity: number;
  mealAmount: number;
  snackAmount: number;
  regions: string[];
  themes: string[];
  services: string[];
  youtubeUrls: string[];
  imageIds: string[];
}
