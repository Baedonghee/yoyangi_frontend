import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import type {
  CarePageData,
  CareRegion,
  CareRegionSub
} from "@/entities/cares/model/types";
import type { HomeIconName } from "@/entities/home/model/types";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/cases/ui/CasesPageView.module.css";

type ViewMode = "grid" | "list";

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
  { code: "WK", label: "산책/텃밭", icon: "WK" }
];

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getInitialOpenRegion(regions: CareRegion[], selectedRegionIds: string[]) {
  const selectedRegion = regions.find((region) =>
    region.subs.some((sub) => selectedRegionIds.includes(sub.regionId))
  );

  return selectedRegion?.name ?? regions[0]?.name ?? "";
}

function getRegionIds(region: CareRegion) {
  return region.subs.map((sub) => sub.regionId);
}

function isRegionFullyChecked(region: CareRegion, selectedRegionIds: string[]) {
  const regionIds = getRegionIds(region);

  return regionIds.length > 0 && regionIds.every((id) => selectedRegionIds.includes(id));
}

function isRegionPartiallyChecked(region: CareRegion, selectedRegionIds: string[]) {
  return (
    !isRegionFullyChecked(region, selectedRegionIds) &&
    region.subs.some((sub) => selectedRegionIds.includes(sub.regionId))
  );
}

function makeRegionChips(regions: CareRegion[], selectedRegionIds: string[]): RegionChip[] {
  return regions.flatMap((region) => {
    const regionIds = getRegionIds(region);
    const selectedSubs = region.subs.filter((sub) => selectedRegionIds.includes(sub.regionId));

    if (!selectedSubs.length) {
      return [];
    }

    if (regionIds.length > 0 && selectedSubs.length === regionIds.length) {
      return [
        {
          id: region.name,
          label: region.name,
          regionIds
        }
      ];
    }

    return selectedSubs.map((sub) => ({
      id: sub.regionId,
      label: sub.name,
      regionIds: [sub.regionId]
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
    ? firstChip?.label ?? "지역 전체"
    : `${firstChip.label} 외 ${chips.length - 1}개`;
}

type CasesPageViewProps = {
  data: CarePageData;
};

export function CasesPageView({ data }: CasesPageViewProps) {
  const router = useRouter();
  const [selectedThemeCodes, setSelectedThemeCodes] = useState(data.initialThemeCodes);
  const [selectedRegionIds, setSelectedRegionIds] = useState(data.initialRegionIds);
  const [draftRegionIds, setDraftRegionIds] = useState(data.initialRegionIds);
  const [activeRegionName, setActiveRegionName] = useState(() =>
    getInitialOpenRegion(data.regions, data.initialRegionIds)
  );
  const [isRegionPanelOpen, setIsRegionPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [premiumPage, setPremiumPage] = useState(1);

  const premiumListings = useMemo(
    () => data.listings.filter((item) => item.isPremium),
    [data.listings]
  );
  const basicListings = useMemo(
    () => data.listings.filter((item) => !item.isPremium),
    [data.listings]
  );
  const itemsPerPage = viewMode === "grid" ? 6 : 5;
  const totalPremiumPages = Math.max(1, Math.ceil(premiumListings.length / itemsPerPage));
  const currentPremiumListings = premiumListings.slice(
    (premiumPage - 1) * itemsPerPage,
    premiumPage * itemsPerPage
  );
  const activeRegion = data.regions.find((region) => region.name === activeRegionName) ?? data.regions[0];
  const selectedThemeFilters = themeFilters.filter((theme) =>
    selectedThemeCodes.includes(theme.code)
  );
  const selectedRegionChips = makeRegionChips(data.regions, selectedRegionIds);
  const regionSummary = makeRegionSummary(data.regions, selectedRegionIds);
  const hasActiveFilters = selectedThemeCodes.length > 0 || selectedRegionIds.length > 0;

  const pushFilters = (themeCodes: string[], regionIds: string[]) => {
    const nextQuery = { ...router.query };

    delete nextQuery.page;
    delete nextQuery.themes;
    delete nextQuery.regionIds;

    if (themeCodes.length) {
      nextQuery.themes = themeCodes.join(",");
    }

    if (regionIds.length) {
      nextQuery.regionIds = regionIds.join(",");
    }

    void router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
      scroll: false
    });
  };

  const toggleTheme = (themeCode: string) => {
    const nextThemeCodes = selectedThemeCodes.includes(themeCode)
      ? selectedThemeCodes.filter((code) => code !== themeCode)
      : [...selectedThemeCodes, themeCode];

    setSelectedThemeCodes(nextThemeCodes);
    pushFilters(nextThemeCodes, selectedRegionIds);
  };

  const clearThemes = () => {
    setSelectedThemeCodes([]);
    pushFilters([], selectedRegionIds);
  };

  const openRegionPanel = () => {
    setDraftRegionIds(selectedRegionIds);
    setActiveRegionName((current) => current || getInitialOpenRegion(data.regions, selectedRegionIds));
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
        : [...currentIds, sub.regionId]
    );
  };

  const applyRegionFilters = () => {
    setSelectedRegionIds(draftRegionIds);
    setIsRegionPanelOpen(false);
    pushFilters(selectedThemeCodes, draftRegionIds);
  };

  const clearAllFilters = () => {
    setSelectedThemeCodes([]);
    setSelectedRegionIds([]);
    setDraftRegionIds([]);
    setIsRegionPanelOpen(false);
    pushFilters([], []);
  };

  useEffect(() => {
    setPremiumPage(1);
  }, [selectedThemeCodes, selectedRegionIds, viewMode]);

  useEffect(() => {
    setSelectedThemeCodes(data.initialThemeCodes);
    setSelectedRegionIds(data.initialRegionIds);
    setDraftRegionIds(data.initialRegionIds);
    setActiveRegionName(getInitialOpenRegion(data.regions, data.initialRegionIds));
  }, [data.initialRegionIds, data.initialThemeCodes, data.regions]);

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
      initialThemeCodes: data.initialThemeCodes,
      initialRegionIds: data.initialRegionIds
    });
    console.groupEnd();
  }, [data]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>요양시설 찾기</h1>
          <p>테마와 지역을 조합해서 우리 가족에게 맞는 요양시설을 비교해보세요.</p>
        </div>
      </section>

      <section className={styles.filterBar} aria-label="시설 검색 필터">
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>테마</span>
          <div className={styles.categoryScroller}>
            <button
              type="button"
              className={selectedThemeCodes.length === 0 ? styles.categoryActive : styles.category}
              onClick={clearThemes}
            >
              전체
            </button>
            {themeFilters.map((theme) => (
              <button
                key={theme.code}
                type="button"
                className={
                  selectedThemeCodes.includes(theme.code) ? styles.categoryActive : styles.category
                }
                onClick={() => toggleTheme(theme.code)}
              >
                <SystemIcon name={theme.icon} />
                {theme.label}
              </button>
            ))}
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
            <i aria-hidden="true">{isRegionPanelOpen ? "⌃" : "⌄"}</i>
          </button>

          <div className={styles.viewSwitch} aria-label="보기 방식">
            <button
              type="button"
              className={viewMode === "grid" ? styles.viewActive : ""}
              onClick={() => setViewMode("grid")}
            >
              카드
            </button>
            <button
              type="button"
              className={viewMode === "list" ? styles.viewActive : ""}
              onClick={() => setViewMode("list")}
            >
              목록
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
              <button type="button" onClick={() => setIsRegionPanelOpen(false)}>
                닫기
              </button>
            </div>

            <div className={styles.regionPanelBody}>
              <div className={styles.regionColumn} aria-label="시도 선택">
                {data.regions.map((region) => {
                  const fullyChecked = isRegionFullyChecked(region, draftRegionIds);
                  const partiallyChecked = isRegionPartiallyChecked(region, draftRegionIds);

                  return (
                    <button
                      key={region.name}
                      type="button"
                      className={`${styles.regionRow} ${
                        region.name === activeRegion?.name ? styles.regionRowActive : ""
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
                          isRegionPartiallyChecked(activeRegion, draftRegionIds)
                            ? styles.fakePartial
                            : ""
                        }`}
                      />
                      <strong>{activeRegion.name} 전체</strong>
                      <small>
                        {
                          activeRegion.subs.filter((sub) =>
                            draftRegionIds.includes(sub.regionId)
                          ).length
                        }
                        /{activeRegion.subs.length}
                      </small>
                    </button>

                    {activeRegion.subs.length ? (
                      <div className={styles.districtGrid}>
                        {activeRegion.subs.map((sub) => {
                          const checked = draftRegionIds.includes(sub.regionId);

                          return (
                            <label key={sub.regionId} className={styles.districtCheck}>
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
                      <p className={styles.regionEmpty}>하위 지역 정보가 없습니다.</p>
                    )}
                  </>
                ) : (
                  <p className={styles.regionEmpty}>지역 정보를 불러오는 중입니다.</p>
                )}
              </div>
            </div>

            <div className={styles.regionPanelFoot}>
              <button type="button" onClick={() => setDraftRegionIds([])}>
                선택 초기화
              </button>
              <button type="button" onClick={applyRegionFilters}>
                {draftRegionIds.length ? `${draftRegionIds.length}개 지역 적용` : "전체 지역 보기"}
              </button>
            </div>
          </div>
        ) : null}

        {hasActiveFilters ? (
          <div className={styles.activeFilters}>
            {selectedThemeFilters.map((theme) => (
              <button key={theme.code} type="button" onClick={() => toggleTheme(theme.code)}>
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
                    (id) => !chip.regionIds.includes(id)
                  );

                  setSelectedRegionIds(nextRegionIds);
                  setDraftRegionIds(nextRegionIds);
                  pushFilters(selectedThemeCodes, nextRegionIds);
                }}
              >
                {chip.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            <button type="button" className={styles.clearAllButton} onClick={clearAllFilters}>
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
          {currentPremiumListings.map((listing) => (
            <article key={listing.id} className={styles.premiumCard}>
              <div className={styles.imageArea}>
                <img src={listing.images[0]} alt={`${listing.name} 대표 이미지`} />
                {listing.badge ? <span className={styles.badge}>{listing.badge}</span> : null}
                <button type="button" className={styles.likeButton} aria-label="찜하기">
                  <SystemIcon name="heart" />
                </button>
                {listing.images.length > 1 ? (
                  <div className={styles.imageDots} aria-hidden="true">
                    {listing.images.map((image) => (
                      <span key={image} />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.titleRow}>
                  <h2>{listing.name}</h2>
                </div>
                {listing.comment ? (
                  <p className={styles.premiumDescription}>{listing.comment}</p>
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
                <button type="button" className={styles.consultButton}>
                  <SystemIcon name="chat" />
                  바로 상담하기
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className={styles.emptyState}>
          <strong>조건에 맞는 프리미엄 시설이 없습니다.</strong>
          <p>필터를 변경하거나 전체 카테고리에서 다시 확인해보세요.</p>
        </section>
      )}

      {totalPremiumPages > 1 ? (
        <nav className={styles.pagination} aria-label="프리미엄 시설 페이지">
          {Array.from({ length: totalPremiumPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={page === premiumPage ? styles.pageActive : ""}
              onClick={() => setPremiumPage(page)}
            >
              {page}
            </button>
          ))}
        </nav>
      ) : null}

      {basicListings.length ? (
        <section className={styles.basicSection}>
          <div className={styles.basicTitle}>
            <span />
            <strong>일반 요양원</strong>
            <span />
          </div>
          <div className={`${styles.basicGrid} ${viewMode === "list" ? styles.basicList : ""}`}>
            {basicListings.map((listing) => (
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
                <a href={`tel:${listing.phone ?? "1577-5776"}`} className={styles.phoneButton}>
                  전화상담
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
