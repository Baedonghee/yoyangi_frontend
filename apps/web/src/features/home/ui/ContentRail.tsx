"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/features/home/ui/ContentRail.module.css";

export type RailVariant = "recommended" | "video" | "region";

export type RailCard = {
  id: string;
  href: string;
  title: string;
  imageUrl: string;
  embedUrl?: string;
  subtitle?: string;
  badge?: string;
  rating?: number;
  consultationLabel?: string;
  meta?: string;
};

type ContentRailProps = {
  title: string;
  href: string;
  items: RailCard[];
  variant: RailVariant;
};

const SCROLL_EDGE_THRESHOLD = 8;

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^?&/]+)/);

  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : "";
}

export function ContentRail({
  title,
  href,
  items,
  variant
}: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [scrollButtons, setScrollButtons] = useState({
    left: false,
    right: false
  });

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
      right: hasOverflow && hasHiddenRightItem
    };

    setScrollButtons((currentState) =>
      currentState.left === nextState.left &&
      currentState.right === nextState.right
        ? currentState
        : nextState
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
      behavior: "smooth"
    });
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

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <Link href={href} className={styles.headerLink}>
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
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.card} ${styles.recommendedCard}`}
                >
                  <div className={styles.media}>
                    <img src={item.imageUrl} alt={item.title} className={styles.image} />
                    <span className={styles.recommendedBadge}>{item.badge}</span>
                    <span className={styles.favoriteButton}>
                      <SystemIcon name="heart" />
                    </span>
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
                </Link>
              );
            }

            if (variant === "video") {
              const embedUrl = item.embedUrl || getYoutubeEmbedUrl(item.href);
              const isExternalLink = /^https?:\/\//.test(item.href);

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
                      <img src={item.imageUrl} alt={item.title} className={styles.image} />
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
                  <img src={item.imageUrl} alt={item.title} className={styles.image} />
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

export function RailSkeleton({
  title,
  href
}: {
  title: string;
  href: string;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <Link href={href} className={styles.headerLink}>
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
