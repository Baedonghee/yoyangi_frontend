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
  | "grid"
  | "list"
  | "chevron-down"
  | "chevron-up"
  | "arrow-left"
  | "arrow-right"
  | "play"
  | "star"
  | "chat"
  | "phone"
  | "users"
  | "check"
  | "x"
  | "upload"
  | "tree"
  | "chef"
  | "droplets"
  | "bath"
  | "wind"
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
  imageUrls?: string[];
  href: string;
  badge: string;
  consultationLabel: string;
  isLiked?: boolean;
  likeCount?: number;
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
  careYoutubeItems: VideoItem[];
  regionalFacilities: RegionItem[];
};
