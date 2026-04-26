"use client";

import { startTransition, useEffect, useState } from "react";

import type { HeroBanner } from "@/entities/home/model/types";
import styles from "@/features/home/ui/BannerCarousel.module.css";

type BannerCarouselProps = {
  items: HeroBanner[];
};

export function BannerCarousel({ items }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
                className={styles.image}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className={styles.overlay} />
            </article>
          );
        })}
      </div>

      <div className={styles.dots}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`${index + 1}번 배너 보기`}
            aria-pressed={currentIndex === index}
            className={`${styles.dot} ${currentIndex === index ? styles.dotActive : ""}`}
            onClick={() => {
              startTransition(() => {
                setCurrentIndex(index);
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
