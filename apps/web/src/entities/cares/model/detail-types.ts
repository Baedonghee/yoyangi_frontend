export type CareDetailCode = {
  code: string;
  name: string;
};

export type CareDetail = {
  residenceId: string;
  code: string;
  name: string;
  address: {
    zipcode?: string;
    address?: string;
    phoneNumber?: string;
  };
  rating?: {
    grade?: string;
    score?: number;
  };
  activity?: {
    isLiked?: boolean;
  };
  count?: {
    like?: number;
  };
  capacity?: number;
  date?: {
    designationDate?: string;
    installingDate?: string;
  };
  plan?: {
    comment?: string;
    explain?: string;
    mealAmount?: number;
    snackAmount?: number;
    address?: {
      address1?: string;
      address2?: string;
      latitude?: number;
      longitude?: number;
      phoneNumber?: string;
    };
    services?: CareDetailCode[];
    youtubeUrls?: string[];
    imageUrls?: string[];
  };
};

export type CareReviewStatus = {
  code: string;
  name: string;
};

export type CareReview = {
  reviewId: string;
  content: string;
  score: number;
  createdAt: string;
  imageUrl?: string | null;
  status?: CareReviewStatus | null;
};

export type CareReviewPage = {
  offsetTime?: number;
  page?: number;
  currentPage?: number;
  size?: number;
  totalItems: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};

export type CareReviewsData = {
  myReview: CareReview | null;
  list: CareReview[];
  page: CareReviewPage | null;
};
