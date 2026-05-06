import type { ParsedUrlQuery } from "querystring";

import { fetchServerApi } from "@/shared/api/server-api";
import type {
  CarePageData,
  CarePageListing,
  CareRegion,
} from "@/entities/cares/model/types";
import {
  type CaresQueryState,
  getCaresQueryState,
} from "@/entities/cares/model/query-state";

type ApiPage = {
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
};

type ApiListResponse<T> = {
  status: number;
  message: string;
  list: T;
  page?: ApiPage | null;
};

type ApiCode = {
  code: string;
  name: string;
};

type ApiCareActivity = {
  isLiked?: boolean;
};

type ApiCareCount = {
  like?: number;
};

type ApiPlanCare = {
  residenceId: string;
  name: string;
  comment?: string;
  address?: {
    address?: string;
    phoneNumber?: string;
    region1?: string;
    region2?: string;
  };
  activity?: ApiCareActivity;
  count?: ApiCareCount;
  type?: string;
  themes?: ApiCode[];
  imageUrls?: string[];
};

type ApiNormalCare = {
  residenceId: string;
  name: string;
  address?: {
    region1?: string;
    region2?: string;
    address?: string;
    phoneNumber?: string;
  };
  activity?: ApiCareActivity;
  count?: ApiCareCount;
};

type ApiRegion = {
  name: string;
  subs: Array<{
    regionId: string;
    name: string;
  }>;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&h=640&fit=crop";

const gridPageSize = 6;
const listPageSize = 5;

const defaultRegions: CareRegion[] = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
].map((name) => ({ name, subs: [] }));

const themeCodeToLabel: Record<string, string> = {
  RE: "종교시설",
  PR: "프리미엄",
  EC: "경제적인",
  NU: "간호특화",
  CK: "직영조리",
  RH: "재활치료",
  LA: "인력가산",
  PG: "프로그램",
  DT: "도심인접",
  WK: "산책/텃밭",
};

const UI_STATE_QUERY_KEYS = new Set([
  "themes",
  "regionIds",
  "view",
  "page",
  "size",
]);

function toSingleQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.join(",");
  }

  return value;
}

function buildApiPath(
  path: string,
  query: ParsedUrlQuery,
  queryState: CaresQueryState,
  page: number,
  size: number,
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    const queryValue = toSingleQueryValue(value);

    if (!UI_STATE_QUERY_KEYS.has(key) && queryValue) {
      params.set(key, queryValue);
    }
  });

  if (queryState.themeCodes.length) {
    params.set("themes", queryState.themeCodes.join(","));
  }

  if (queryState.regionIds.length) {
    params.set("regionIds", queryState.regionIds.join(","));
  }

  params.set("page", String(page));
  params.set("size", String(size));

  return `${path}?${params.toString()}`;
}

function getItemsPerPage(queryState: CaresQueryState) {
  return queryState.viewMode === "list" ? listPageSize : gridPageSize;
}

function getFallbackPlanPage(requestedPage: number, totalPages: number) {
  if (totalPages <= 0) {
    return 1;
  }

  return ((requestedPage - 1) % totalPages) + 1;
}

function getPaginationTotalPages(...pages: Array<ApiPage | null | undefined>) {
  const page = pages.find(
    (item) =>
      typeof item?.totalPages === "number" &&
      Number.isFinite(item.totalPages) &&
      item.totalPages > 0,
  );

  return page?.totalPages ?? 1;
}

function getFallbackListResponse<T>(): ApiListResponse<T[]> {
  return {
    status: 500,
    message: "fallback",
    list: [],
    page: null,
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function mapPlanCare(item: ApiPlanCare): CarePageListing {
  const themes = item.themes ?? [];
  const themeNames = themes.map((theme) => theme.name);
  const themeLabels = themes.map(
    (theme) => themeCodeToLabel[theme.code] ?? theme.name,
  );
  const categories = uniqueStrings([...themeNames, ...themeLabels]);
  const keywords = uniqueStrings(themeLabels).slice(0, 3);

  return {
    id: item.residenceId,
    name: item.name,
    comment: item.comment?.trim() || null,
    categories,
    region:
      [item.address?.region1, item.address?.region2]
        .filter(Boolean)
        .join(" ") || "지역 정보 없음",
    establishmentType: item.type || "전체",
    grade: "전체",
    rating: 0,
    reviews: item.count?.like ?? 0,
    isLiked: Boolean(item.activity?.isLiked),
    likeCount: item.count?.like ?? 0,
    isPremium: true,
    images: item.imageUrls?.length ? item.imageUrls : [fallbackImage],
    keywords: keywords.length ? keywords : ["상담 가능"],
    badge: categories.includes("프리미엄") ? "추천" : null,
    phone: item.address?.phoneNumber ?? null,
  };
}

function mapNormalCare(item: ApiNormalCare): CarePageListing {
  return {
    id: item.residenceId,
    name: item.name,
    comment: null,
    categories: [],
    region:
      [item.address?.region1, item.address?.region2]
        .filter(Boolean)
        .join(" ") || "지역 정보 없음",
    establishmentType: "전체",
    grade: "전체",
    rating: 0,
    reviews: item.count?.like ?? 0,
    isLiked: Boolean(item.activity?.isLiked),
    likeCount: item.count?.like ?? 0,
    isPremium: false,
    images: [],
    keywords: ["일반 시설"],
    badge: null,
    phone: item.address?.phoneNumber ?? null,
  };
}

export async function getCaresPageData(
  query: ParsedUrlQuery,
  token?: string,
): Promise<CarePageData> {
  const queryState = getCaresQueryState(query);
  const itemsPerPage = getItemsPerPage(queryState);
  const authorizationHeader: HeadersInit | undefined = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;
  const [planResponse, normalResponse, regionResponse] = await Promise.all([
    fetchServerApi<ApiListResponse<ApiPlanCare[]>>(
      buildApiPath(
        "/api/v1/residences/plans",
        query,
        queryState,
        queryState.page,
        itemsPerPage,
      ),
      {
        debugLabel: "cares-plans",
        fallbackData: getFallbackListResponse<ApiPlanCare>(),
        headers: authorizationHeader,
      },
    ),
    fetchServerApi<ApiListResponse<ApiNormalCare[]>>(
      buildApiPath(
        "/api/v1/residences",
        query,
        queryState,
        queryState.page,
        itemsPerPage,
      ),
      {
        debugLabel: "cares-normal",
        fallbackData: getFallbackListResponse<ApiNormalCare>(),
        headers: authorizationHeader,
      },
    ),
    fetchServerApi<ApiListResponse<ApiRegion[]>>("/api/v1/app/regions", {
      debugLabel: "cares-regions",
      fallbackData: {
        status: 500,
        message: "fallback",
        list: [],
        page: null,
      },
    }),
  ]);

  let effectivePlanResponse = planResponse;
  let fallbackPlanResponse: ApiListResponse<ApiPlanCare[]> | null = null;
  const planTotalPages = planResponse.page?.totalPages ?? 0;

  if (
    planResponse.status === 200 &&
    planResponse.list.length === 0 &&
    planTotalPages > 0 &&
    queryState.page > planTotalPages
  ) {
    const fallbackPage = getFallbackPlanPage(queryState.page, planTotalPages);

    fallbackPlanResponse = await fetchServerApi<ApiListResponse<ApiPlanCare[]>>(
      buildApiPath(
        "/api/v1/residences/plans",
        query,
        queryState,
        fallbackPage,
        itemsPerPage,
      ),
      {
        debugLabel: "cares-plans-fallback",
        fallbackData: getFallbackListResponse<ApiPlanCare>(),
        headers: authorizationHeader,
      },
    );

    if (fallbackPlanResponse.status === 200) {
      effectivePlanResponse = fallbackPlanResponse;
    }
  }

  const planList =
    effectivePlanResponse.status === 200 ? effectivePlanResponse.list : [];
  const normalList = normalResponse.status === 200 ? normalResponse.list : [];
  const apiRegions = regionResponse.status === 200 ? regionResponse.list : [];
  const regions: CareRegion[] = apiRegions.length
    ? apiRegions.map((region) => ({
        name: region.name,
        subs: region.subs ?? [],
      }))
    : defaultRegions;

  return {
    listings: [...planList.map(mapPlanCare), ...normalList.map(mapNormalCare)],
    regions,
    totalItems:
      (planResponse.page?.totalItems ?? planList.length) +
      (normalResponse.page?.totalItems ?? normalList.length),
    paginationTotalPages: getPaginationTotalPages(
      normalResponse.page,
      planResponse.page,
      effectivePlanResponse.page,
    ),
    initialThemeCodes: queryState.themeCodes,
    initialRegionIds: queryState.regionIds,
    initialViewMode: queryState.viewMode,
    initialPage: queryState.page,
    debugResponses:
      process.env.NODE_ENV !== "production"
        ? {
            plans: fallbackPlanResponse
              ? {
                  initial: planResponse,
                  fallback: fallbackPlanResponse,
                  effective: effectivePlanResponse,
                }
              : planResponse,
            normal: normalResponse,
            regions: regionResponse,
          }
        : null,
  };
}
