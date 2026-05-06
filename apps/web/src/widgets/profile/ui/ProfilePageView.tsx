import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";

import { requestCurrentUser } from "@/entities/auth/api/kakao-auth";
import type { UserPayload } from "@/entities/auth/model/types";
import { siteConfig } from "@/shared/config/site";
import { redirectToLogin } from "@/shared/lib/auth-redirect";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/profile/ui/ProfilePageView.module.css";

type ProfileTab = "liked" | "recent";
type ProfileViewMode = "grid" | "list";

type ProfilePageViewProps = {
  activeTab?: ProfileTab;
};

type ProfileFacility = {
  id: string;
  name: string;
  comment: string;
  region: string;
  phone: string;
  isLiked: boolean;
  isLikeUpdating?: boolean;
  likeCount: number;
  images: string[];
  keywords: string[];
  badge?: string;
};

type ProfileIdentity = {
  name: string;
  handle: string;
  image: string;
};

type SelectedConsultCare = {
  name: string;
  phone: string;
};

type ProfilePageMeta = {
  offsetTime?: number;
  page?: number;
  currentPage?: number;
  size?: number;
  sort?: string | null;
  totalItems?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};

type ProfileFacilityListState = {
  list: ProfileFacility[];
  page: ProfilePageMeta | null;
};

type ProfileApiCode = {
  code?: string;
  name?: string;
};

type ProfileApiFacility = {
  residenceId?: string;
  id?: string;
  name?: string;
  comment?: string | null;
  address?: {
    address?: string | null;
    phoneNumber?: string | null;
    region1?: string | null;
    region2?: string | null;
  } | null;
  count?: {
    like?: number | null;
  } | null;
  activity?: {
    isLiked?: boolean;
  } | null;
  themes?: ProfileApiCode[] | null;
  imageUrls?: string[] | null;
  imageUrl?: string | null;
  type?: string | null;
};

type ProfileFacilityResponse = {
  status?: number;
  message?: string;
  page?: ProfilePageMeta;
  list?: ProfileApiFacility[];
  data?:
    | ProfileApiFacility[]
    | {
        list?: ProfileApiFacility[];
        page?: ProfilePageMeta;
      };
};

const PAGE_SIZE = 10;
const EMPTY_FACILITY_STATE: ProfileFacilityListState = {
  list: [],
  page: null,
};
const DEFAULT_PROFILE: ProfileIdentity = {
  name: "마이페이지",
  handle: "로그인 정보 확인 중",
  image: "/image/default-profile.svg",
};
const DEFAULT_FACILITY_IMAGE = "/image/logo.png";
const GRID_SKELETON_COUNT = 6;
const LIST_SKELETON_COUNT = 4;
const PAGINATION_PRESERVED_RANGE = 2;

class AuthRequiredError extends Error {
  constructor() {
    super("로그인이 필요합니다");
    this.name = "AuthRequiredError";
  }
}

const CareListingImageSwiper = dynamic(
  () =>
    import("@/widgets/cases/ui/CareListingImageSwiper").then(
      (module) => module.CareListingImageSwiper,
    ),
  {
    ssr: false,
  },
);

async function fetchProfileFacilities(
  tab: ProfileTab,
  page: number,
  offsetTime?: number,
): Promise<ProfileFacilityListState> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(PAGE_SIZE),
  });

  if (offsetTime) {
    params.set("offsetTime", String(offsetTime));
  }

  const path =
    tab === "liked"
      ? `/api/me/residences/like?${params.toString()}`
      : `/api/me/residences/recent?${params.toString()}`;
  const response = await fetch(path, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  const payload = (await readJson(response)) as ProfileFacilityResponse;

  if (response.status === 401 || payload.status === 401) {
    throw new AuthRequiredError();
  }

  if (!response.ok || (payload.status && payload.status !== 200)) {
    throw new Error(payload.message || "시설 정보를 불러오지 못했습니다");
  }

  const badge = tab === "liked" ? "좋아요" : "최근 본";

  return {
    list: extractFacilityList(payload)
      .map((facility) => mapProfileFacility(facility, badge))
      .filter((facility): facility is ProfileFacility => Boolean(facility)),
    page: extractPageMeta(payload),
  };
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {
      status: response.status,
      message: "서버 응답을 읽을 수 없습니다",
    };
  }
}

function extractFacilityList(payload: ProfileFacilityResponse) {
  if (Array.isArray(payload.list)) {
    return payload.list;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (
    payload.data &&
    "list" in payload.data &&
    Array.isArray(payload.data.list)
  ) {
    return payload.data.list;
  }

  return [];
}

function extractPageMeta(payload: ProfileFacilityResponse) {
  if (payload.page) {
    return payload.page;
  }

  if (payload.data && !Array.isArray(payload.data) && "page" in payload.data) {
    return payload.data.page ?? null;
  }

  return null;
}

function mapProfileFacility(
  facility: ProfileApiFacility,
  badge: string,
): ProfileFacility | null {
  const id = facility.residenceId ?? facility.id;
  const name = facility.name?.trim();

  if (!id || !name) {
    return null;
  }

  const region = [
    facility.address?.region1?.trim(),
    facility.address?.region2?.trim(),
  ]
    .filter(isFilledString)
    .join(" ");
  const imageUrls = Array.from(
    new Set(
      [...(facility.imageUrls ?? []), facility.imageUrl].filter(isFilledString),
    ),
  );
  const keywords =
    facility.themes
      ?.map((theme) => theme.name)
      .filter(isFilledString)
      .slice(0, 3) ?? [];
  const fallbackKeyword = facility.type?.trim() || "요양시설";

  return {
    id,
    name,
    comment: facility.comment?.trim() ?? "",
    region: region || facility.address?.address?.trim() || "지역 정보 없음",
    phone: facility.address?.phoneNumber?.trim() || siteConfig.customerPhone,
    isLiked: facility.activity?.isLiked ?? badge === "좋아요",
    likeCount: facility.count?.like ?? 0,
    images: imageUrls.length ? imageUrls : [DEFAULT_FACILITY_IMAGE],
    keywords: keywords.length ? keywords : [fallbackKeyword],
    badge,
  };
}

function toProfileIdentity(user: UserPayload | null): ProfileIdentity {
  if (!user) {
    return DEFAULT_PROFILE;
  }

  return {
    ...DEFAULT_PROFILE,
    name: user.profile.name || "요양이 회원",
    handle: user.email || `회원번호 ${user.memberId}`,
  };
}

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getFacilityCount(state: ProfileFacilityListState) {
  return state.page?.totalItems ?? state.list.length;
}

function getCurrentPage(page: ProfilePageMeta | null) {
  return page?.page ?? page?.currentPage ?? 1;
}

function getPaginationItems(totalPages: number, currentPage: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1)
    .map((page) => {
      const isEdgePage = page === 1 || page === totalPages;
      const isNearCurrent =
        page >= currentPage - PAGINATION_PRESERVED_RANGE &&
        page <= currentPage + PAGINATION_PRESERVED_RANGE;

      if (isEdgePage || isNearCurrent) {
        return page;
      }

      if (
        page === currentPage - PAGINATION_PRESERVED_RANGE - 1 ||
        page === currentPage + PAGINATION_PRESERVED_RANGE + 1
      ) {
        return `dot-${page}`;
      }

      return null;
    })
    .filter((item): item is number | string => item !== null);
}

function getQueryPage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);

  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function getFormattedCarePhone(phone?: string | null) {
  return formatKoreanPhoneNumber(phone ?? siteConfig.customerPhone);
}

function formatLikeCount(count: number) {
  return Math.max(0, count).toLocaleString("ko-KR");
}

function getNextLikeCount(count: number, nextLiked: boolean) {
  return Math.max(0, count + (nextLiked ? 1 : -1));
}

function getNextTotalItems(page: ProfilePageMeta | null, delta: number) {
  if (!page || typeof page.totalItems !== "number" || delta === 0) {
    return page;
  }

  return {
    ...page,
    totalItems: Math.max(0, page.totalItems + delta),
  };
}

function updateFacilityLikeState(
  state: ProfileFacilityListState,
  facilityId: string,
  updater: (facility: ProfileFacility) => ProfileFacility,
) {
  return {
    ...state,
    list: state.list.map((facility) =>
      facility.id === facilityId ? updater(facility) : facility,
    ),
  };
}

function applySuccessfulLikeChange({
  state,
  facilityId,
  nextLiked,
  likedTotalDelta = 0,
}: {
  state: ProfileFacilityListState;
  facilityId: string;
  nextLiked: boolean;
  likedTotalDelta?: number;
}) {
  const list = state.list.map((facility) =>
    facility.id === facilityId
      ? {
          ...facility,
          isLiked: nextLiked,
          isLikeUpdating: false,
          likeCount: getNextLikeCount(facility.likeCount, nextLiked),
        }
      : facility,
  );

  return {
    list,
    page: getNextTotalItems(state.page, likedTotalDelta),
  };
}

function FacilityCard({
  facility,
  onConsult,
  onToggleLike,
}: {
  facility: ProfileFacility;
  onConsult: (care: SelectedConsultCare) => void;
  onToggleLike: (
    event: MouseEvent<HTMLButtonElement>,
    facility: ProfileFacility,
  ) => void;
}) {
  const formattedLikeCount = formatLikeCount(facility.likeCount);
  const formattedPhone = getFormattedCarePhone(facility.phone);

  return (
    <article className={styles.facilityCard}>
      <Link
        href={`/care/${facility.id}`}
        className={styles.cardOverlay}
        aria-label={`${facility.name} 상세보기`}
      />
      <div className={styles.imageArea}>
        <CareListingImageSwiper
          images={facility.images}
          name={facility.name}
          fallbackImage={DEFAULT_FACILITY_IMAGE}
        />
        {facility.badge ? (
          <span className={styles.badge}>{facility.badge}</span>
        ) : null}
        <button
          type="button"
          className={`${styles.likeButton} ${
            facility.isLiked ? styles.likeButtonActive : ""
          }`}
          aria-label={`${facility.isLiked ? "좋아요 해제" : "좋아요"}, 좋아요 ${formattedLikeCount}개`}
          aria-pressed={facility.isLiked}
          disabled={facility.isLikeUpdating}
          onClick={(event) => onToggleLike(event, facility)}
        >
          <SystemIcon name="heart" />
          <span className={styles.likeButtonCount}>{formattedLikeCount}</span>
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          <div className={styles.titleRow}>
            <h2>{facility.name}</h2>
          </div>
          {facility.comment ? (
            <p className={styles.facilityDescription}>{facility.comment}</p>
          ) : null}
          <p className={styles.location}>
            <SystemIcon name="map-pin" />
            {facility.region}
          </p>
          <div className={styles.keywordRow}>
            {facility.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.consultButton}
          onClick={() =>
            onConsult({
              name: facility.name,
              phone: formattedPhone,
            })
          }
        >
          <SystemIcon name="chat" />
          바로 상담하기
        </button>
      </div>
    </article>
  );
}

function FacilitySkeletonCard() {
  return (
    <article
      className={`${styles.facilityCard} ${styles.skeletonCard}`}
      aria-hidden="true"
    >
      <div className={`${styles.imageArea} ${styles.skeletonBlock}`} />
      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          <span className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
          <span className={`${styles.skeletonLine} ${styles.skeletonText}`} />
          <span className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
          <div className={styles.skeletonKeywordRow}>
            <span className={styles.skeletonPill} />
            <span className={styles.skeletonPill} />
            <span className={styles.skeletonPill} />
          </div>
        </div>
        <span className={`${styles.skeletonLine} ${styles.skeletonButton}`} />
      </div>
    </article>
  );
}

function ProfilePagination({
  page,
  isDisabled,
}: {
  page: ProfilePageMeta;
  isDisabled?: boolean;
}) {
  const router = useRouter();
  const currentPage = getCurrentPage(page);
  const totalPages = page.totalPages ?? 0;
  const items = getPaginationItems(totalPages, currentPage);

  if (totalPages <= 1) {
    return null;
  }

  const makePageHref = (nextPage: number) => ({
    pathname: router.pathname,
    query: {
      ...router.query,
      page: String(nextPage),
    },
  });

  return (
    <nav className={styles.pagination} aria-label="시설 페이지">
      {currentPage !== 1 ? (
        <Link
          href={makePageHref(1)}
          className={`${styles.paginationFirst} ${
            isDisabled ? styles.paginationDisabled : ""
          }`}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
        >
          처음으로
        </Link>
      ) : null}

      {items.map((item) =>
        typeof item === "number" ? (
          <Link
            key={item}
            href={makePageHref(item)}
            className={`${styles.paginationPage} ${
              item === currentPage ? styles.paginationActive : ""
            } ${isDisabled ? styles.paginationDisabled : ""}`}
            aria-current={item === currentPage ? "page" : undefined}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
          >
            {item}
          </Link>
        ) : (
          <span key={item} className={styles.paginationDots}>
            ···
          </span>
        ),
      )}
    </nav>
  );
}

export function ProfilePageView({ activeTab = "liked" }: ProfilePageViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileIdentity>(DEFAULT_PROFILE);
  const [likedFacilities, setLikedFacilities] =
    useState<ProfileFacilityListState>(EMPTY_FACILITY_STATE);
  const [recentFacilities, setRecentFacilities] =
    useState<ProfileFacilityListState>(EMPTY_FACILITY_STATE);
  const [viewMode, setViewMode] = useState<ProfileViewMode>("grid");
  const [selectedConsultCare, setSelectedConsultCare] =
    useState<SelectedConsultCare | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentFacilityState =
    activeTab === "liked" ? likedFacilities : recentFacilities;
  const currentFacilities = currentFacilityState.list;
  const currentPage = currentFacilityState.page;
  const requestedPage = getQueryPage(router.query.page);
  const likedCount = getFacilityCount(likedFacilities);
  const recentCount = getFacilityCount(recentFacilities);
  const emptyTitle =
    errorMessage ??
    (activeTab === "liked"
      ? "좋아요 한 시설이 없습니다"
      : "최근 본 시설이 없습니다");
  const skeletonCount =
    viewMode === "grid" ? GRID_SKELETON_COUNT : LIST_SKELETON_COUNT;

  const toggleFacilityLike = async (
    event: MouseEvent<HTMLButtonElement>,
    facility: ProfileFacility,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (facility.isLikeUpdating) {
      return;
    }

    const nextLiked = !facility.isLiked;
    const likedTotalDelta = nextLiked ? 1 : -1;

    setLikedFacilities((current) =>
      updateFacilityLikeState(current, facility.id, (item) => ({
        ...item,
        isLikeUpdating: true,
      })),
    );
    setRecentFacilities((current) =>
      updateFacilityLikeState(current, facility.id, (item) => ({
        ...item,
        isLikeUpdating: true,
      })),
    );

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(facility.id)}/like`,
        {
          method: nextLiked ? "POST" : "DELETE",
          credentials: "same-origin",
        },
      );
      const payload = (await readJson(response)) as {
        status?: number;
        message?: string;
      };

      if (response.status === 401 || payload.status === 401) {
        redirectToLogin();
        return;
      }

      if (!response.ok || payload.status !== 200) {
        throw new Error(payload.message || "좋아요 처리에 실패했습니다");
      }

      setLikedFacilities((current) =>
        applySuccessfulLikeChange({
          state: current,
          facilityId: facility.id,
          nextLiked,
          likedTotalDelta,
        }),
      );
      setRecentFacilities((current) =>
        applySuccessfulLikeChange({
          state: current,
          facilityId: facility.id,
          nextLiked,
        }),
      );
    } catch (error) {
      console.error("[profile:facility-like]", error);
      setLikedFacilities((current) =>
        updateFacilityLikeState(current, facility.id, (item) => ({
          ...item,
          isLikeUpdating: false,
        })),
      );
      setRecentFacilities((current) =>
        updateFacilityLikeState(current, facility.id, (item) => ({
          ...item,
          isLikeUpdating: false,
        })),
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProfilePage() {
      if (!router.isReady) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      const likedPage = activeTab === "liked" ? requestedPage : 1;
      const recentPage = activeTab === "recent" ? requestedPage : 1;

      try {
        const [user, likedList, recentList] = await Promise.all([
          requestCurrentUser(),
          fetchProfileFacilities("liked", likedPage),
          fetchProfileFacilities("recent", recentPage),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(toProfileIdentity(user));
        setLikedFacilities(likedList);
        setRecentFacilities(recentList);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof AuthRequiredError) {
          redirectToLogin();
          return;
        }

        setProfile(DEFAULT_PROFILE);
        setLikedFacilities(EMPTY_FACILITY_STATE);
        setRecentFacilities(EMPTY_FACILITY_STATE);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "마이페이지 정보를 불러오지 못했습니다",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfilePage();

    return () => {
      isMounted = false;
    };
  }, [activeTab, requestedPage, router.isReady]);

  return (
    <>
      <main className={styles.page}>
        <section className={styles.profileHeader}>
          <div className={styles.headerInner}>
            <div className={styles.profileImageWrap}>
              <Image
                src={profile.image}
                alt={profile.name}
                width={92}
                height={92}
                unoptimized
                className={styles.profileImage}
              />
            </div>

            <div className={styles.profileInfo}>
              <h1>{profile.name}</h1>
              <p>{profile.handle}</p>
            </div>

            <div className={styles.stats} aria-label="마이페이지 요약">
              <div>
                <strong>{likedCount}</strong>
                <span>좋아요</span>
              </div>
              <div>
                <strong>{recentCount}</strong>
                <span>최근 본</span>
              </div>
            </div>
          </div>
        </section>

        <nav className={styles.tabs} aria-label="마이페이지 시설 목록">
          <div className={styles.tabsInner}>
            <Link
              href="/my/likes"
              className={`${styles.tabLink} ${activeTab === "liked" ? styles.tabActive : ""}`}
              aria-current={activeTab === "liked" ? "page" : undefined}
            >
              <SystemIcon name="heart" />
              좋아요 한 시설
              <span>{likedCount}</span>
            </Link>
            <Link
              href="/my/recents"
              className={`${styles.tabLink} ${activeTab === "recent" ? styles.tabActive : ""}`}
              aria-current={activeTab === "recent" ? "page" : undefined}
            >
              <SystemIcon name="calendar" />
              최근 본 시설
              <span>{recentCount}</span>
            </Link>
          </div>
        </nav>

        <section className={styles.facilitySection}>
          <div className={styles.profileToolbar}>
            <div className={styles.viewSwitch} aria-label="보기 방식">
              <button
                type="button"
                className={viewMode === "grid" ? styles.viewActive : ""}
                aria-label="카드 보기"
                aria-pressed={viewMode === "grid"}
                title="카드 보기"
                onClick={() => setViewMode("grid")}
              >
                <SystemIcon name="grid" />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? styles.viewActive : ""}
                aria-label="목록 보기"
                aria-pressed={viewMode === "list"}
                title="목록 보기"
                onClick={() => setViewMode("list")}
              >
                <SystemIcon name="list" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div
              className={`${styles.facilityGrid} ${
                viewMode === "list" ? styles.facilityList : ""
              }`}
              aria-label="시설 목록 로딩 중"
              aria-busy="true"
            >
              {Array.from({ length: skeletonCount }, (_, index) => (
                <FacilitySkeletonCard key={index} />
              ))}
            </div>
          ) : currentFacilities.length ? (
            <div
              className={`${styles.facilityGrid} ${
                viewMode === "list" ? styles.facilityList : ""
              }`}
            >
              {currentFacilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  onConsult={setSelectedConsultCare}
                  onToggleLike={toggleFacilityLike}
                />
              ))}
              {currentPage ? <ProfilePagination page={currentPage} /> : null}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <SystemIcon name={activeTab === "liked" ? "heart" : "calendar"} />
              <strong>{emptyTitle}</strong>
            </div>
          )}
        </section>
      </main>

      {selectedConsultCare ? (
        <div
          className={styles.consultOverlay}
          role="presentation"
          onClick={() => setSelectedConsultCare(null)}
        >
          <section
            className={styles.consultDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-consult-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.consultIcon} aria-hidden="true">
              <SystemIcon name="chat" />
            </div>
            <h2 id="profile-consult-title">{selectedConsultCare.name}</h2>
            <a
              href={`tel:${selectedConsultCare.phone}`}
              className={styles.consultPhone}
            >
              {selectedConsultCare.phone}
            </a>
            <p className={styles.consultHelp}>
              전화연결은 모바일에서 가능합니다
            </p>
            <button
              type="button"
              className={styles.consultConfirm}
              onClick={() => setSelectedConsultCare(null)}
            >
              확인
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
