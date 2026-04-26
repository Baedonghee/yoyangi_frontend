import { siteConfig } from "@/shared/config/site";

type ServerApiOptions<T> = RequestInit & {
  fallbackData: T;
  debugLabel?: string;
};

export async function fetchServerApi<T>(
  path: string,
  options: ServerApiOptions<T>
): Promise<T> {
  const { fallbackData, debugLabel, ...init } = options;
  const baseUrl = siteConfig.serverApiBaseUrl;
  const shouldLog = process.env.NODE_ENV !== "production";

  if (!baseUrl) {
    if (shouldLog && debugLabel) {
      console.log(`[home-api:${debugLabel}] base url missing, using fallback`, fallbackData);
    }
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

    const data = (await response.json()) as T;

    if (shouldLog && debugLabel) {
      console.log(`[home-api:${debugLabel}]`, {
        path,
        baseUrl,
        data
      });
    }

    return data;
  } catch (error) {
    if (shouldLog && debugLabel) {
      console.log(`[home-api:${debugLabel}] request failed, using fallback`, {
        path,
        baseUrl,
        error: error instanceof Error ? error.message : String(error),
        fallbackData
      });
    }
    return fallbackData;
  }
}
