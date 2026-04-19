import { ICode } from 'types/common';

export interface IMe {
  memberId: number;
  email: string;
  profile: {
    name: string;
    mobile: string;
  };
  property: {
    role: ICode;
  };
  authorization: {
    accessToken: string;
  };
  authorities: ICode[];
  createdAt: string;
}
