"use client";

import Link from "next/link";
import { useRef } from "react";

import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/features/home/ui/ContentRail.module.css";

export type RailVariant = "recommended" | "video" | "region";

export type RailCard = {
  id: string;
  href: string;
  title: string;
  imageUrl: string;
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

export function ContentRail({
  title,
  href,
  items,
  variant
}: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

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
        <button
          type="button"
          className={`${styles.arrow} ${styles.leftArrow}`}
          aria-label={`${title} 이전`}
          onClick={() => move(-1)}
        >
          <SystemIcon name="arrow-left" />
        </button>
        <div ref={railRef} className={styles.rail}>
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
                      {item.subtitle}
                    </p>
                    <div className={styles.recommendedFooter}>
                      {typeof item.rating === "number" ? (
                        <span className={styles.rating}>
                          <SystemIcon name="star" />
                          {item.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className={styles.consultationLabel}>
                        {item.consultationLabel}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }

            if (variant === "video") {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.card} ${styles.videoCard}`}
                >
                  <div className={styles.media}>
                    <img src={item.imageUrl} alt={item.title} className={styles.image} />
                    <span className={styles.playButton}>
                      <SystemIcon name="play" />
                    </span>
                  </div>
                  <div className={styles.videoBody}>
                    <h3>{item.title}</h3>
                    <p className={styles.videoMeta}>{item.meta}</p>
                  </div>
                </Link>
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
                    <span className={styles.regionCta}>
                      {item.subtitle}
                      <SystemIcon name="arrow-right" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          className={`${styles.arrow} ${styles.rightArrow}`}
          aria-label={`${title} 다음`}
          onClick={() => move(1)}
        >
          <SystemIcon name="arrow-right" />
        </button>
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
