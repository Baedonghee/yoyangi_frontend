import { ICode } from 'types/common';

export interface IAdmin {
  memberId: string;
  email: string;
  profile: {
    // 프로필 정보
    name: string;
    mobile: string;
    position: string;
  };
  property: {
    // 속성정보
    valid: ICode;
  };
  authorities: ICode[];
  createdAt: string;
}

export interface IAdminForm {
  email: string;
  password: string | null;
  name: string;
  mobile: string;
  position: string;
  memo: string;
  authorities: string[];
}

export interface IAdminDetail {
  memberId: string;
  email: string;
  profile: {
    // 관리자 프로필 정보
    name: string;
    mobile: string;
    position: string;
  };
  property: {
    // 관리자 속성
    valid: ICode;
  };
  memo: string;
  authorities: ICode[];
  createdAt: string;
}
