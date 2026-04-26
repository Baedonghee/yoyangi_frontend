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

export type CarePageData = {
  listings: CarePageListing[];
  regions: CareRegion[];
  totalItems: number;
  initialThemeCodes: string[];
  initialRegionIds: string[];
  debugResponses: {
    plans: unknown;
    normal: unknown;
    regions: unknown;
  } | null;
};
