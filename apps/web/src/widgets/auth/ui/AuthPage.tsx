import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { createKakaoAuthorizeUrl } from "@/entities/auth/api/kakao-auth";
import styles from "@/widgets/auth/ui/AuthPage.module.css";

type AuthPageMode = "login" | "signup";

const authCopy = {
  login: {
    title: "환영합니다!",
    lead: "요양이입니다",
    description: (
      <>
        아이디와 비밀번호 입력하기 귀찮으시죠?
        <br />
        계정과 비밀번호 입력없이
        <br />
        <strong>카카오톡으로 로그인</strong> 해 보세요.
      </>
    ),
    buttonLabel: "카카오 로그인",
    switchText: "아직 계정이 없으신가요?",
    switchHref: "/signup",
    switchLabel: "회원가입"
  },
  signup: {
    title: "요양이 시작하기",
    lead: "가입은 카카오톡으로 간편하게",
    description: (
      <>
        복잡한 입력 없이 카카오 계정으로
        <br />
        빠르게 회원가입하고
        <br />
        <strong>맞춤 요양시설</strong>을 찾아보세요.
      </>
    ),
    buttonLabel: "카카오로 회원가입",
    switchText: "이미 계정이 있으신가요?",
    switchHref: "/login",
    switchLabel: "로그인"
  }
} as const;

export function AuthPage({ mode }: { mode: AuthPageMode }) {
  const router = useRouter();
  const copy = authCopy[mode];
  const pageTitle = `${copy.switchLabel === "로그인" ? "회원가입" : "로그인"} | 요양이`;
  const continueUrl = getQueryValue(router.query.continue_url);
  const switchHref = continueUrl
    ? `${copy.switchHref}?continue_url=${encodeURIComponent(continueUrl)}`
    : copy.switchHref;

  const handleKakaoClick = () => {
    window.location.href = createKakaoAuthorizeUrl(mode, continueUrl);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="요양이 카카오 계정으로 간편하게 시작하세요."
        />
      </Head>
      <main className={styles.page}>
        <section className={styles.panel} aria-labelledby="auth-title">
          <Link href="/" className={styles.logoLink} aria-label="요양이 홈으로 이동">
            <Image
              src="/image/logo.png"
              alt="요양이 로고"
              width={396}
              height={220}
              priority
              className={styles.logo}
            />
          </Link>

          <div className={styles.message}>
            <h1 id="auth-title">{copy.title}</h1>
            <p className={styles.lead}>{copy.lead}</p>
            <p className={styles.description}>{copy.description}</p>
          </div>

          <button
            type="button"
            className={styles.kakaoButton}
            onClick={handleKakaoClick}
          >
            <KakaoIcon />
            {copy.buttonLabel}
          </button>

          <p className={styles.switchText}>
            {copy.switchText}{" "}
            <Link href={switchHref}>{copy.switchLabel}</Link>
          </p>
        </section>
      </main>
    </>
  );
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#3c1e1e"
        d="M24 7C13.5 7 5 13.7 5 22c0 5.3 3.5 10 8.7 12.6l-1.8 6.5c-.2.7.6 1.2 1.2.8l7.8-5.1c1 .1 2 .2 3.1.2 10.5 0 19-6.7 19-15S34.5 7 24 7Z"
      />
    </svg>
  );
}
