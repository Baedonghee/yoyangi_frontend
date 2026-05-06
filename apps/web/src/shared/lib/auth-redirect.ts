type ContinueQuery = {
  continue?: string | string[];
  continue_url?: string | string[];
};

const CONTINUE_QUERY_KEY = "continue";

export function createLoginUrl(continuePath?: string) {
  if (typeof window === "undefined" && !continuePath) {
    return "/login";
  }

  const nextPath = normalizeContinuePath(continuePath ?? getCurrentPath());

  if (!nextPath) {
    return "/login";
  }

  const params = new URLSearchParams({
    [CONTINUE_QUERY_KEY]: nextPath,
  });

  return `/login?${params.toString()}`;
}

export function redirectToLogin(continuePath?: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = createLoginUrl(continuePath);
}

export function createAuthSwitchHref(path: string, continuePath?: string) {
  const nextPath = normalizeContinuePath(continuePath);

  if (!nextPath) {
    return path;
  }

  const params = new URLSearchParams({
    [CONTINUE_QUERY_KEY]: nextPath,
  });

  return `${path}?${params.toString()}`;
}

export function getContinuePathFromQuery(query: ContinueQuery) {
  return normalizeContinuePath(
    getQueryValue(query.continue) ?? getQueryValue(query.continue_url),
  );
}

export function normalizeContinuePath(value?: string | null) {
  const path = value?.trim();

  if (!path) {
    return undefined;
  }

  if (path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }

  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const url = new URL(path, window.location.origin);

    if (url.origin !== window.location.origin) {
      return undefined;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
