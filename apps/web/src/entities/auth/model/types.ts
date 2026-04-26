export type SocialAuthProvider = "kakao";

export type AuthMode = "login" | "signup";

export type SocialAuthForm = {
  type: SocialAuthProvider;
  accessToken: string;
};

export type AuthTokenPayload = {
  accessToken: string;
};

export type ApiResponse<T> = {
  status: number;
  message?: string;
  data?: T;
};

export type UserPayload = {
  memberId: number;
  email: string;
  profile: {
    name: string;
  };
  authorization?: {
    accessToken: string;
  };
  createdAt: string;
};
