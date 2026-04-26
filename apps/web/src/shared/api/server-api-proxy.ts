import { siteConfig } from "@/shared/config/site";

export async function requestServerApi(path: string, init?: RequestInit) {
  const baseUrl =
    process.env.YOYANGI_SERVER_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    siteConfig.serverApiBaseUrl;

  return fetch(new URL(path, baseUrl), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {})
    }
  });
}

export async function parseServerApiJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {
      status: response.status,
      message: "서버 응답을 읽을 수 없습니다."
    };
  }
}
