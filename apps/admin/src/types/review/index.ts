import { ICode } from 'types/common';

export interface IReview {
  reviewId: string;
  content: string;
  score: number;
  status: ICode;
  imageUrl: string | null;
  creator: string;
  residence: {
    code: string;
    name: string;
    residenceId: string;
  };
  createdAt: string;
}
