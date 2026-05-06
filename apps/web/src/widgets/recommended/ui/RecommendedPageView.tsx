"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useMemo, useState } from "react";

import type { RecommendedFacility } from "@/entities/home/model/types";
import { siteConfig } from "@/shared/config/site";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import { CareListingImageSwiper } from "@/widgets/cases/ui/CareListingImageSwiper";
import styles from "@/widgets/recommended/ui/RecommendedPageView.module.css";

type ViewMode = "grid" | "list";

type RecommendedPageViewProps = {
  facilities: RecommendedFacility[];
};

type RecommendedLikeState = {
  isLiked: boolean;
  likeCount: number;
  isUpdating: boolean;
};

type RecommendedLikeStateMap = Record<string, RecommendedLikeState>;

const keywordSets = [
  ["프리미엄", "재활특화", "도심형"],
  ["차량운행", "인지재활", "맞춤식단"],
  ["치매전문", "넓은정원", "의료진상주"],
  ["문화프로그램", "호텔식", "가족상담"],
  ["고급식단", "24시간간호", "개인실"],
  ["소규모", "정성케어", "안심상담"],
];

function getFacilityHref(facility: RecommendedFacility) {
  return facility.href || `/facility/${facility.id}`;
}

function getFacilityImages(facility: RecommendedFacility) {
  return facility.imageUrls?.length
    ? facility.imageUrls
    : [facility.imageUrl || "/image/logo.png"];
}

function getRatingText(facility: RecommendedFacility) {
  if (typeof facility.rating === "number" && facility.rating > 0) {
    return facility.rating.toFixed(1);
  }

  return "추천";
}

function getKeywords(facility: RecommendedFacility, index: number) {
  const locationKeyword = facility.location?.split(/\s+/)[0];
  const fallbackKeywords =
    keywordSets[index % keywordSets.length] ?? keywordSets[0];
  const keywords = [
    facility.badge,
    locationKeyword,
    ...(fallbackKeywords ?? []),
  ].filter((keyword): keyword is string => Boolean(keyword));

  return Array.from(new Set(keywords)).slice(0, 3);
}

function formatLikeCount(count: number) {
  return Math.max(0, count).toLocaleString("ko-KR");
}

function getNextLikeCount(count: number, nextLiked: boolean) {
  return Math.max(0, count + (nextLiked ? 1 : -1));
}

function makeInitialLikeState(
  facilities: RecommendedFacility[],
): RecommendedLikeStateMap {
  return facilities.reduce<RecommendedLikeStateMap>((state, facility) => {
    state[facility.id] = {
      isLiked: Boolean(facility.isLiked),
      likeCount: facility.likeCount ?? 0,
      isUpdating: false,
    };

    return state;
  }, {});
}

function getLikeState(
  likeState: RecommendedLikeStateMap,
  facility: RecommendedFacility,
): RecommendedLikeState {
  return (
    likeState[facility.id] ?? {
      isLiked: Boolean(facility.isLiked),
      likeCount: facility.likeCount ?? 0,
      isUpdating: false,
    }
  );
}

export function RecommendedPageView({ facilities }: RecommendedPageViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [facilityLikes, setFacilityLikes] = useState<RecommendedLikeStateMap>(
    () => makeInitialLikeState(facilities),
  );
  const [selectedConsultFacility, setSelectedConsultFacility] =
    useState<RecommendedFacility | null>(null);
  const customerPhone = useMemo(
    () => formatKoreanPhoneNumber(siteConfig.customerPhone),
    [],
  );

  useEffect(() => {
    console.groupCollapsed(
      `[recommended:data] facilities (${facilities.length})`,
    );
    console.table(
      facilities.map((facility) => ({
        id: facility.id,
        name: facility.name,
        imageCount: getFacilityImages(facility).length,
        isLiked: Boolean(facility.isLiked),
        likeCount: facility.likeCount ?? 0,
      })),
    );
    console.log("raw facilities", facilities);
    console.groupEnd();
  }, [facilities]);

  useEffect(() => {
    if (!selectedConsultFacility) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedConsultFacility(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedConsultFacility]);

  useEffect(() => {
    setFacilityLikes(makeInitialLikeState(facilities));
  }, [facilities]);

  const toggleLike = async (
    event: MouseEvent<HTMLButtonElement>,
    facility: RecommendedFacility,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const currentLikeState = getLikeState(facilityLikes, facility);

    if (currentLikeState.isUpdating) {
      return;
    }

    const nextLiked = !currentLikeState.isLiked;

    setFacilityLikes((current) => ({
      ...current,
      [facility.id]: {
        ...getLikeState(current, facility),
        isUpdating: true,
      },
    }));

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(facility.id)}/like`,
        {
          method: nextLiked ? "POST" : "DELETE",
        },
      );
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.message || "찜 처리에 실패했습니다.");
      }

      setFacilityLikes((current) => {
        const latestLikeState = getLikeState(current, facility);

        return {
          ...current,
          [facility.id]: {
            isLiked: nextLiked,
            likeCount: getNextLikeCount(latestLikeState.likeCount, nextLiked),
            isUpdating: false,
          },
        };
      });
    } catch (error) {
      console.error("[recommended:like]", error);
      setFacilityLikes((current) => ({
        ...current,
        [facility.id]: {
          ...getLikeState(current, facility),
          isUpdating: false,
        },
      }));
    }
  };

  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div>
              <h1>요양이 추천 시설</h1>
              <p>
                요양이가 추천하는 시설을 한눈에 살펴보고 우리 가족에게 맞는 돌봄
                공간을 비교해보세요.
              </p>
            </div>
            <Link href="/cares" className={styles.searchLink}>
              전체 시설 검색
              <SystemIcon name="arrow-right" />
            </Link>
          </div>
        </header>

        <section className={styles.content} aria-label="추천 시설 목록">
          <div className={styles.toolbar}>
            <p>
              총 <strong>{facilities.length}</strong>개의 추천 시설
            </p>
            <div className={styles.viewSwitch} aria-label="보기 방식">
              <button
                type="button"
                className={viewMode === "grid" ? styles.viewActive : ""}
                onClick={() => setViewMode("grid")}
                aria-label="카드 보기"
                title="카드 보기"
              >
                <SystemIcon name="grid" />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? styles.viewActive : ""}
                onClick={() => setViewMode("list")}
                aria-label="목록 보기"
                title="목록 보기"
              >
                <SystemIcon name="list" />
              </button>
            </div>
          </div>

          {facilities.length ? (
            <div
              className={`${styles.grid} ${
                viewMode === "list" ? styles.list : ""
              }`}
            >
              {facilities.map((facility, index) => {
                const likeState = getLikeState(facilityLikes, facility);
                const formattedLikeCount = formatLikeCount(likeState.likeCount);

                return (
                  <article key={facility.id} className={styles.card}>
                    <Link
                      href={getFacilityHref(facility)}
                      className={styles.cardOverlay}
                      aria-label={`${facility.name} 상세보기`}
                    />

                    <div className={styles.media}>
                      <CareListingImageSwiper
                        images={getFacilityImages(facility)}
                        name={facility.name}
                        fallbackImage="/image/logo.png"
                      />
                      {facility.badge ? (
                        <span className={styles.badge}>{facility.badge}</span>
                      ) : null}
                      <button
                        type="button"
                        className={`${styles.likeButton} ${
                          likeState.isLiked ? styles.likeButtonActive : ""
                        }`}
                        aria-label={`${likeState.isLiked ? "찜 해제" : "찜하기"}, 좋아요 ${formattedLikeCount}개`}
                        aria-pressed={likeState.isLiked}
                        disabled={likeState.isUpdating}
                        onClick={(event) => toggleLike(event, facility)}
                      >
                        <SystemIcon name="heart" />
                        <span className={styles.likeButtonCount}>
                          {formattedLikeCount}
                        </span>
                      </button>
                    </div>

                    <div className={styles.body}>
                      <div className={styles.titleRow}>
                        <h2>{facility.name}</h2>
                        <span className={styles.rating}>
                          <SystemIcon name="star" />
                          {getRatingText(facility)}
                        </span>
                      </div>

                      <p className={styles.location}>
                        <SystemIcon name="map-pin" />
                        <span>{facility.location}</span>
                      </p>

                      <div className={styles.keywordRow}>
                        {getKeywords(facility, index).map((keyword) => (
                          <span key={keyword}>{keyword}</span>
                        ))}
                      </div>

                      <button
                        type="button"
                        className={styles.consultButton}
                        onClick={() => setSelectedConsultFacility(facility)}
                      >
                        <SystemIcon name="chat" />
                        바로 상담하기
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>추천 시설을 불러오지 못했습니다.</strong>
              <p>전체 시설 검색에서 조건에 맞는 요양시설을 확인해보세요.</p>
              <Link href="/cares">전체 시설 검색</Link>
            </div>
          )}
        </section>
      </main>

      {selectedConsultFacility ? (
        <div
          className={styles.consultOverlay}
          role="presentation"
          onClick={() => setSelectedConsultFacility(null)}
        >
          <section
            className={styles.consultDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recommended-consult-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.consultIcon} aria-hidden="true">
              <SystemIcon name="chat" />
            </div>
            <h2 id="recommended-consult-title">
              {selectedConsultFacility.name}
            </h2>
            <a href={`tel:${customerPhone}`} className={styles.consultPhone}>
              {customerPhone}
            </a>
            <p className={styles.consultHelp}>
              전화연결은 모바일에서 가능합니다
            </p>
            <button
              type="button"
              className={styles.consultConfirm}
              onClick={() => setSelectedConsultFacility(null)}
            >
              확인
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
