export type HomeIconName =
  | "home"
  | "map-pin"
  | "building"
  | "user-plus"
  | "heart"
  | "stethoscope"
  | "bed"
  | "plus"
  | "calendar"
  | "shield"
  | "search"
  | "arrow-left"
  | "arrow-right"
  | "play"
  | "star"
  | "chat"
  | "youtube"
  | "blog"
  | "RE"
  | "PR"
  | "EC"
  | "NU"
  | "CK"
  | "RH"
  | "LA"
  | "PG"
  | "DT"
  | "WK";

export type ToneName =
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "teal"
  | "pink"
  | "yellow"
  | "indigo"
  | "rose"
  | "gray";

export type HeroBanner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string;
  href: string;
  ctaLabel: string;
};

export type HomeCategory = {
  id: string;
  label: string;
  href: string;
  icon: HomeIconName;
  tone: ToneName;
};

export type VideoItem = {
  id: string;
  title: string;
  views: string;
  imageUrl: string;
  href: string;
  embedUrl?: string;
};

export type RegionItem = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  href: string;
};

export type RecommendedFacility = {
  id: string;
  name: string;
  location: string;
  rating?: number;
  imageUrl: string;
  href: string;
  badge: string;
  consultationLabel: string;
};

export type HomeSeo = {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  ogImage: string;
};

export type HomePageData = {
  seo: HomeSeo;
  heroBanners: HeroBanner[];
  categories: HomeCategory[];
  tvItems: VideoItem[];
  regionalFacilities: RegionItem[];
};
