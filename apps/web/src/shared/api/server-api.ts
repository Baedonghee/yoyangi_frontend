import { siteConfig } from "@/shared/config/site";

type ServerApiOptions<T> = RequestInit & {
  fallbackData: T;
};

export async function fetchServerApi<T>(
  path: string,
  options: ServerApiOptions<T>
): Promise<T> {
  const { fallbackData, ...init } = options;
  const baseUrl = siteConfig.serverApiBaseUrl;

  if (!baseUrl) {
    return fallbackData;
  }

  try {
    const response = await fetch(new URL(path, baseUrl), {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init.headers ?? {})
      }
    });

    if (!response.ok) {
      throw new Error(`Server API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallbackData;
  }
}

