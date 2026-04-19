import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import styles from "./placeholder.module.css";

type SampleBlock = {
  label: string;
  title: string;
  description: string;
};

type RouteConfig = {
  title: string;
  description: string;
  eyebrow: string;
  heroNote: string;
  ctaLabel: string;
  tags: string[];
  blocks: SampleBlock[];
};

const routeMap = {
  signup: {
    title: "회원가입",
    description: "보호자, 시설 담당자, 일반 회원을 나눠서 가입 흐름을 보여줄 자리입니다.",
    eyebrow: "MEMBERSHIP FLOW",
    heroNote: "가입 유형 선택, 약관 동의, 기본 정보 입력 단계를 샘플로 넣었습니다.",
    ctaLabel: "가입 흐름 보기",
    tags: ["보호자", "시설회원", "간편가입"],
    blocks: [
      {
        label: "STEP 01",
        title: "가입 유형 선택",
        description: "보호자용 / 시설 담당자용 계정을 나눠 첫 진입부터 목적이 분명하게 보이게 구성합니다."
      },
      {
        label: "STEP 02",
        title: "필수 약관 동의",
        description: "개인정보, 마케팅 수신, 상담 연결 관련 약관을 묶어서 관리합니다."
      },
      {
        label: "STEP 03",
        title: "기본 정보 입력",
        description: "이름, 연락처, 관심 지역 같은 초기 추천 데이터를 함께 받도록 설계합니다."
      }
    ]
  },
  search: {
    title: "검색 결과",
    description: "지역, 서비스 유형, 상담 가능 여부를 기준으로 검색 결과 카드가 들어갈 자리입니다.",
    eyebrow: "SEARCH EXPERIENCE",
    heroNote: "상단 필터와 정렬, 결과 카드, 찜하기 버튼까지 포함한 샘플 구성입니다.",
    ctaLabel: "검색 화면 보기",
    tags: ["서울", "주야간보호", "상담 가능"],
    blocks: [
      {
        label: "FILTER",
        title: "조건별 검색 필터",
        description: "지역, 서비스, 비용대, 상담 가능 여부를 고정 필터로 보여줄 수 있습니다."
      },
      {
        label: "RESULT",
        title: "시설 카드 리스트",
        description: "이미지, 평점, 위치, 상담 상태를 한 카드 안에서 빠르게 비교하게 만듭니다."
      },
      {
        label: "MAP",
        title: "지도 연동 영역",
        description: "검색 결과와 연동되는 지도 또는 지역 클러스터 영역을 붙일 수 있습니다."
      }
    ]
  },
  login: {
    title: "로그인",
    description: "일반 로그인, 간편 로그인, 상담 이력 확인용 진입을 담을 로그인 화면 자리입니다.",
    eyebrow: "ACCOUNT ACCESS",
    heroNote: "이메일 로그인과 간편 로그인, 최근 상담 조회까지 함께 배치하는 샘플입니다.",
    ctaLabel: "로그인 화면 보기",
    tags: ["이메일", "간편 로그인", "상담이력"],
    blocks: [
      {
        label: "FORM",
        title: "기본 로그인 폼",
        description: "아이디/비밀번호 입력과 로그인 유지 옵션을 가장 먼저 보여줍니다."
      },
      {
        label: "SOCIAL",
        title: "간편 로그인",
        description: "네이버, 카카오, 구글 같은 외부 로그인 버튼을 모아 배치합니다."
      },
      {
        label: "HELP",
        title: "비밀번호 찾기",
        description: "상담 이력이 있는 보호자도 빠르게 계정을 복구할 수 있게 연결합니다."
      }
    ]
  },
  guide: {
    title: "요양 가이드",
    description: "시설 선택 기준, 비용, 국가지원 제도를 설명하는 가이드 목록이 들어갈 자리입니다.",
    eyebrow: "GUIDE CONTENT",
    heroNote: "카드형 가이드 목록과 카테고리 필터, 인기 글 묶음을 샘플로 구성합니다.",
    ctaLabel: "가이드 목록 보기",
    tags: ["시설 선택", "지원금", "상담 팁"],
    blocks: [
      {
        label: "LIST",
        title: "가이드 카드 목록",
        description: "주제별 썸네일과 제목, 요약 설명이 보이는 콘텐츠 카드 구조를 넣습니다."
      },
      {
        label: "TREND",
        title: "인기 가이드 영역",
        description: "조회수 높은 글이나 새로 올라온 글을 상단에서 따로 강조합니다."
      },
      {
        label: "CATEGORY",
        title: "주제별 분류",
        description: "비용, 시설 선택, 보호자 팁, 제도 안내를 탭 형태로 나눌 수 있습니다."
      }
    ]
  },
  notice: {
    title: "공지사항",
    description: "업데이트, 서비스 점검, 정책 변경 같은 공지사항 리스트가 들어갈 자리입니다.",
    eyebrow: "NOTICE FEED",
    heroNote: "중요 공지 고정, 일반 공지 리스트, 날짜/상태 태그 구성을 샘플로 보여줍니다.",
    ctaLabel: "공지 목록 보기",
    tags: ["업데이트", "점검", "정책"],
    blocks: [
      {
        label: "PINNED",
        title: "상단 고정 공지",
        description: "긴급 점검이나 정책 변경 같은 공지는 상단에서 고정으로 노출합니다."
      },
      {
        label: "LIST",
        title: "일반 공지 리스트",
        description: "제목, 날짜, 상태 태그만으로 빠르게 훑을 수 있게 단순하게 구성합니다."
      },
      {
        label: "DETAIL",
        title: "공지 상세 연결",
        description: "클릭 시 본문, 첨부 파일, 관련 링크가 붙는 상세 페이지로 이어집니다."
      }
    ]
  },
  privacy: {
    title: "개인정보처리방침",
    description: "개인정보 수집 항목, 이용 목적, 보유 기간 등을 문서형으로 정리할 자리입니다.",
    eyebrow: "LEGAL DOCUMENT",
    heroNote: "목차 네비게이션과 문서 본문, 개정 이력을 포함하는 샘플 문서형 레이아웃입니다.",
    ctaLabel: "문서 미리보기",
    tags: ["개인정보", "수집 항목", "보유 기간"],
    blocks: [
      {
        label: "TOC",
        title: "문서 목차",
        description: "긴 약관도 빠르게 이동할 수 있도록 좌측 또는 상단 목차를 둡니다."
      },
      {
        label: "BODY",
        title: "조항별 본문",
        description: "수집 항목, 처리 목적, 위탁 현황을 구분 섹션으로 명확히 보여줍니다."
      },
      {
        label: "VERSION",
        title: "개정 이력",
        description: "변경일과 주요 수정 사항을 기록해 정책 변경 추적이 가능하게 만듭니다."
      }
    ]
  },
  terms: {
    title: "이용약관",
    description: "회원 이용약관과 서비스 운영 기준을 문서형으로 담을 자리입니다.",
    eyebrow: "SERVICE TERMS",
    heroNote: "정책 문서형 구조에 맞춰 조항, 목차, 개정 이력을 샘플로 넣었습니다.",
    ctaLabel: "약관 미리보기",
    tags: ["회원 약관", "서비스 정책", "책임 범위"],
    blocks: [
      {
        label: "SECTION",
        title: "조항별 정리",
        description: "가입, 탈퇴, 책임 범위, 금지 행위를 조항별로 나눠 구성합니다."
      },
      {
        label: "SUMMARY",
        title: "핵심 요약 박스",
        description: "긴 약관을 보기 전에 꼭 확인할 핵심 내용을 상단 요약으로 뽑을 수 있습니다."
      },
      {
        label: "HISTORY",
        title: "개정 공지",
        description: "약관 변경 시점과 효력 발생일을 함께 명시해 혼선을 줄입니다."
      }
    ]
  },
  discover: {
    title: "둘러보기",
    description: "추천 테마, 인기 지역, 서비스 유형별 탐색 허브가 들어갈 자리입니다.",
    eyebrow: "DISCOVERY HUB",
    heroNote: "테마별 큐레이션과 지역 탐색, 지금 많이 보는 시설 묶음을 샘플로 배치합니다.",
    ctaLabel: "탐색 허브 보기",
    tags: ["테마", "지역", "큐레이션"],
    blocks: [
      {
        label: "THEME",
        title: "테마별 추천 묶음",
        description: "프리미엄, 재활특화, 자연형 같은 큐레이션 섹션으로 나눕니다."
      },
      {
        label: "REGION",
        title: "지역 허브 이동",
        description: "서울, 경기, 인천 등 지역별 진입 카드를 크게 배치할 수 있습니다."
      },
      {
        label: "TREND",
        title: "지금 많이 보는 시설",
        description: "최근 조회수나 상담 전환이 높은 시설을 별도 섹션으로 강조합니다."
      }
    ]
  },
  profile: {
    title: "프로필",
    description: "회원 정보, 찜한 시설, 상담 이력, 알림 설정이 들어갈 프로필 화면 자리입니다.",
    eyebrow: "MY PAGE",
    heroNote: "개인 정보와 찜 목록, 최근 상담 이력을 한 화면에 정리하는 샘플 구성입니다.",
    ctaLabel: "마이페이지 보기",
    tags: ["회원 정보", "찜 목록", "상담 이력"],
    blocks: [
      {
        label: "PROFILE",
        title: "기본 정보 카드",
        description: "이름, 연락처, 관심 지역, 가입 유형을 요약 카드로 보여줍니다."
      },
      {
        label: "FAVORITES",
        title: "찜한 시설 목록",
        description: "최근 찜한 시설을 카드형으로 모아 다시 비교할 수 있게 합니다."
      },
      {
        label: "HISTORY",
        title: "상담 이력",
        description: "상담 접수, 연결 완료, 후속 상담 예정 상태를 타임라인으로 구성합니다."
      }
    ]
  },
  partner: {
    title: "입점문의",
    description: "시설 입점 신청, 제휴 문의, 노출 상품 안내가 들어갈 전환 페이지 자리입니다.",
    eyebrow: "PARTNER ONBOARDING",
    heroNote: "신청 폼, 상품 안내, 자주 묻는 질문까지 연결하는 샘플 구조입니다.",
    ctaLabel: "입점 신청 흐름 보기",
    tags: ["입점 신청", "제휴 문의", "상품 안내"],
    blocks: [
      {
        label: "FORM",
        title: "입점 신청 폼",
        description: "시설명, 지역, 담당자 연락처, 문의 유형을 중심으로 최소 입력으로 설계합니다."
      },
      {
        label: "PLAN",
        title: "노출 상품 안내",
        description: "메인 배너, 추천시설, 요양이 TV 연결 같은 상품 설명을 같이 배치합니다."
      },
      {
        label: "FAQ",
        title: "입점 FAQ",
        description: "승인 절차, 비용, 노출 방식, 영상 연결 여부를 자주 묻는 질문으로 제공합니다."
      }
    ]
  },
  recommended: {
    title: "요양이 추천시설",
    description: "큐레이션 기준에 따라 정리된 추천시설 전체 목록이 들어갈 자리입니다.",
    eyebrow: "CURATED FACILITIES",
    heroNote: "추천 이유, 태그, 비교 카드가 함께 보이는 샘플 리스트 구조입니다.",
    ctaLabel: "추천 리스트 보기",
    tags: ["추천 이유", "큐레이션", "비교 카드"],
    blocks: [
      {
        label: "CURATION",
        title: "추천 기준 설명",
        description: "추천시설이 선정된 이유와 태그 기준을 상단에 명확히 노출합니다."
      },
      {
        label: "LIST",
        title: "카드형 시설 목록",
        description: "사진, 평점, 지역, 상담 상태를 동일한 비중으로 정리합니다."
      },
      {
        label: "COMPARE",
        title: "비교 저장 흐름",
        description: "여러 시설을 찜하고 나중에 다시 비교하는 흐름을 붙일 수 있습니다."
      }
    ]
  },
  facilities: {
    title: "추천시설",
    description: "조건 필터와 지역 분류를 포함한 일반 시설 목록이 들어갈 자리입니다.",
    eyebrow: "FACILITY DIRECTORY",
    heroNote: "기본 목록형 탐색 화면에 맞춘 샘플 정렬과 필터 구조를 제공합니다.",
    ctaLabel: "시설 목록 보기",
    tags: ["목록형", "정렬", "지역 필터"],
    blocks: [
      {
        label: "SORT",
        title: "정렬 옵션",
        description: "추천순, 평점순, 최근 등록순 같은 기준을 상단에서 선택할 수 있습니다."
      },
      {
        label: "CARD",
        title: "시설 카드 정보",
        description: "상담 가능 여부, 위치, 시설 유형, 보호자 선호 태그를 표시합니다."
      },
      {
        label: "PAGING",
        title: "페이지네이션",
        description: "리스트를 여러 페이지 또는 무한 스크롤로 이어갈 수 있게 구성합니다."
      }
    ]
  },
  tv: {
    title: "요양이 TV",
    description: "시설 소개 영상과 가이드 영상을 모아보는 요양이 TV 목록 자리입니다.",
    eyebrow: "VIDEO LIBRARY",
    heroNote: "썸네일, 재생시간, 조회수, 카테고리 필터가 포함된 샘플 구성입니다.",
    ctaLabel: "영상 목록 보기",
    tags: ["영상 썸네일", "조회수", "카테고리"],
    blocks: [
      {
        label: "THUMBNAIL",
        title: "영상 카드 목록",
        description: "썸네일 위에 재생 버튼과 재생 시간을 함께 넣어 직관적으로 보이게 합니다."
      },
      {
        label: "CATEGORY",
        title: "영상 분류 탭",
        description: "시설 소개, 보호자 가이드, 제도 안내 같은 주제별 탭을 구성합니다."
      },
      {
        label: "HIGHLIGHT",
        title: "추천 영상 강조",
        description: "조회수 높은 인기 영상이나 신규 영상을 상단에서 한 번 더 강조합니다."
      }
    ]
  },
  regions: {
    title: "지역별 시설",
    description: "시도별 시설 탐색과 지역 큐레이션이 들어갈 지역별 시설 페이지 자리입니다.",
    eyebrow: "REGIONAL BROWSE",
    heroNote: "지도형 진입과 지역 카드, 지역별 추천 묶음을 담는 샘플 구조입니다.",
    ctaLabel: "지역 탐색 보기",
    tags: ["서울", "경기", "인천"],
    blocks: [
      {
        label: "MAP",
        title: "지역 지도 진입",
        description: "전체 권역을 한눈에 보고 주요 지역으로 빠르게 이동하는 구조입니다."
      },
      {
        label: "REGION",
        title: "지역 카드 리스트",
        description: "지역별 시설 수나 인기 시설 개수를 카드에서 바로 보여줄 수 있습니다."
      },
      {
        label: "CURATION",
        title: "지역 추천 묶음",
        description: "서울권 추천, 경기권 추천처럼 지역에 맞는 묶음을 따로 제공할 수 있습니다."
      }
    ]
  },
  counsel: {
    title: "상담하기",
    description: "상담 신청, 연락 가능 시간, 관심 지역을 받아 연결하는 전환 페이지 자리입니다.",
    eyebrow: "CONSULTATION FLOW",
    heroNote: "상담 신청 폼과 빠른 응답 안내, 최근 상담 FAQ를 넣는 샘플입니다.",
    ctaLabel: "상담 흐름 보기",
    tags: ["상담 신청", "연락 시간", "빠른 응답"],
    blocks: [
      {
        label: "FORM",
        title: "상담 신청 입력",
        description: "보호자 정보와 관심 시설 유형을 빠르게 입력하는 구조를 둡니다."
      },
      {
        label: "TIME",
        title: "연락 가능 시간 선택",
        description: "바로 통화, 문자 우선, 특정 시간대 연락 같은 옵션을 함께 제공합니다."
      },
      {
        label: "NOTICE",
        title: "상담 안내 문구",
        description: "평균 응답 시간과 상담 연결 방식, 개인정보 안내를 상단에 넣습니다."
      }
    ]
  },
  youtube: {
    title: "유튜브 바로가기",
    description: "공식 유튜브 채널과 인기 영상을 묶어 외부 연결하는 랜딩 자리입니다.",
    eyebrow: "CHANNEL OUTBOUND",
    heroNote: "채널 소개와 인기 영상 미리보기, 외부 이동 버튼을 함께 두는 샘플입니다.",
    ctaLabel: "채널 보기",
    tags: ["채널 소개", "인기 영상", "외부 이동"],
    blocks: [
      {
        label: "CHANNEL",
        title: "공식 채널 소개",
        description: "채널 성격과 업로드 주기, 주요 콘텐츠를 상단에서 요약합니다."
      },
      {
        label: "TOP VIDEO",
        title: "대표 영상 미리보기",
        description: "최근 인기 영상 2~3개를 카드형으로 미리 보여줄 수 있습니다."
      },
      {
        label: "OUTBOUND",
        title: "외부 이동 CTA",
        description: "유튜브 앱 또는 웹으로 자연스럽게 이동하는 전용 버튼을 둡니다."
      }
    ]
  },
  blog: {
    title: "블로그 바로가기",
    description: "공식 블로그와 최신 글, 대표 카테고리를 보여주는 외부 연결 랜딩 자리입니다.",
    eyebrow: "BLOG OUTBOUND",
    heroNote: "최근 글 미리보기와 블로그 이동 버튼을 함께 두는 샘플 구조입니다.",
    ctaLabel: "블로그 보기",
    tags: ["최신 글", "가이드", "후기"],
    blocks: [
      {
        label: "POST",
        title: "최신 글 미리보기",
        description: "최근 발행 글 제목과 요약을 2~3개 카드로 미리 보여줄 수 있습니다."
      },
      {
        label: "CATEGORY",
        title: "대표 카테고리",
        description: "요양 정보, 보호자 팁, 시설 소개 같은 분류를 함께 안내합니다."
      },
      {
        label: "OUTBOUND",
        title: "외부 블로그 이동",
        description: "블로그로 이동하는 주요 CTA를 시선이 모이는 위치에 배치합니다."
      }
    ]
  }
} satisfies Record<string, RouteConfig>;

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
      <section className={styles.stage}>
        <div className={styles.heroCard}>
          <div className={styles.copy}>
            <div className={styles.topline}>
              <span className={styles.eyebrow}>COMING SOON</span>
              <span className={styles.sectionLabel}>{page.eyebrow}</span>
            </div>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className={styles.tagList}>
              {page.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton}>
                {page.ctaLabel}
              </button>
              <Link href="/" className={styles.secondaryButton}>
                메인으로 돌아가기
              </Link>
            </div>
          </div>

          <div className={styles.previewPanel}>
            <div className={styles.previewHead}>
              <strong>{page.heroNote}</strong>
              <span>Sample Layout</span>
            </div>
            <div className={styles.previewGrid}>
              {page.blocks.map((block) => (
                <article key={block.title} className={styles.previewCard}>
                  <span className={styles.previewLabel}>{block.label}</span>
                  <h2>{block.title}</h2>
                  <p>{block.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottomStrip}>
          {page.blocks.map((block) => (
            <div key={`${block.label}-mini`} className={styles.bottomCard}>
              <span>{block.label}</span>
              <strong>{block.title}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
