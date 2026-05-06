import {
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import type {
  CarePageData,
  CarePageListing,
  CareRegion,
  CareRegionSub,
  CareViewMode,
} from "@/entities/cares/model/types";
import {
  type ListingLikeStateMap,
  getListingLikeState,
  getNextLikeCount,
  makeListingLikeState,
} from "@/entities/cares/model/listing-like";
import { buildCaresQuery } from "@/entities/cares/model/query-state";
import type { HomeIconName } from "@/entities/home/model/types";
import { siteConfig } from "@/shared/config/site";
import { createLoginUrl } from "@/shared/lib/auth-redirect";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import { CareListingImageSwiper } from "@/widgets/cases/ui/CareListingImageSwiper";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/cases/ui/CasesPageView.module.css";

type ThemeFilter = {
  code: string;
  label: string;
  icon: HomeIconName;
};

type RegionChip = {
  id: string;
  label: string;
  regionIds: string[];
};

type SelectedConsultCare = {
  name: string;
  phone: string;
};

const PAGINATION_PRESERVED_RANGE = 2;

type ThemeScrollState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

const themeFilters: ThemeFilter[] = [
  { code: "RE", label: "종교시설", icon: "RE" },
  { code: "PR", label: "프리미엄", icon: "PR" },
  { code: "EC", label: "경제적인", icon: "EC" },
  { code: "NU", label: "간호특화", icon: "NU" },
  { code: "CK", label: "직영조리", icon: "CK" },
  { code: "RH", label: "재활치료", icon: "RH" },
  { code: "LA", label: "인력가산", icon: "LA" },
  { code: "PG", label: "프로그램", icon: "PG" },
  { code: "DT", label: "도심인접", icon: "DT" },
  { code: "WK", label: "산책/텃밭", icon: "WK" },
];

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getFormattedCarePhone(phone?: string | null) {
  return formatKoreanPhoneNumber(phone ?? siteConfig.customerPhone);
}

function formatLikeCount(count: number) {
  return Math.max(0, count).toLocaleString("ko-KR");
}

function getPaginationItems(totalPages: number, currentPage: number) {
  const items: Array<number | `dot-${number}`> = [];

  for (let page = 1; page <= totalPages; page += 1) {
    const shouldPreserve =
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= PAGINATION_PRESERVED_RANGE;

    if (shouldPreserve) {
      items.push(page);
      continue;
    }

    if (
      page === currentPage - PAGINATION_PRESERVED_RANGE - 1 ||
      page === currentPage + PAGINATION_PRESERVED_RANGE + 1
    ) {
      items.push(`dot-${page}`);
    }
  }

  return items;
}

function getInitialOpenRegion(
  regions: CareRegion[],
  selectedRegionIds: string[],
) {
  const selectedRegion = regions.find((region) =>
    region.subs.some((sub) => selectedRegionIds.includes(sub.regionId)),
  );

  return selectedRegion?.name ?? regions[0]?.name ?? "";
}

function getRegionIds(region: CareRegion) {
  return region.subs.map((sub) => sub.regionId);
}

function isRegionFullyChecked(region: CareRegion, selectedRegionIds: string[]) {
  const regionIds = getRegionIds(region);

  return (
    regionIds.length > 0 &&
    regionIds.every((id) => selectedRegionIds.includes(id))
  );
}

function isRegionPartiallyChecked(
  region: CareRegion,
  selectedRegionIds: string[],
) {
  return (
    !isRegionFullyChecked(region, selectedRegionIds) &&
    region.subs.some((sub) => selectedRegionIds.includes(sub.regionId))
  );
}

function makeRegionChips(
  regions: CareRegion[],
  selectedRegionIds: string[],
): RegionChip[] {
  return regions.flatMap((region) => {
    const regionIds = getRegionIds(region);
    const selectedSubs = region.subs.filter((sub) =>
      selectedRegionIds.includes(sub.regionId),
    );

    if (!selectedSubs.length) {
      return [];
    }

    if (regionIds.length > 0 && selectedSubs.length === regionIds.length) {
      return [
        {
          id: region.name,
          label: region.name,
          regionIds,
        },
      ];
    }

    return selectedSubs.map((sub) => ({
      id: sub.regionId,
      label: sub.name,
      regionIds: [sub.regionId],
    }));
  });
}

function makeRegionSummary(regions: CareRegion[], selectedRegionIds: string[]) {
  const chips = makeRegionChips(regions, selectedRegionIds);

  if (!chips.length) {
    return "지역 전체";
  }

  const firstChip = chips[0];

  return chips.length === 1 || !firstChip
    ? (firstChip?.label ?? "지역 전체")
    : `${firstChip.label} 외 ${chips.length - 1}개`;
}

function getLoginUrl() {
  return createLoginUrl();
}

async function parseApiResponse(response: Response) {
  try {
    return (await response.json()) as { status?: number; message?: string };
  } catch {
    return {
      status: response.status,
      message: "서버 응답을 읽을 수 없습니다.",
    };
  }
}

async function scrollToPageTop() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.scrollY <= 2) {
    return;
  }

  await new Promise<void>((resolve) => {
    const startedAt = performance.now();
    const timeoutMs = 1200;

    function finishWhenReady() {
      if (window.scrollY <= 2 || performance.now() - startedAt > timeoutMs) {
        resolve();
        return;
      }

      window.requestAnimationFrame(finishWhenReady);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(finishWhenReady);
  });
}

type CasesPageViewProps = {
  data: CarePageData;
};

export function CasesPageView({ data }: CasesPageViewProps) {
  const router = useRouter();
  const themeScrollerRef = useRef<HTMLDivElement | null>(null);
  const [selectedThemeCodes, setSelectedThemeCodes] = useState(
    data.initialThemeCodes,
  );
  const [selectedRegionIds, setSelectedRegionIds] = useState(
    data.initialRegionIds,
  );
  const [draftRegionIds, setDraftRegionIds] = useState(data.initialRegionIds);
  const [activeRegionName, setActiveRegionName] = useState(() =>
    getInitialOpenRegion(data.regions, data.initialRegionIds),
  );
  const [isRegionPanelOpen, setIsRegionPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CareViewMode>(data.initialViewMode);
  const [premiumPage, setPremiumPage] = useState(data.initialPage);
  const [listingLikes, setListingLikes] = useState<ListingLikeStateMap>(() =>
    makeListingLikeState(data.listings),
  );
  const [themeScrollState, setThemeScrollState] = useState<ThemeScrollState>({
    canScrollLeft: false,
    canScrollRight: false,
  });
  const [selectedConsultCare, setSelectedConsultCare] =
    useState<SelectedConsultCare | null>(null);

  const premiumListings = useMemo(
    () => data.listings.filter((item) => item.isPremium),
    [data.listings],
  );
  const basicListings = useMemo(
    () => data.listings.filter((item) => !item.isPremium),
    [data.listings],
  );
  const totalListingPages = Math.max(1, data.paginationTotalPages);
  const currentListingPage = Math.min(
    Math.max(1, premiumPage),
    totalListingPages,
  );
  const currentPremiumListings = premiumListings;
  const currentBasicListings = basicListings;
  const activeRegion =
    data.regions.find((region) => region.name === activeRegionName) ??
    data.regions[0];
  const selectedThemeFilters = themeFilters.filter((theme) =>
    selectedThemeCodes.includes(theme.code),
  );
  const selectedRegionChips = makeRegionChips(data.regions, selectedRegionIds);
  const regionSummary = makeRegionSummary(data.regions, selectedRegionIds);
  const hasActiveFilters =
    selectedThemeCodes.length > 0 || selectedRegionIds.length > 0;

  const updateThemeScrollState = useCallback(() => {
    const scroller = themeScrollerRef.current;

    if (!scroller) {
      return;
    }

    const maxScrollLeft = Math.max(
      0,
      scroller.scrollWidth - scroller.clientWidth,
    );
    const nextState = {
      canScrollLeft: scroller.scrollLeft > 4,
      canScrollRight: scroller.scrollLeft < maxScrollLeft - 4,
    };

    setThemeScrollState((current) =>
      current.canScrollLeft === nextState.canScrollLeft &&
      current.canScrollRight === nextState.canScrollRight
        ? current
        : nextState,
    );
  }, []);

  const scrollThemeFilters = (direction: "left" | "right") => {
    const scroller = themeScrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left:
        direction === "left"
          ? -Math.max(180, scroller.clientWidth * 0.58)
          : Math.max(180, scroller.clientWidth * 0.58),
      behavior: "smooth",
    });

    window.setTimeout(updateThemeScrollState, 260);
  };

  const pushQueryState = (nextState: {
    themeCodes?: string[];
    regionIds?: string[];
    viewMode?: CareViewMode;
    page?: number;
  }) => {
    void router.push(
      {
        pathname: router.pathname,
        query: buildCaresQuery(
          {
            themeCodes: nextState.themeCodes ?? selectedThemeCodes,
            regionIds: nextState.regionIds ?? selectedRegionIds,
            viewMode: nextState.viewMode ?? viewMode,
            page: nextState.page ?? premiumPage,
          },
          router.query,
        ),
      },
      undefined,
      {
        scroll: false,
      },
    );
  };

  const toggleTheme = (themeCode: string) => {
    const nextThemeCodes = selectedThemeCodes.includes(themeCode)
      ? selectedThemeCodes.filter((code) => code !== themeCode)
      : [...selectedThemeCodes, themeCode];

    setSelectedThemeCodes(nextThemeCodes);
    setPremiumPage(1);
    pushQueryState({ themeCodes: nextThemeCodes, page: 1 });
  };

  const clearThemes = () => {
    setSelectedThemeCodes([]);
    setPremiumPage(1);
    pushQueryState({ themeCodes: [], page: 1 });
  };

  const changeViewMode = (nextViewMode: CareViewMode) => {
    setViewMode(nextViewMode);
    setPremiumPage(1);
    pushQueryState({ viewMode: nextViewMode, page: 1 });
  };

  const changePremiumPage = (page: number) => {
    if (page === currentListingPage) {
      return;
    }

    void scrollToPageTop().then(() => {
      setPremiumPage(page);
      pushQueryState({ page });
    });
  };

  const toggleListingLike = async (
    event: MouseEvent<HTMLButtonElement>,
    listing: CarePageListing,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const currentLikeState = getListingLikeState(listingLikes, listing);

    if (currentLikeState.isUpdating) {
      return;
    }

    const nextLiked = !currentLikeState.isLiked;

    setListingLikes((current) => ({
      ...current,
      [listing.id]: {
        ...getListingLikeState(current, listing),
        isUpdating: true,
      },
    }));

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(listing.id)}/like`,
        {
          method: nextLiked ? "POST" : "DELETE",
          credentials: "same-origin",
        },
      );
      const data = await parseApiResponse(response);

      if (response.status === 401) {
        window.location.href = getLoginUrl();
        return;
      }

      if (!response.ok || data.status !== 200) {
        throw new Error(data.message || "찜 처리에 실패했습니다.");
      }

      setListingLikes((current) => {
        const latestLikeState = getListingLikeState(current, listing);

        return {
          ...current,
          [listing.id]: {
            isLiked: nextLiked,
            likeCount: getNextLikeCount(latestLikeState.likeCount, nextLiked),
            isUpdating: false,
          },
        };
      });
    } catch (error) {
      console.error("[cares:list-like]", error);
      setListingLikes((current) => ({
        ...current,
        [listing.id]: {
          ...getListingLikeState(current, listing),
          isUpdating: false,
        },
      }));
    }
  };

  const openRegionPanel = () => {
    setDraftRegionIds(selectedRegionIds);
    setActiveRegionName(
      (current) =>
        current || getInitialOpenRegion(data.regions, selectedRegionIds),
    );
    setIsRegionPanelOpen((isOpen) => !isOpen);
  };

  const toggleRegion = (region: CareRegion) => {
    const regionIds = getRegionIds(region);

    if (!regionIds.length) {
      return;
    }

    setDraftRegionIds((currentIds) => {
      const shouldRemove = regionIds.every((id) => currentIds.includes(id));

      return shouldRemove
        ? currentIds.filter((id) => !regionIds.includes(id))
        : uniqueStrings([...currentIds, ...regionIds]);
    });
  };

  const toggleSubRegion = (sub: CareRegionSub) => {
    setDraftRegionIds((currentIds) =>
      currentIds.includes(sub.regionId)
        ? currentIds.filter((id) => id !== sub.regionId)
        : [...currentIds, sub.regionId],
    );
  };

  const applyRegionFilters = () => {
    setSelectedRegionIds(draftRegionIds);
    setIsRegionPanelOpen(false);
    setPremiumPage(1);
    pushQueryState({ regionIds: draftRegionIds, page: 1 });
  };

  const clearAllFilters = () => {
    setSelectedThemeCodes([]);
    setSelectedRegionIds([]);
    setDraftRegionIds([]);
    setIsRegionPanelOpen(false);
    setPremiumPage(1);
    pushQueryState({ themeCodes: [], regionIds: [], page: 1 });
  };

  useEffect(() => {
    setSelectedThemeCodes(data.initialThemeCodes);
    setSelectedRegionIds(data.initialRegionIds);
    setDraftRegionIds(data.initialRegionIds);
    setViewMode(data.initialViewMode);
    setPremiumPage(data.initialPage);
    setActiveRegionName(
      getInitialOpenRegion(data.regions, data.initialRegionIds),
    );
  }, [
    data.initialPage,
    data.initialRegionIds,
    data.initialThemeCodes,
    data.initialViewMode,
    data.regions,
  ]);

  useEffect(() => {
    setListingLikes(makeListingLikeState(data.listings));
  }, [data.listings]);

  useEffect(() => {
    const scroller = themeScrollerRef.current;

    updateThemeScrollState();

    if (!scroller) {
      return;
    }

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateThemeScrollState);

    resizeObserver?.observe(scroller);
    window.addEventListener("resize", updateThemeScrollState);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateThemeScrollState);
    };
  }, [updateThemeScrollState]);

  useEffect(() => {
    updateThemeScrollState();
  }, [selectedThemeCodes, updateThemeScrollState]);

  useEffect(() => {
    if (!data.debugResponses) {
      return;
    }

    console.groupCollapsed("[home-api:cares:browser]");
    console.log("plans", data.debugResponses.plans);
    console.log("normal", data.debugResponses.normal);
    console.log("regions", data.debugResponses.regions);
    console.log("mapped", {
      listings: data.listings,
      regions: data.regions,
      totalItems: data.totalItems,
      paginationTotalPages: data.paginationTotalPages,
      initialThemeCodes: data.initialThemeCodes,
      initialRegionIds: data.initialRegionIds,
      initialViewMode: data.initialViewMode,
      initialPage: data.initialPage,
    });
    console.groupEnd();
  }, [data]);

  useEffect(() => {
    if (!selectedConsultCare) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedConsultCare(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedConsultCare]);

  return (
    <>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <h1>요양시설 찾기</h1>
            <p>
              테마와 지역을 조합해서 우리 가족에게 맞는 요양시설을 비교해보세요.
            </p>
          </div>
        </section>

        <section className={styles.filterBar} aria-label="시설 검색 필터">
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>테마</span>
            <div className={styles.categoryScrollerShell}>
              <button
                type="button"
                className={`${styles.themeScrollButton} ${styles.themeScrollButtonLeft}`}
                aria-label="테마 왼쪽으로 이동"
                disabled={!themeScrollState.canScrollLeft}
                onClick={() => scrollThemeFilters("left")}
              >
                <SystemIcon name="arrow-left" />
              </button>
              <div
                ref={themeScrollerRef}
                className={styles.categoryScroller}
                onScroll={updateThemeScrollState}
              >
                <button
                  type="button"
                  className={
                    selectedThemeCodes.length === 0
                      ? styles.categoryActive
                      : styles.category
                  }
                  onClick={clearThemes}
                >
                  전체
                </button>
                {themeFilters.map((theme) => (
                  <button
                    key={theme.code}
                    type="button"
                    className={
                      selectedThemeCodes.includes(theme.code)
                        ? styles.categoryActive
                        : styles.category
                    }
                    onClick={() => toggleTheme(theme.code)}
                  >
                    <SystemIcon name={theme.icon} />
                    {theme.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`${styles.themeScrollButton} ${styles.themeScrollButtonRight}`}
                aria-label="테마 오른쪽으로 이동"
                disabled={!themeScrollState.canScrollRight}
                onClick={() => scrollThemeFilters("right")}
              >
                <SystemIcon name="arrow-right" />
              </button>
            </div>
          </div>

          <div className={styles.filterRow}>
            <button
              type="button"
              className={`${styles.regionTrigger} ${
                selectedRegionIds.length ? styles.regionTriggerActive : ""
              }`}
              aria-expanded={isRegionPanelOpen}
              onClick={openRegionPanel}
            >
              <span>지역</span>
              <strong>{regionSummary}</strong>
              <span className={styles.regionChevron} aria-hidden="true">
                <SystemIcon
                  name={isRegionPanelOpen ? "chevron-up" : "chevron-down"}
                />
              </span>
            </button>

            <div className={styles.viewSwitch} aria-label="보기 방식">
              <button
                type="button"
                className={viewMode === "grid" ? styles.viewActive : ""}
                onClick={() => changeViewMode("grid")}
                aria-label="카드 보기"
                title="카드 보기"
              >
                <SystemIcon name="grid" />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? styles.viewActive : ""}
                onClick={() => changeViewMode("list")}
                aria-label="목록 보기"
                title="목록 보기"
              >
                <SystemIcon name="list" />
              </button>
            </div>
          </div>

          {isRegionPanelOpen ? (
            <div className={styles.regionPanel}>
              <div className={styles.regionPanelHead}>
                <div>
                  <strong>지역 선택</strong>
                  <p>시·도와 시·군·구를 여러 개 선택할 수 있습니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegionPanelOpen(false)}
                >
                  닫기
                </button>
              </div>

              <div className={styles.regionPanelBody}>
                <div className={styles.regionColumn} aria-label="시도 선택">
                  {data.regions.map((region) => {
                    const fullyChecked = isRegionFullyChecked(
                      region,
                      draftRegionIds,
                    );
                    const partiallyChecked = isRegionPartiallyChecked(
                      region,
                      draftRegionIds,
                    );

                    return (
                      <button
                        key={region.name}
                        type="button"
                        className={`${styles.regionRow} ${
                          region.name === activeRegion?.name
                            ? styles.regionRowActive
                            : ""
                        }`}
                        onClick={() => setActiveRegionName(region.name)}
                      >
                        <span
                          className={`${styles.fakeCheckbox} ${
                            fullyChecked ? styles.fakeChecked : ""
                          } ${partiallyChecked ? styles.fakePartial : ""}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleRegion(region);
                          }}
                        />
                        <span>{region.name}</span>
                        <small>{region.subs.length}</small>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.districtColumn}>
                  {activeRegion ? (
                    <>
                      <button
                        type="button"
                        className={styles.regionBulk}
                        onClick={() => toggleRegion(activeRegion)}
                      >
                        <span
                          className={`${styles.fakeCheckbox} ${
                            isRegionFullyChecked(activeRegion, draftRegionIds)
                              ? styles.fakeChecked
                              : ""
                          } ${
                            isRegionPartiallyChecked(
                              activeRegion,
                              draftRegionIds,
                            )
                              ? styles.fakePartial
                              : ""
                          }`}
                        />
                        <strong>{activeRegion.name} 전체</strong>
                        <small>
                          {
                            activeRegion.subs.filter((sub) =>
                              draftRegionIds.includes(sub.regionId),
                            ).length
                          }
                          /{activeRegion.subs.length}
                        </small>
                      </button>

                      {activeRegion.subs.length ? (
                        <div className={styles.districtGrid}>
                          {activeRegion.subs.map((sub) => {
                            const checked = draftRegionIds.includes(
                              sub.regionId,
                            );

                            return (
                              <label
                                key={sub.regionId}
                                className={styles.districtCheck}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleSubRegion(sub)}
                                />
                                <span
                                  className={`${styles.fakeCheckbox} ${
                                    checked ? styles.fakeChecked : ""
                                  }`}
                                />
                                <span>{sub.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <p className={styles.regionEmpty}>
                          하위 지역 정보가 없습니다.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className={styles.regionEmpty}>
                      지역 정보를 불러오는 중입니다.
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.regionPanelFoot}>
                <button type="button" onClick={() => setDraftRegionIds([])}>
                  선택 초기화
                </button>
                <button type="button" onClick={applyRegionFilters}>
                  {draftRegionIds.length
                    ? `${draftRegionIds.length}개 지역 적용`
                    : "전체 지역 보기"}
                </button>
              </div>
            </div>
          ) : null}

          {hasActiveFilters ? (
            <div className={styles.activeFilters}>
              {selectedThemeFilters.map((theme) => (
                <button
                  key={theme.code}
                  type="button"
                  onClick={() => toggleTheme(theme.code)}
                >
                  {theme.label}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
              {selectedRegionChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    const nextRegionIds = selectedRegionIds.filter(
                      (id) => !chip.regionIds.includes(id),
                    );

                    setSelectedRegionIds(nextRegionIds);
                    setDraftRegionIds(nextRegionIds);
                    setPremiumPage(1);
                    pushQueryState({ regionIds: nextRegionIds, page: 1 });
                  }}
                >
                  {chip.label}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
              <button
                type="button"
                className={styles.clearAllButton}
                onClick={clearAllFilters}
              >
                전체 초기화
              </button>
            </div>
          ) : null}
        </section>

        <section className={styles.resultHeader}>
          <div>
            <strong>프리미엄 시설</strong>
            <span>사진과 키워드로 빠르게 비교해보세요.</span>
          </div>
          <p>
            총 <b>{data.totalItems}</b>개 시설
          </p>
        </section>

        {currentPremiumListings.length ? (
          <section
            className={`${styles.premiumGrid} ${
              viewMode === "list" ? styles.premiumList : ""
            }`}
          >
            {currentPremiumListings.map((listing) => {
              const likeState = getListingLikeState(listingLikes, listing);
              const formattedLikeCount = formatLikeCount(likeState.likeCount);

              return (
                <article key={listing.id} className={styles.premiumCard}>
                  <Link
                    href={`/care/${listing.id}`}
                    className={styles.cardOverlay}
                    aria-label={`${listing.name} 상세보기`}
                  />
                  <div className={styles.imageArea}>
                    <CareListingImageSwiper
                      images={listing.images}
                      name={listing.name}
                    />
                    {listing.badge ? (
                      <span className={styles.badge}>{listing.badge}</span>
                    ) : null}
                    <button
                      type="button"
                      className={`${styles.likeButton} ${
                        likeState.isLiked ? styles.likeButtonActive : ""
                      }`}
                      aria-label={`${likeState.isLiked ? "찜 해제" : "찜하기"}, 좋아요 ${formattedLikeCount}개`}
                      aria-pressed={likeState.isLiked}
                      disabled={likeState.isUpdating}
                      onClick={(event) => toggleListingLike(event, listing)}
                    >
                      <SystemIcon name="heart" />
                      <span className={styles.likeButtonCount}>
                        {formattedLikeCount}
                      </span>
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardContent}>
                      <div className={styles.titleRow}>
                        <h2>{listing.name}</h2>
                      </div>
                      {listing.comment ? (
                        <p className={styles.premiumDescription}>
                          {listing.comment}
                        </p>
                      ) : null}
                      <p className={styles.location}>
                        <SystemIcon name="map-pin" />
                        {listing.region}
                      </p>
                      <div className={styles.keywordRow}>
                        {listing.keywords.map((keyword) => (
                          <span key={keyword}>{keyword}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.consultButton}
                      onClick={() =>
                        setSelectedConsultCare({
                          name: listing.name,
                          phone: getFormattedCarePhone(listing.phone),
                        })
                      }
                    >
                      <SystemIcon name="chat" />
                      바로 상담하기
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        ) : premiumListings.length ? null : (
          <section className={styles.emptyState}>
            <strong>조건에 맞는 프리미엄 시설이 없습니다.</strong>
            <p>필터를 변경하거나 전체 카테고리에서 다시 확인해보세요.</p>
          </section>
        )}

        {totalListingPages > 1 ? (
          <nav className={styles.pagination} aria-label="시설 페이지">
            {currentListingPage !== 1 ? (
              <button
                type="button"
                className={styles.paginationFirst}
                onClick={() => changePremiumPage(1)}
              >
                처음으로
              </button>
            ) : null}
            {getPaginationItems(totalListingPages, currentListingPage).map(
              (item) =>
                typeof item === "number" ? (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.paginationPage} ${
                      item === currentListingPage ? styles.pageActive : ""
                    }`}
                    aria-current={
                      item === currentListingPage ? "page" : undefined
                    }
                    onClick={() => changePremiumPage(item)}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className={styles.paginationDots}>
                    ···
                  </span>
                ),
            )}
          </nav>
        ) : null}

        {currentBasicListings.length ? (
          <section className={styles.basicSection}>
            <div className={styles.basicTitle}>
              <span />
              <strong>일반 요양원</strong>
              <span />
            </div>
            <div
              className={`${styles.basicGrid} ${viewMode === "list" ? styles.basicList : ""}`}
            >
              {currentBasicListings.map((listing) => (
                <article key={listing.id} className={styles.basicCard}>
                  <div className={styles.basicIcon}>
                    <SystemIcon name="building" />
                  </div>
                  <div className={styles.basicInfo}>
                    <div className={styles.basicNameRow}>
                      <h2>{listing.name}</h2>
                    </div>
                    <p>
                      <SystemIcon name="map-pin" />
                      {listing.region}
                    </p>
                    <div className={styles.basicKeywords}>
                      {listing.keywords.map((keyword) => (
                        <span key={keyword}>{keyword}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.phoneButton}
                    onClick={() =>
                      setSelectedConsultCare({
                        name: listing.name,
                        phone: getFormattedCarePhone(listing.phone),
                      })
                    }
                  >
                    전화상담
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : null}
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
            aria-labelledby="care-consult-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.consultIcon} aria-hidden="true">
              <SystemIcon name="chat" />
            </div>
            <h2 id="care-consult-title">{selectedConsultCare.name}</h2>
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
