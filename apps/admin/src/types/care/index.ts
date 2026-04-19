import { ICode, IPageQuery } from 'types/common';

export interface ICareQuery extends IPageQuery {
  query?: string;
  name?: string;
  code?: string;
}

export interface ICare {
  residenceId: string;
  code: string;
  name: string;
  type: {
    // 유형 정보
    code: string;
    name: string;
  };
  address: {
    // 주소 정보
    zipcode: string;
    address: string;
    phoneNumber: string | null;
  };
  creator: string;
  createdAt: string;
  rating: {
    // 평가 정보
    grade: string;
    score: number;
  };
}

export interface ICareForm {
  code: string;
  name: string;
  zipcode: string;
  address: string;
  phoneNumber: string;
  designationDate: string;
  installingDate: string;
  capacity: number;
  ratingScore?: number;
  ratingGrade?: string;
}

export interface ICareDetail {
  residenceId: string;
  code: string;
  name: string;
  type: ICode;
  address: {
    // 요양원 주소
    zipcode: string;
    address: string;
    phoneNumber: string;
  };
  rating: {
    // 요양원 등급
    grade: string;
    score: number;
    date: string;
  };
  capacity: number; // 총원
  date: {
    // 날짜 정보
    designationDate: string;
    installingDate: string;
  };
  creator: string;
  createdAt: string;
}

export interface ICareTotal {
  total: number;
  p1: number;
  p2: number;
  p3: number;
  basic: number;
  expiring: number;
}
