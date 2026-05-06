"use client";

import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { HeroBanner } from "@/entities/home/model/types";
import styles from "@/features/home/ui/BannerCarousel.module.css";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";

type BannerCarouselProps = {
  items: HeroBanner[];
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function BannerCarousel({ items }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function move(direction: -1 | 1) {
    startTransition(() => {
      setCurrentIndex((previous) => {
        const nextIndex = previous + direction;

        if (nextIndex < 0) {
          return items.length - 1;
        }

        if (nextIndex >= items.length) {
          return 0;
        }

        return nextIndex;
      });
    });
  }

  useEffect(() => {
    const timerId = window.setInterval(() => {
      startTransition(() => {
        setCurrentIndex((previous) => (previous + 1) % items.length);
      });
    }, 4000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [items.length]);

  return (
    <div className={styles.carousel}>
      <div
        className={styles.track}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => {
          const slideContent = (
            <>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority={index === 0}
                sizes="100vw"
                unoptimized
                className={`${styles.image} ${
                  item.mobileImageUrl ? styles.desktopImageWithMobile : ""
                }`}
              />
              {item.mobileImageUrl ? (
                <Image
                  src={item.mobileImageUrl}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  unoptimized
                  className={`${styles.image} ${styles.mobileImage}`}
                />
              ) : null}
              <div className={styles.overlay} />
            </>
          );

          return (
            <article key={item.id} className={styles.slide}>
              {isExternalHref(item.href) ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.slideLink}
                  aria-label={`${item.title} 새 창으로 보기`}
                >
                  {slideContent}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={styles.slideLink}
                  aria-label={`${item.title} 상세보기`}
                >
                  {slideContent}
                </Link>
              )}
            </article>
          );
        })}
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.leftArrow}`}
            aria-label="이전 배너"
            onClick={() => move(-1)}
          >
            <SystemIcon name="arrow-left" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.rightArrow}`}
            aria-label="다음 배너"
            onClick={() => move(1)}
          >
            <SystemIcon name="arrow-right" />
          </button>
        </>
      ) : null}

      {items.length > 1 ? (
        <div className={styles.mobileDots} aria-hidden="true">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={index === currentIndex ? styles.mobileDotActive : ""}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
