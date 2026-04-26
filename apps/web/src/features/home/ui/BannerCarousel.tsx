"use client";

import { startTransition, useEffect, useState } from "react";

import type { HeroBanner } from "@/entities/home/model/types";
import styles from "@/features/home/ui/BannerCarousel.module.css";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";

type BannerCarouselProps = {
  items: HeroBanner[];
};

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
          return (
            <article key={item.id} className={styles.slide}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`${styles.image} ${
                  item.mobileImageUrl ? styles.desktopImageWithMobile : ""
                }`}
                loading={index === 0 ? "eager" : "lazy"}
              />
              {item.mobileImageUrl ? (
                <img
                  src={item.mobileImageUrl}
                  alt={item.title}
                  className={`${styles.image} ${styles.mobileImage}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : null}
              <div className={styles.overlay} />
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
