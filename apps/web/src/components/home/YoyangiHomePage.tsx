"use client";

import Link from "next/link";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState
} from "react";
import type { CSSProperties } from "react";

import styles from "./YoyangiHomePage.module.css";

type IconName =
  | "spark"
  | "crown"
  | "pulse"
  | "city"
  | "shield"
  | "leaf"
  | "sun"
  | "home"
  | "search"
  | "user"
  | "arrow-left"
  | "arrow-right"
  | "chat"
  | "play"
  | "blog";

type Category = {
  slug: string;
  label: string;
  caption: string;
  icon: IconName;
};

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  background: string;
  accent: string;
};

type ShowcaseItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badge: string;
  categories: string[];
  background: string;
  accent: string;
};

type CardVariant = "facility" | "video" | "region";

type RailSectionProps = {
  id: string;
  title: string;
  href: string;
  items: ShowcaseItem[];
  variant: CardVariant;
};

type ActionLink = {
  href: string;
  label: string;
  icon: IconName;
};

type CustomStyle = CSSProperties & {
  "--card-background"?: string;
  "--card-accent"?: string;
};

const categories: Category[] = [
  {
    slug: "all",
    label: "전체",
    caption: "조건을 넓게 보고 지금 인기 있는 시설을 빠르게 훑어봅니다.",
    icon: "spark"
  },
  {
    slug: "premium",
    label: "프리미엄",
    caption: "공간 퀄리티와 응대 경험을 우선으로 보는 분들께 맞춥니다.",
    icon: "crown"
  },
  {
    slug: "rehab",
    label: "재활특화",
    caption: "물리치료, 회복 프로그램, 전문 케어 강점을 중심으로 추립니다.",
    icon: "pulse"
  },
  {
    slug: "city",
    label: "도심형",
    caption: "접근성 좋은 핵심 상권과 생활 인프라 중심으로 보여줍니다.",
    icon: "city"
  },
  {
    slug: "safe",
    label: "집중케어",
    caption: "24시간 모니터링과 안전 설비 비중이 높은 시설 중심입니다.",
    icon: "shield"
  },
  {
    slug: "nature",
    label: "자연형",
    caption: "정원과 산책 동선이 좋은 조용한 입지를 우선으로 담았습니다.",
    icon: "leaf"
  },
  {
    slug: "daycare",
    label: "주야간보호",
    caption: "낮 시간 중심 서비스와 통원 편의성을 함께 비교합니다.",
    icon: "sun"
  },
  {
    slug: "visit",
    label: "방문요양",
    caption: "시설형이 아닌 방문 돌봄 연계 서비스까지 함께 엮어 보여줍니다.",
    icon: "home"
  }
];

const heroSlides: HeroSlide[] = [
  {
    id: "hero-premium",
    eyebrow: "오늘의 추천",
    title: "도심 안에서도 차분한 프리미엄 케어",
    description:
      "라운지형 공용 공간, 전문 상담 동선, 가족 방문 경험까지 한 화면에서 비교하도록 설계했습니다.",
    summary: "서울 강남권 인기 프리미엄 시설 12곳 큐레이션",
    ctaLabel: "추천 시설 보기",
    ctaHref: "/facilities",
    background:
      "linear-gradient(135deg, rgba(7, 23, 49, 0.92) 0%, rgba(19, 55, 111, 0.85) 46%, rgba(204, 166, 107, 0.72) 100%)",
    accent: "#d7b074"
  },
  {
    id: "hero-rehab",
    eyebrow: "회복 프로그램",
    title: "재활 루틴이 잘 잡힌 회복형 시설",
    description:
      "물리치료, 운동 재활, 생활 보조 인력 구성을 중심으로 가족이 묻는 핵심만 먼저 보여줍니다.",
    summary: "주 5일 프로그램 운영 시설과 회복 동선 정리",
    ctaLabel: "재활 시설 둘러보기",
    ctaHref: "/regions",
    background:
      "linear-gradient(135deg, rgba(12, 42, 42, 0.94) 0%, rgba(31, 102, 89, 0.85) 45%, rgba(156, 208, 180, 0.72) 100%)",
    accent: "#8ec7a6"
  },
  {
    id: "hero-consult",
    eyebrow: "입점 상담",
    title: "시설 소개부터 유튜브 연결까지 한 번에",
    description:
      "상담 버튼, 영상 연결, 배너 노출 구조를 동시에 반영해 마케팅 흐름이 자연스럽게 이어지게 만들었습니다.",
    summary: "메인 노출, 영상 섹션, 지역 노출까지 통합 구성",
    ctaLabel: "입점 문의하기",
    ctaHref: "/partner",
    background:
      "linear-gradient(135deg, rgba(37, 22, 70, 0.93) 0%, rgba(76, 40, 118, 0.84) 50%, rgba(228, 176, 216, 0.72) 100%)",
    accent: "#e0afd2"
  }
];

const recommendedFacilities: ShowcaseItem[] = [
  {
    id: "facility-1",
    title: "메이플 실버 라운지",
    subtitle: "서울 서초구 · 가족 방문 라운지형",
    meta: "상담 24시간 · 간호 인력 12명",
    badge: "프리미엄",
    categories: ["all", "premium", "city", "safe"],
    background:
      "linear-gradient(180deg, rgba(10, 38, 82, 0.16), rgba(10, 38, 82, 0.78)), linear-gradient(135deg, #dbe7ff 0%, #8db1e8 45%, #38588e 100%)",
    accent: "#e1b866"
  },
  {
    id: "facility-2",
    title: "청담 회복케어 하우스",
    subtitle: "서울 강남구 · 재활 프로그램 특화",
    meta: "물리치료실 · 회복식 맞춤 제공",
    badge: "재활특화",
    categories: ["all", "rehab", "premium", "city"],
    background:
      "linear-gradient(180deg, rgba(23, 53, 53, 0.14), rgba(23, 53, 53, 0.8)), linear-gradient(135deg, #d8f4e9 0%, #8fd0b5 50%, #2c6f5e 100%)",
    accent: "#7ed0ab"
  },
  {
    id: "facility-3",
    title: "남산 정원 요양원",
    subtitle: "서울 중구 · 산책 정원 보유",
    meta: "산책 코스 · 일광 휴게실 운영",
    badge: "자연형",
    categories: ["all", "nature", "safe"],
    background:
      "linear-gradient(180deg, rgba(22, 38, 30, 0.16), rgba(22, 38, 30, 0.82)), linear-gradient(135deg, #eef7d4 0%, #b4d08e 45%, #547146 100%)",
    accent: "#c9e18e"
  },
  {
    id: "facility-4",
    title: "한강 브리즈 케어센터",
    subtitle: "서울 영등포구 · 접근성 우수",
    meta: "지하철 도보 4분 · 보호자 대기 공간",
    badge: "도심형",
    categories: ["all", "city", "daycare"],
    background:
      "linear-gradient(180deg, rgba(22, 40, 61, 0.16), rgba(22, 40, 61, 0.82)), linear-gradient(135deg, #dfe7f3 0%, #93aacb 42%, #45617e 100%)",
    accent: "#91b0d5"
  },
  {
    id: "facility-5",
    title: "미래 안심케어 센터",
    subtitle: "인천 연수구 · 집중 관찰형",
    meta: "야간 모니터링 · 낙상 감지 시스템",
    badge: "집중케어",
    categories: ["all", "safe", "premium"],
    background:
      "linear-gradient(180deg, rgba(28, 37, 73, 0.12), rgba(28, 37, 73, 0.82)), linear-gradient(135deg, #ebe8ff 0%, #9f9ce8 46%, #4e4b98 100%)",
    accent: "#beb9ff"
  },
  {
    id: "facility-6",
    title: "햇살 데이케어 라운지",
    subtitle: "수원 영통구 · 주야간보호",
    meta: "통원 차량 · 낮 시간 프로그램 8종",
    badge: "주야간보호",
    categories: ["all", "daycare", "city"],
    background:
      "linear-gradient(180deg, rgba(66, 41, 15, 0.12), rgba(66, 41, 15, 0.82)), linear-gradient(135deg, #fff1d8 0%, #efb36e 46%, #8f531f 100%)",
    accent: "#f4c07c"
  }
];

const tvItems: ShowcaseItem[] = [
  {
    id: "tv-1",
    title: "처음 상담할 때 꼭 물어봐야 할 7가지",
    subtitle: "시설 방문 전 체크리스트",
    meta: "8분 12초 · 요양이 TV",
    badge: "가이드",
    categories: ["all", "premium", "safe", "city"],
    background:
      "linear-gradient(180deg, rgba(8, 20, 40, 0.18), rgba(8, 20, 40, 0.82)), linear-gradient(135deg, #ddf0ff 0%, #98bcf9 45%, #37559b 100%)",
    accent: "#98c4ff"
  },
  {
    id: "tv-2",
    title: "재활 시설 비교, 치료실은 어떻게 봐야 할까",
    subtitle: "전문 인력과 프로그램 해설",
    meta: "11분 03초 · 요양이 TV",
    badge: "재활특화",
    categories: ["all", "rehab", "safe"],
    background:
      "linear-gradient(180deg, rgba(10, 31, 23, 0.18), rgba(10, 31, 23, 0.82)), linear-gradient(135deg, #dff8ea 0%, #82d0af 45%, #2f7e62 100%)",
    accent: "#94e0bf"
  },
  {
    id: "tv-3",
    title: "도심형 시설, 주차와 방문 동선 정리",
    subtitle: "가족 방문이 편한 곳을 고르는 법",
    meta: "6분 41초 · 요양이 TV",
    badge: "도심형",
    categories: ["all", "city", "premium"],
    background:
      "linear-gradient(180deg, rgba(26, 34, 51, 0.2), rgba(26, 34, 51, 0.82)), linear-gradient(135deg, #ebeef8 0%, #a8b7d8 44%, #4d5e85 100%)",
    accent: "#c8d4f4"
  },
  {
    id: "tv-4",
    title: "주야간보호 센터 실제 하루 루틴",
    subtitle: "통원형 서비스의 장단점 설명",
    meta: "9분 28초 · 요양이 TV",
    badge: "주야간보호",
    categories: ["all", "daycare", "visit"],
    background:
      "linear-gradient(180deg, rgba(63, 38, 14, 0.2), rgba(63, 38, 14, 0.84)), linear-gradient(135deg, #fff3d9 0%, #e8b776 46%, #956022 100%)",
    accent: "#f0cd95"
  }
];

const regionalItems: ShowcaseItem[] = [
  {
    id: "region-1",
    title: "서울",
    subtitle: "강남, 서초, 송파 중심",
    meta: "도심형 시설 48곳",
    badge: "서울권",
    categories: ["all", "city", "premium", "safe"],
    background:
      "linear-gradient(180deg, rgba(14, 28, 58, 0.18), rgba(14, 28, 58, 0.82)), linear-gradient(135deg, #dae6ff 0%, #8ea8d6 44%, #385181 100%)",
    accent: "#8eb2ee"
  },
  {
    id: "region-2",
    title: "경기",
    subtitle: "분당, 용인, 수원 회복형",
    meta: "재활특화 시설 36곳",
    badge: "경기권",
    categories: ["all", "rehab", "daycare"],
    background:
      "linear-gradient(180deg, rgba(16, 44, 28, 0.18), rgba(16, 44, 28, 0.82)), linear-gradient(135deg, #dff6e7 0%, #86c9a3 46%, #31694f 100%)",
    accent: "#94dfb3"
  },
  {
    id: "region-3",
    title: "인천",
    subtitle: "송도, 청라, 연수구 집중",
    meta: "프리미엄 시설 21곳",
    badge: "인천권",
    categories: ["all", "premium", "safe"],
    background:
      "linear-gradient(180deg, rgba(28, 31, 69, 0.18), rgba(28, 31, 69, 0.84)), linear-gradient(135deg, #ece7ff 0%, #a69adf 46%, #55498c 100%)",
    accent: "#c0b7ff"
  },
  {
    id: "region-4",
    title: "충청",
    subtitle: "자연형 입지와 장기 체류형",
    meta: "자연형 시설 19곳",
    badge: "충청권",
    categories: ["all", "nature", "safe"],
    background:
      "linear-gradient(180deg, rgba(28, 38, 18, 0.18), rgba(28, 38, 18, 0.82)), linear-gradient(135deg, #eef7d5 0%, #b7d58e 42%, #5e7e43 100%)",
    accent: "#c9eba2"
  },
  {
    id: "region-5",
    title: "부산",
    subtitle: "해운대, 수영, 부산진구",
    meta: "도심 접근 시설 17곳",
    badge: "부산권",
    categories: ["all", "city", "premium"],
    background:
      "linear-gradient(180deg, rgba(11, 34, 58, 0.18), rgba(11, 34, 58, 0.84)), linear-gradient(135deg, #d7eef8 0%, #8bc0d3 44%, #32708b 100%)",
    accent: "#9ad9f1"
  }
];

const actionLinks: ActionLink[] = [
  { href: "/counsel", label: "상담하기", icon: "chat" },
  { href: "/youtube", label: "유튜브", icon: "play" },
  { href: "/blog", label: "블로그", icon: "blog" }
];

const defaultCategory: Category =
  categories.find((category) => category.slug === "all") ?? {
    slug: "all",
    label: "전체",
    caption: "조건을 넓게 보고 지금 인기 있는 시설을 빠르게 훑어봅니다.",
    icon: "spark"
  };

function pickItems(items: ShowcaseItem[], category: string, limit: number) {
  if (category === "all") {
    return items.slice(0, limit);
  }

  const preferred = items.filter((item) => item.categories.includes(category));
  const fallback = items.filter((item) => !item.categories.includes(category));

  return [...preferred, ...fallback].slice(0, limit);
}

function IconSymbol({ name }: { name: IconName }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8
  };

  switch (name) {
    case "spark":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m12 3 1.9 4.8L19 9.7l-4.1 2.6L16 17l-4-2.4L8 17l1.1-4.7L5 9.7l5.1-1.9L12 3Z" />
        </svg>
      );
    case "crown":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m3 18 2-10 5 4 2-6 2 6 5-4 2 10H3Z" />
        </svg>
      );
    case "pulse":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M3 12h4l2.3-4.5L13 17l2.2-5H21" />
        </svg>
      );
    case "city":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M4 20V8l5-3v15M14 20V4l6 3v13M8 9h1M8 13h1M17 10h1M17 14h1" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M18 4c-6 1-10 5-11 11 3 2 7 1 10-2 3-3 4-7 1-9Z" />
          <path {...commonProps} d="M7 17c2-2 4-4 7-6" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M12 5v2M12 17v2M5 12H3M21 12h-2M7.5 7.5 6 6M18 18l-1.5-1.5M16.5 7.5 18 6M6 18l1.5-1.5" />
          <circle {...commonProps} cx="12" cy="12" r="4" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m4 11 8-6 8 6" />
          <path {...commonProps} d="M6 10.5V20h12v-9.5" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...commonProps} cx="11" cy="11" r="6" />
          <path {...commonProps} d="m20 20-4.2-4.2" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...commonProps} cx="12" cy="8" r="3.5" />
          <path {...commonProps} d="M5 20c1.7-3 4-4.5 7-4.5S17.3 17 19 20" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m14 6-6 6 6 6" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m10 6 6 6-6 6" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M5 17.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H9l-4 2.5Z" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m9 7 8 5-8 5V7Z" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M6 5h9a3 3 0 0 1 0 6H6V5Zm0 6h10a3.5 3.5 0 1 1 0 7H6v-7Z" />
        </svg>
      );
    default:
      return null;
  }
}

function NavLink({
  href,
  children,
  emphasized = false,
  icon
}: {
  href: string;
  children: string;
  emphasized?: boolean;
  icon?: IconName;
}) {
  return (
    <Link
      href={href}
      className={emphasized ? styles.navLinkPrimary : styles.navLink}
    >
      {icon ? (
        <span className={styles.navIcon}>
          <IconSymbol name={icon} />
        </span>
      ) : null}
      <span>{children}</span>
    </Link>
  );
}

function RailSection({ id, title, href, items, variant }: RailSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function moveRail(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      left: rail.clientWidth * 0.86 * direction,
      behavior: "smooth"
    });
  }

  return (
    <section id={id} className={styles.sectionBlock}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionEyebrow}>CURATED LIST</p>
          <h2>{title}</h2>
        </div>
        <div className={styles.sectionActions}>
          <Link href={href} className={styles.sectionLink}>
            전체보기
          </Link>
          <div className={styles.sectionArrows}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={() => moveRail(-1)}
              aria-label={`${title} 이전 카드`}
            >
              <IconSymbol name="arrow-left" />
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={() => moveRail(1)}
              aria-label={`${title} 다음 카드`}
            >
              <IconSymbol name="arrow-right" />
            </button>
          </div>
        </div>
      </div>
      <div ref={railRef} className={styles.rail}>
        {items.map((item) => {
          const cardStyle: CustomStyle = {
            "--card-background": item.background,
            "--card-accent": item.accent
          };

          return (
            <article
              key={item.id}
              className={`${styles.railCard} ${
                variant === "video"
                  ? styles.videoCard
                  : variant === "region"
                    ? styles.regionCard
                    : styles.facilityCard
              }`}
              style={cardStyle}
            >
              <div className={styles.cardVisual}>
                <span className={styles.cardBadge}>{item.badge}</span>
                {variant === "video" ? (
                  <span className={styles.videoPlayBadge}>
                    <IconSymbol name="play" />
                    재생
                  </span>
                ) : null}
                <span className={styles.cardMetric}>{item.meta}</span>
              </div>
              <div className={styles.cardBody}>
                <p>{item.subtitle}</p>
                <h3>{item.title}</h3>
                <span>{item.meta}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function YoyangiHomePage() {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory.slug);
  const [currentSlide, setCurrentSlide] = useState(0);
  const deferredCategory = useDeferredValue(selectedCategory);

  const activeCategory =
    categories.find((category) => category.slug === selectedCategory) ??
    defaultCategory;

  useEffect(() => {
    const timerId = window.setInterval(() => {
      startTransition(() => {
        setCurrentSlide((previousIndex) => (previousIndex + 1) % heroSlides.length);
      });
    }, 5200);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const featuredFacilities = pickItems(
    recommendedFacilities,
    deferredCategory,
    5
  );
  const featuredTv = pickItems(tvItems, deferredCategory, 4);
  const featuredRegions = pickItems(regionalItems, deferredCategory, 5);

  return (
    <div className={styles.pageShell}>
      <div className={styles.pageAura} />
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="요양이 홈">
          <span className={styles.logoMark}>요</span>
          <div>
            <strong>요양이</strong>
            <span>Care Discovery Platform</span>
          </div>
        </Link>
        <form
          className={styles.headerSearch}
          onSubmit={(event) => event.preventDefault()}
        >
          <span className={styles.searchIcon}>
            <IconSymbol name="search" />
          </span>
          <input
            type="search"
            placeholder="시설명, 지역, 상담 키워드를 검색해보세요"
            aria-label="시설 검색"
          />
        </form>
        <nav className={styles.headerNav}>
          <NavLink href="/signup">회원가입</NavLink>
          <NavLink href="/login">로그인</NavLink>
          <NavLink href="/partner" emphasized icon="user">
            입점문의
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroViewport}>
            <div
              className={styles.heroTrack}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {heroSlides.map((slide) => (
                <article
                  key={slide.id}
                  className={styles.heroSlide}
                  style={
                    {
                      "--card-background": slide.background,
                      "--card-accent": slide.accent
                    } as CustomStyle
                  }
                >
                  <div className={styles.heroCopy}>
                    <span className={styles.heroEyebrow}>{slide.eyebrow}</span>
                    <h1>{slide.title}</h1>
                    <p>{slide.description}</p>
                    <div className={styles.heroActions}>
                      <Link href={slide.ctaHref} className={styles.heroCta}>
                        {slide.ctaLabel}
                      </Link>
                      <span>{slide.summary}</span>
                    </div>
                  </div>
                  <div className={styles.heroVisual}>
                    <div className={styles.heroGlassPanel}>
                      <span className={styles.heroVisualLabel}>Selected Theme</span>
                      <strong>{activeCategory.label}</strong>
                      <p>{activeCategory.caption}</p>
                    </div>
                    <div className={styles.heroMiniCard}>
                      <span>상담 응답 속도</span>
                      <strong>평균 12분</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.heroControls}>
              <div className={styles.heroDots}>
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`${index + 1}번 배너 보기`}
                    aria-pressed={index === currentSlide}
                    className={`${styles.heroDot} ${
                      index === currentSlide ? styles.heroDotActive : ""
                    }`}
                    onClick={() => {
                      startTransition(() => {
                        setCurrentSlide(index);
                      });
                    }}
                  />
                ))}
              </div>
              <div className={styles.heroArrowGroup}>
                <button
                  type="button"
                  className={styles.heroArrow}
                  aria-label="이전 배너"
                  onClick={() => {
                    startTransition(() => {
                      setCurrentSlide(
                        (currentSlide - 1 + heroSlides.length) % heroSlides.length
                      );
                    });
                  }}
                >
                  <IconSymbol name="arrow-left" />
                </button>
                <button
                  type="button"
                  className={styles.heroArrow}
                  aria-label="다음 배너"
                  onClick={() => {
                    startTransition(() => {
                      setCurrentSlide((currentSlide + 1) % heroSlides.length);
                    });
                  }}
                >
                  <IconSymbol name="arrow-right" />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.quickSearch}>
            <form onSubmit={(event) => event.preventDefault()}>
              <span className={styles.searchIcon}>
                <IconSymbol name="search" />
              </span>
              <input
                type="search"
                placeholder={`${activeCategory.label} 기준으로 원하는 시설을 찾아보세요`}
                aria-label="메인 빠른 검색"
              />
              <button type="submit">빠른 찾기</button>
            </form>
          </div>
        </section>

        <section className={styles.categorySection}>
          <div className={styles.sectionHeadingCompact}>
            <div>
              <p className={styles.sectionEyebrow}>PICK YOUR FOCUS</p>
              <h2>관심 카테고리를 먼저 고르세요</h2>
            </div>
            <p>{activeCategory.caption}</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={`${styles.categoryButton} ${
                  category.slug === selectedCategory
                    ? styles.categoryButtonActive
                    : ""
                }`}
                onClick={() => {
                  startTransition(() => {
                    setSelectedCategory(category.slug);
                  });
                }}
              >
                <span className={styles.categoryIcon}>
                  <IconSymbol name={category.icon} />
                </span>
                <strong>{category.label}</strong>
                <span>{category.caption}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.consultBanner}>
          <div>
            <p className={styles.sectionEyebrow}>CONSULTING FLOW</p>
            <h2>유튜브 연결과 상담하기 버튼을 같은 흐름으로 묶었습니다</h2>
            <span>
              메인 진입 후 바로 영상 탐색과 상담 전환이 이어지도록 배치했습니다.
            </span>
          </div>
          <div className={styles.consultActions}>
            <Link href="/youtube" className={styles.consultSecondary}>
              요양이 TV 보기
            </Link>
            <Link href="/counsel" className={styles.consultPrimary}>
              상담하러 가기
            </Link>
          </div>
        </section>

        <RailSection
          id="recommended-facilities"
          title="요양이 추천시설"
          href="/facilities"
          items={featuredFacilities}
          variant="facility"
        />
        <RailSection
          id="yoyangi-tv"
          title="요양이 TV"
          href="/tv"
          items={featuredTv}
          variant="video"
        />
        <RailSection
          id="regional-facilities"
          title="지역별 시설"
          href="/regions"
          items={featuredRegions}
          variant="region"
        />
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>요양이</strong>
          <p>
            가족이 바로 이해할 수 있는 요양 정보 흐름을 만드는 서비스 메인
            디자인입니다.
          </p>
        </div>
        <div className={styles.footerMeta}>
          <span>사업자등록번호 000-00-00000</span>
          <span>서울시 강남구 테헤란로 00, 7F</span>
          <span>contact@yoyangi.co.kr</span>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/partner">입점문의</Link>
          <Link href="/facilities">추천시설</Link>
          <Link href="/tv">요양이 TV</Link>
          <Link href="/blog">블로그</Link>
        </div>
      </footer>

      <aside className={styles.floatingActions}>
        {actionLinks.map((action) => (
          <Link key={action.href} href={action.href} className={styles.floatingAction}>
            <span className={styles.floatingIcon}>
              <IconSymbol name={action.icon} />
            </span>
            <span>{action.label}</span>
          </Link>
        ))}
      </aside>
    </div>
  );
}
