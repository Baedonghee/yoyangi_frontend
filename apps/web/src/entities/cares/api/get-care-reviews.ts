import { fetchServerApi } from "@/shared/api/server-api";
import type {
  CareReview,
  CareReviewPage,
  CareReviewsData,
} from "@/entities/cares/model/detail-types";

type ApiDataListResponse<TData, TList> = {
  status: number;
  message: string;
  data: TData | null;
  list: TList;
  page: CareReviewPage | null;
};

const emptyReviews: CareReviewsData = {
  myReview: null,
  list: [],
  page: null,
};

export async function getCareReviews(id: string, page = 1, token?: string) {
  const authorizationHeader: HeadersInit | undefined = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;
  const response = await fetchServerApi<
    ApiDataListResponse<CareReview, CareReview[]>
  >(`/api/v1/residences/${encodeURIComponent(id)}/reviews?page=${page}`, {
    debugLabel: "care-reviews",
    fallbackData: {
      status: 500,
      message: "fallback",
      data: null,
      list: [],
      page: null,
    },
    headers: authorizationHeader,
  });

  if (response.status !== 200) {
    return emptyReviews;
  }

  return {
    myReview: response.data ?? null,
    list: response.list ?? [],
    page: response.page ?? null,
  };
}
