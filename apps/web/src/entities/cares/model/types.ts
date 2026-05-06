export type CarePageListing = {
  id: string;
  name: string;
  comment: string | null;
  categories: string[];
  region: string;
  establishmentType: string;
  grade: string;
  rating: number;
  reviews: number;
  isLiked: boolean;
  likeCount: number;
  isPremium: boolean;
  images: string[];
  keywords: string[];
  badge: string | null;
  phone: string | null;
};

export type CareRegionSub = {
  regionId: string;
  name: string;
};

export type CareRegion = {
  name: string;
  subs: CareRegionSub[];
};

export type CareViewMode = "grid" | "list";

export type CarePageData = {
  listings: CarePageListing[];
  regions: CareRegion[];
  totalItems: number;
  paginationTotalPages: number;
  initialThemeCodes: string[];
  initialRegionIds: string[];
  initialViewMode: CareViewMode;
  initialPage: number;
  debugResponses: {
    plans: unknown;
    normal: unknown;
    regions: unknown;
  } | null;
};
