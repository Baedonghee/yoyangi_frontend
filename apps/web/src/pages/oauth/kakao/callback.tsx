import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import type { AuthMode } from "@/entities/auth/model/types";
import {
  getKakaoAccessToken,
  loginWithKakaoAccessToken,
  requestMe,
  signupWithKakaoAccessToken
} from "@/entities/auth/api/kakao-auth";
import { normalizeContinuePath } from "@/shared/lib/auth-redirect";
import styles from "@/widgets/auth/ui/AuthPage.module.css";

const KakaoCallbackPage: NextPage & { noChrome?: boolean } = () => {
  const router = useRouter();
  const [message, setMessage] = useState("카카오 인증을 확인하고 있습니다.");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const code = getQueryValue(router.query.code);
    const mode = getAuthMode(router.query.mode);
    const continueUrl = getQueryValue(router.query.state);

    if (!code) {
      setMessage("카카오 인증 코드가 없습니다.");
      return;
    }

    void authenticate(code, mode, continueUrl);
  }, [router.isReady, router.query.code, router.query.mode, router.query.state]);

  async function authenticate(code: string, mode: AuthMode, continueUrl?: string) {
    try {
      const kakaoAccessToken = await getKakaoAccessToken(code, mode);
      const accessToken =
        mode === "login"
          ? await loginOrSignup(kakaoAccessToken)
          : await signupOrLogin(kakaoAccessToken);
      const nextPath = normalizeContinuePath(continueUrl);

      await requestMe(accessToken);
      await router.replace(nextPath || "/");
    } catch (error) {
      console.error("[kakao-auth]", error);
      setMessage(
        mode === "login"
          ? "카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요."
          : "카카오 회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  }

  return (
    <>
      <Head>
        <title>카카오 인증 처리 | 요양이</title>
      </Head>
      <main className={styles.page}>
        <section className={styles.callbackPanel} aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <h1>카카오 인증 처리 중</h1>
          <p>{message}</p>
        </section>
      </main>
    </>
  );
};

KakaoCallbackPage.noChrome = true;

export default KakaoCallbackPage;

async function loginOrSignup(kakaoAccessToken: string) {
  const loginToken = await loginWithKakaoAccessToken(kakaoAccessToken);

  if (loginToken) {
    return loginToken;
  }

  const signupToken = await signupWithKakaoAccessToken(kakaoAccessToken);

  if (signupToken) {
    return signupToken;
  }

  throw new Error("카카오 로그인 처리에 실패했습니다.");
}

async function signupOrLogin(kakaoAccessToken: string) {
  const signupToken = await signupWithKakaoAccessToken(kakaoAccessToken);

  if (signupToken) {
    return signupToken;
  }

  const loginToken = await loginWithKakaoAccessToken(kakaoAccessToken);

  if (loginToken) {
    return loginToken;
  }

  throw new Error("카카오 회원가입 처리에 실패했습니다.");
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getAuthMode(value: string | string[] | undefined): AuthMode {
  return getQueryValue(value) === "signup" ? "signup" : "login";
}
