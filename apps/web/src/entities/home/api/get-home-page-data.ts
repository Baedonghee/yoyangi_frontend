import { fetchServerApi } from "@/shared/api/server-api";
import {
  homeCategories,
  mockHomePageData,
  mockRecommendedFacilities
} from "@/entities/home/model/mock-data";
import type {
  HeroBanner,
  HomePageData,
  RegionItem,
  RecommendedFacility
} from "@/entities/home/model/types";

type ApiListResponse<T> = {
  status: number;
  message: string;
  list: T;
};

type BannerApiItem = {
  bannerId: string;
  title?: string;
  description?: string;
  linkUrl: string;
  images: Array<{
    type: string;
    imageUrl: string;
  }>;
};

type YoutubeApiItem = {
  youtubeId: string;
  title: string;
  url: string;
};

type RegionApiItem = {
  name: string;
  subs: Array<{
    regionId: string;
    name: string;
  }>;
};

type RecommendApiItem = {
  residenceId: string;
  name: string;
  comment: string;
  imageUrl: string;
};

const regionOrder = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "세종",
  "대전",
  "경북",
  "대구",
  "울산",
  "경남",
  "부산",
  "전북",
  "전남",
  "광주",
  "제주"
];

const regionImages: Record<string, string> = {
  서울: "/image/region/seoul.jpg",
  경기: "/image/region/gyeonggi.jpg",
  인천: "/image/region/incheon.jpg",
  강원: "/image/region/gangwon.jpg",
  충북: "/image/region/chungbuk.jpg",
  충남: "/image/region/chungnam.jpg",
  세종: "/image/region/sejong.jpg",
  대전: "/image/region/daejeon.jpg",
  경북: "/image/region/gyeongbuk.jpg",
  대구: "/image/region/daegu.jpg",
  울산: "/image/region/ulsan.jpg",
  경남: "/image/region/gyeongnam.jpg",
  부산: "/image/region/busan.jpg",
  전북: "/image/region/jeonbuk.jpg",
  전남: "/image/region/jeonnam.jpg",
  광주: "/image/region/gwangju.jpg",
  제주: "/image/region/jeju.jpg"
};

function unwrapApiList<T>(
  response: ApiListResponse<T> | null | undefined,
  fallback: T
): T {
  if (!response || response.status !== 200) {
    return fallback;
  }

  return response.list;
}

function toInternalHref(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (/yoyangi\.com$/i.test(parsedUrl.hostname) || /yoyangi\.co\.kr$/i.test(parsedUrl.hostname)) {
      return parsedUrl.pathname + parsedUrl.search;
    }

    return url;
  } catch {
    return url || "/";
  }
}

function findBannerImage(
  images: BannerApiItem["images"],
  matcher: (type: string) => boolean
) {
  return images.find((image) => matcher(image.type.trim().toUpperCase()))?.imageUrl;
}

function isPcBannerType(type: string) {
  return type === "PC" || type === "DESKTOP" || type === "WEB";
}

function isMobileBannerType(type: string) {
  return (
    type === "MOBILE" ||
    type === "MO" ||
    type === "APP" ||
    type.includes("MOBILE") ||
    type.startsWith("MO_") ||
    type.endsWith("_MO")
  );
}

function mapBanners(list: BannerApiItem[]): HeroBanner[] {
  return list.map((banner, index) => {
    const pcImage =
      findBannerImage(banner.images, isPcBannerType) ||
      banner.images[0]?.imageUrl ||
      mockHomePageData.heroBanners[index]?.imageUrl ||
      "";
    const mobileImage =
      findBannerImage(banner.images, isMobileBannerType) ||
      banner.images.find((image) => image.imageUrl !== pcImage)?.imageUrl ||
      undefined;

    return {
      id: banner.bannerId,
      title: banner.title || mockHomePageData.heroBanners[index]?.title || "요양이 메인 배너",
      description:
        banner.description ||
        mockHomePageData.heroBanners[index]?.description ||
        "요양시설을 빠르게 찾고 비교할 수 있는 메인 추천 배너입니다.",
      imageUrl: pcImage,
      mobileImageUrl: mobileImage,
      href: toInternalHref(banner.linkUrl),
      ctaLabel: mockHomePageData.heroBanners[index]?.ctaLabel || "자세히 보기"
    };
  });
}

function extractYoutubeId(url: string) {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^?&/]+)/);

  return match?.[1] ?? "";
}

function toYoutubeEmbedUrl(youtubeId: string) {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

function mapRegions(list: RegionApiItem[]): RegionItem[] {
  const sorted = regionOrder
    .map((name) => list.find((region) => region.name === name))
    .filter((region): region is RegionApiItem => Boolean(region));

  return sorted.map((region) => ({
    id: region.name,
    title: region.name,
    summary: `${region.name}권 시설 찾아보기`,
    imageUrl: regionImages[region.name] ?? "/image/region/seoul.jpg",
    href: `/cares?regionIds=${region.subs.map((sub) => sub.regionId).join(",")}`
  }));
}

export async function getHomePageData(): Promise<HomePageData> {
  const [bannerResponse, youtubeResponse, regionResponse] = await Promise.all([
    fetchServerApi<ApiListResponse<BannerApiItem[]>>("/api/v1/app/banners?location=L1", {
      debugLabel: "banners",
      fallbackData: {
        status: 500,
        message: "fallback",
        list: []
      }
    }),
    fetchServerApi<ApiListResponse<YoutubeApiItem[]>>("/api/v1/youtubes", {
      debugLabel: "youtubes",
      fallbackData: {
        status: 500,
        message: "fallback",
        list: []
      }
    }),
    fetchServerApi<ApiListResponse<RegionApiItem[]>>("/api/v1/app/regions", {
      debugLabel: "regions",
      fallbackData: {
        status: 500,
        message: "fallback",
        list: []
      }
    })
  ]);

  const banners = unwrapApiList(bannerResponse, []);
  const youtubes = unwrapApiList(youtubeResponse, []);
  const regions = unwrapApiList(regionResponse, []);

  const heroBanners = banners.length ? mapBanners(banners) : mockHomePageData.heroBanners;
  const tvItems = youtubes.length
    ? youtubes
        .map<HomePageData["tvItems"][number] | null>((item) => {
          const youtubeId = extractYoutubeId(item.url);

          if (!youtubeId) {
            return null;
          }

          return {
            id: item.youtubeId,
            title: item.title,
            views: "요양이 TV",
            imageUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
            href: `https://www.youtube.com/watch?v=${youtubeId}`,
            embedUrl: toYoutubeEmbedUrl(youtubeId)
          };
        })
        .filter((item): item is HomePageData["tvItems"][number] => Boolean(item))
    : mockHomePageData.tvItems;

  const regionalFacilities = regions.length
    ? mapRegions(regions)
    : mockHomePageData.regionalFacilities;

  return {
    ...mockHomePageData,
    seo: {
      ...mockHomePageData.seo,
      ogImage: heroBanners[0]?.imageUrl || mockHomePageData.seo.ogImage
    },
    heroBanners,
    categories: homeCategories,
    tvItems,
    regionalFacilities
  };
}

export async function getRecommendedFacilities(): Promise<RecommendedFacility[]> {
  const response = await fetchServerApi<ApiListResponse<RecommendApiItem[]>>(
    "/api/v1/residences/recommend",
    {
      debugLabel: "recommended",
      fallbackData: {
        status: 500,
        message: "fallback",
        list: []
      }
    }
  );

  const list = unwrapApiList(response, []);

  if (!list.length) {
    return mockRecommendedFacilities;
  }

  return list.map((item) => ({
    id: item.residenceId,
    name: item.name,
    location: item.comment,
    rating: 0,
    imageUrl: item.imageUrl,
    href: `/facility/${item.residenceId}`,
    badge: "추천",
    consultationLabel: "상담 가능"
  }));
}
