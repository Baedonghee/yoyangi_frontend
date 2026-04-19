import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import styles from "./placeholder.module.css";

const routeMap = {
  signup: {
    title: "회원가입",
    description: "회원가입 흐름이 들어갈 자리입니다."
  },
  search: {
    title: "검색 결과",
    description: "검색 결과 화면이 들어갈 자리입니다."
  },
  login: {
    title: "로그인",
    description: "로그인 화면이 들어갈 자리입니다."
  },
  guide: {
    title: "요양 가이드",
    description: "요양 가이드 목록이 들어갈 자리입니다."
  },
  notice: {
    title: "공지사항",
    description: "공지사항 목록이 들어갈 자리입니다."
  },
  privacy: {
    title: "개인정보처리방침",
    description: "개인정보처리방침 페이지가 들어갈 자리입니다."
  },
  terms: {
    title: "이용약관",
    description: "이용약관 페이지가 들어갈 자리입니다."
  },
  discover: {
    title: "둘러보기",
    description: "시설 탐색 화면이 들어갈 자리입니다."
  },
  profile: {
    title: "프로필",
    description: "프로필 관리 화면이 들어갈 자리입니다."
  },
  partner: {
    title: "입점문의",
    description: "시설 입점 및 제휴 문의 페이지가 들어갈 자리입니다."
  },
  recommended: {
    title: "요양이 추천시설",
    description: "추천시설 전체 목록으로 확장될 페이지입니다."
  },
  facilities: {
    title: "추천시설",
    description: "추천시설 전체 목록으로 확장될 페이지입니다."
  },
  tv: {
    title: "요양이 TV",
    description: "영상 콘텐츠 전체 목록으로 확장될 페이지입니다."
  },
  regions: {
    title: "지역별 시설",
    description: "지역별 시설 탐색 페이지가 들어갈 자리입니다."
  },
  counsel: {
    title: "상담하기",
    description: "상담 전환 페이지가 들어갈 자리입니다."
  },
  youtube: {
    title: "유튜브 바로가기",
    description: "외부 유튜브 연결 전용 랜딩으로 연결될 자리입니다."
  },
  blog: {
    title: "블로그 바로가기",
    description: "외부 블로그 연결 전용 랜딩으로 연결될 자리입니다."
  }
} as const;

type RouteSlug = keyof typeof routeMap;

type PlaceholderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(routeMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: PlaceholderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = routeMap[slug as RouteSlug];

  if (!page) {
    return {};
  }

  return {
    title: `요양이 | ${page.title}`,
    description: page.description
  };
}

export default async function PlaceholderPage({ params }: PlaceholderPageProps) {
  const { slug } = await params;
  const page = routeMap[slug as RouteSlug];

  if (!page) {
    notFound();
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>COMING SOON</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <Link href="/" className={styles.link}>
          메인으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
