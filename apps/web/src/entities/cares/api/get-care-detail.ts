import { fetchServerApi } from "@/shared/api/server-api";
import type { CareDetail } from "@/entities/cares/model/detail-types";

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
};

export async function getCareDetail(id: string, token?: string) {
  const authorizationHeader: HeadersInit | undefined = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;
  const response = await fetchServerApi<ApiResponse<CareDetail>>(
    `/api/v1/residences/${encodeURIComponent(id)}`,
    {
      debugLabel: "care-detail",
      fallbackData: {
        status: 500,
        message: "fallback",
        data: null
      },
      headers: authorizationHeader
    }
  );

  return response.status === 200 ? response.data : null;
}
