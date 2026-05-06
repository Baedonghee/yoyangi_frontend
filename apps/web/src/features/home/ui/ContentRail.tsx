"use client";

import Link from "next/link";
import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import { CareListingImageSwiper } from "@/widgets/cases/ui/CareListingImageSwiper";
import styles from "@/features/home/ui/ContentRail.module.css";

export type RailVariant = "recommended" | "video" | "region";

export type RailCard = {
  id: string;
  href: string;
  title: string;
  imageUrl: string;
  imageUrls?: string[];
  embedUrl?: string;
  subtitle?: string;
  badge?: string;
  rating?: number;
  consultationLabel?: string;
  meta?: string;
  isLiked?: boolean;
  likeCount?: number;
};

type ContentRailProps = {
  title: string;
  href: string;
  items: RailCard[];
  variant: RailVariant;
};

const SCROLL_EDGE_THRESHOLD = 8;

type RailLikeState = {
  isLiked: boolean;
  likeCount: number;
  isUpdating: boolean;
};

type RailLikeStateMap = Record<string, RailLikeState>;

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^?&/]+)/);

  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : "";
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function formatLikeCount(count: number) {
  return Math.max(0, count).toLocaleString("ko-KR");
}

function getNextLikeCount(count: number, nextLiked: boolean) {
  return Math.max(0, count + (nextLiked ? 1 : -1));
}

function makeInitialLikeState(items: RailCard[]): RailLikeStateMap {
  return items.reduce<RailLikeStateMap>((state, item) => {
    state[item.id] = {
      isLiked: Boolean(item.isLiked),
      likeCount: item.likeCount ?? 0,
      isUpdating: false,
    };

    return state;
  }, {});
}

function getLikeState(
  likeState: RailLikeStateMap,
  item: RailCard,
): RailLikeState {
  return (
    likeState[item.id] ?? {
      isLiked: Boolean(item.isLiked),
      likeCount: item.likeCount ?? 0,
      isUpdating: false,
    }
  );
}

export function ContentRail({ title, href, items, variant }: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [recommendedLikes, setRecommendedLikes] = useState<RailLikeStateMap>(
    () => makeInitialLikeState(items),
  );
  const [scrollButtons, setScrollButtons] = useState({
    left: false,
    right: false,
  });
  const isHeaderExternalLink = isExternalHref(href);

  function updateScrollButtons() {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const firstItem = rail.firstElementChild;
    const lastItem = rail.lastElementChild;
    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const hasOverflow = maxScrollLeft > SCROLL_EDGE_THRESHOLD;
    const railRect = rail.getBoundingClientRect();
    const firstItemRect = firstItem?.getBoundingClientRect();
    const lastItemRect = lastItem?.getBoundingClientRect();
    const hasHiddenLeftItem = firstItemRect
      ? firstItemRect.left < railRect.left - SCROLL_EDGE_THRESHOLD
      : false;
    const hasHiddenRightItem = lastItemRect
      ? lastItemRect.right > railRect.right + SCROLL_EDGE_THRESHOLD
      : false;
    const nextState = {
      left: hasOverflow && hasHiddenLeftItem,
      right: hasOverflow && hasHiddenRightItem,
    };

    setScrollButtons((currentState) =>
      currentState.left === nextState.left &&
      currentState.right === nextState.right
        ? currentState
        : nextState,
    );
  }

  function handleRailScroll() {
    if (scrollFrameRef.current !== null) {
      return;
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      updateScrollButtons();
    });
  }

  function move(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      left: rail.clientWidth * 0.82 * direction,
      behavior: "smooth",
    });
  }

  async function toggleRecommendedLike(
    event: MouseEvent<HTMLButtonElement>,
    item: RailCard,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const currentLikeState = getLikeState(recommendedLikes, item);

    if (currentLikeState.isUpdating) {
      return;
    }

    const nextLiked = !currentLikeState.isLiked;

    setRecommendedLikes((current) => ({
      ...current,
      [item.id]: {
        ...getLikeState(current, item),
        isUpdating: true,
      },
    }));

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(item.id)}/like`,
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

      setRecommendedLikes((current) => {
        const latestLikeState = getLikeState(current, item);

        return {
          ...current,
          [item.id]: {
            isLiked: nextLiked,
            likeCount: getNextLikeCount(latestLikeState.likeCount, nextLiked),
            isUpdating: false,
          },
        };
      });
    } catch (error) {
      console.error("[home:recommended-like]", error);
      setRecommendedLikes((current) => ({
        ...current,
        [item.id]: {
          ...getLikeState(current, item),
          isUpdating: false,
        },
      }));
    }
  }

  useEffect(() => {
    const rail = railRef.current;

    updateScrollButtons();

    if (!rail) {
      return undefined;
    }

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateScrollButtons);

      return () => {
        window.removeEventListener("resize", updateScrollButtons);
        if (scrollFrameRef.current !== null) {
          window.cancelAnimationFrame(scrollFrameRef.current);
        }
      };
    }

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(rail);
    Array.from(rail.children).forEach((child) => resizeObserver.observe(child));

    return () => {
      resizeObserver.disconnect();
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [items.length, variant]);

  useEffect(() => {
    if (variant !== "recommended") {
      return;
    }

    setRecommendedLikes(makeInitialLikeState(items));
  }, [items, variant]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <Link
          href={href}
          className={styles.headerLink}
          target={isHeaderExternalLink ? "_blank" : undefined}
          rel={isHeaderExternalLink ? "noopener noreferrer" : undefined}
        >
          전체보기
          <SystemIcon name="arrow-right" />
        </Link>
      </div>

      <div className={styles.railWrap}>
        {scrollButtons.left ? (
          <button
            type="button"
            className={`${styles.arrow} ${styles.leftArrow}`}
            aria-label={`${title} 이전`}
            onClick={() => move(-1)}
          >
            <SystemIcon name="arrow-left" />
          </button>
        ) : null}
        <div
          ref={railRef}
          onScroll={handleRailScroll}
          className={`${styles.rail} ${
            variant === "region"
              ? styles.regionRail
              : variant === "video"
                ? styles.videoRail
                : ""
          }`}
        >
          {items.map((item) => {
            if (variant === "recommended") {
              const likeState = getLikeState(recommendedLikes, item);
              const formattedLikeCount = formatLikeCount(likeState.likeCount);
              const imageSources = item.imageUrls?.length
                ? item.imageUrls
                : [item.imageUrl];

              return (
                <article
                  key={item.id}
                  className={`${styles.card} ${styles.recommendedCard}`}
                >
                  <Link
                    href={item.href}
                    className={styles.recommendedLinkOverlay}
                    aria-label={`${item.title} 상세보기`}
                  />
                  <div className={`${styles.media} ${styles.recommendedMedia}`}>
                    <CareListingImageSwiper
                      images={imageSources}
                      name={item.title}
                    />
                    <span className={styles.recommendedBadge}>
                      {item.badge}
                    </span>
                    <button
                      type="button"
                      className={`${styles.favoriteButton} ${
                        likeState.isLiked ? styles.favoriteButtonActive : ""
                      }`}
                      aria-label={`${likeState.isLiked ? "찜 해제" : "찜하기"}, 좋아요 ${formattedLikeCount}개`}
                      aria-pressed={likeState.isLiked}
                      disabled={likeState.isUpdating}
                      onClick={(event) => toggleRecommendedLike(event, item)}
                    >
                      <SystemIcon name="heart" />
                      <span className={styles.favoriteButtonCount}>
                        {formattedLikeCount}
                      </span>
                    </button>
                  </div>
                  <div className={styles.recommendedBody}>
                    <h3>{item.title}</h3>
                    <p className={styles.location}>
                      <SystemIcon name="map-pin" />
                      <span>{item.subtitle}</span>
                    </p>
                    <div className={styles.recommendedFooter}>
                      <span className={styles.consultationLabel}>
                        {item.consultationLabel}
                      </span>
                    </div>
                  </div>
                </article>
              );
            }

            if (variant === "video") {
              const embedUrl = item.embedUrl || getYoutubeEmbedUrl(item.href);
              const isExternalLink = isExternalHref(item.href);

              return (
                <article
                  key={item.id}
                  className={`${styles.card} ${styles.videoCard}`}
                >
                  <div className={styles.media}>
                    {embedUrl ? (
                      <iframe
                        className={styles.videoFrame}
                        src={embedUrl}
                        title={item.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 520px"
                        unoptimized
                        className={styles.image}
                      />
                    )}
                  </div>
                  <div className={styles.videoBody}>
                    <h3>
                      <a
                        href={item.href}
                        target={isExternalLink ? "_blank" : undefined}
                        rel={isExternalLink ? "noreferrer" : undefined}
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className={styles.videoMeta}>{item.meta}</p>
                  </div>
                </article>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.card} ${styles.regionCard}`}
              >
                <div className={styles.media}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 45vw, 260px"
                    unoptimized
                    className={styles.image}
                  />
                  <div className={styles.regionOverlay}>
                    <h3>{item.title}</h3>
                    <p className={styles.regionSummary}>{item.subtitle}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {scrollButtons.right ? (
          <button
            type="button"
            className={`${styles.arrow} ${styles.rightArrow}`}
            aria-label={`${title} 다음`}
            onClick={() => move(1)}
          >
            <SystemIcon name="arrow-right" />
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function RailSkeleton({ title, href }: { title: string; href: string }) {
  const isHeaderExternalLink = isExternalHref(href);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <Link
          href={href}
          className={styles.headerLink}
          target={isHeaderExternalLink ? "_blank" : undefined}
          rel={isHeaderExternalLink ? "noopener noreferrer" : undefined}
        >
          전체보기
          <SystemIcon name="arrow-right" />
        </Link>
      </div>
      <div className={styles.rail}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard} />
        ))}
      </div>
    </section>
  );
}
