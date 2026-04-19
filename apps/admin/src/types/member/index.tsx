import { ICode, IPageQuery } from 'types/common';

export interface IMember {
  memberId: string;
  email: string;
  profile: {
    // 프로필 정보
    name: string;
    mobile: string;
  };
  property: {
    // 속성 정보
    valid: ICode;
  };
  createdAt: string;
}

export interface IMemberQuery extends IPageQuery {
  name?: string;
  email?: string;
  valid?: string;
  today?: string;
}
