import { fetchServerApi } from "@/shared/api/server-api";
import {
  mockHomePageData,
  mockRecommendedFacilities
} from "@/entities/home/model/mock-data";
import type {
  HomePageData,
  RecommendedFacility
} from "@/entities/home/model/types";

export async function getHomePageData(): Promise<HomePageData> {
  return fetchServerApi<HomePageData>("/home", {
    fallbackData: mockHomePageData
  });
}

export async function getRecommendedFacilities(): Promise<RecommendedFacility[]> {
  return fetchServerApi<RecommendedFacility[]>("/home/recommended", {
    fallbackData: mockRecommendedFacilities
  });
}
