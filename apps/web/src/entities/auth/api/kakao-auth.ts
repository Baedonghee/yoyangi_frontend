import type {
  ApiResponse,
  AuthMode,
  AuthTokenPayload,
  SocialAuthForm,
  UserPayload
} from "@/entities/auth/model/types";

type KakaoTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "";
const KAKAO_REDIRECT_URL = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL ?? "";

export function createKakaoRedirectUri(mode: AuthMode) {
  const fallbackUrl =
    typeof window === "undefined"
      ? "/oauth/kakao/callback"
      : `${window.location.origin}/oauth/kakao/callback`;
  const redirectUrl = KAKAO_REDIRECT_URL || fallbackUrl;
  const url = new URL(redirectUrl, typeof window === "undefined" ? undefined : window.location.origin);

  url.searchParams.set("mode", mode);

  return url.toString();
}

export function createKakaoAuthorizeUrl(mode: AuthMode, continueUrl?: string) {
  const url = new URL(KAKAO_AUTH_URL);

  url.searchParams.set("client_id", KAKAO_REST_API_KEY);
  url.searchParams.set("redirect_uri", createKakaoRedirectUri(mode));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("lang", "ko");

  if (continueUrl) {
    url.searchParams.set("state", continueUrl);
  }

  return url.toString();
}

export async function getKakaoAccessToken(code: string, mode: AuthMode) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: createKakaoRedirectUri(mode),
    code
  });

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    body
  });
  const data = (await response.json()) as KakaoTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "카카오 토큰 발급에 실패했습니다.");
  }

  return data.access_token;
}

export async function loginWithKakaoAccessToken(accessToken: string) {
  const response = await postJson<ApiResponse<AuthTokenPayload>>(
    "/api/auth/social/login",
    {
      type: "kakao",
      accessToken
    }
  );

  if (response.status === 200 && response.data?.accessToken) {
    return response.data.accessToken;
  }

  if (response.status === 403) {
    return null;
  }

  throw new Error(response.message || "카카오 로그인에 실패했습니다.");
}

export async function signupWithKakaoAccessToken(accessToken: string) {
  const response = await postJson<ApiResponse<AuthTokenPayload>>(
    "/api/me/social/join",
    {
      type: "kakao",
      accessToken
    }
  );

  if (response.status === 200 && response.data?.accessToken) {
    return response.data.accessToken;
  }

  if (response.status === 400) {
    return null;
  }

  throw new Error(response.message || "카카오 회원가입에 실패했습니다.");
}

export async function requestMe(accessToken: string) {
  const response = await fetch("/api/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = (await response.json()) as ApiResponse<UserPayload>;

  if (data.status !== 200 || !data.data) {
    throw new Error(data.message || "로그인 정보 확인에 실패했습니다.");
  }

  return data.data;
}

export async function requestCurrentUser() {
  const response = await fetch("/api/me", {
    method: "GET",
    credentials: "same-origin"
  });

  if (response.status === 401) {
    return null;
  }

  const data = (await response.json()) as ApiResponse<UserPayload>;

  if (data.status !== 200 || !data.data) {
    return null;
  }

  return data.data;
}

export async function logoutCurrentUser() {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "same-origin"
  });
}

async function postJson<T>(url: string, body: SocialAuthForm): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return (await response.json()) as T;
}
