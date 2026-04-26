import Link from "next/link";

import type { HomePageData } from "@/entities/home/model/types";
import {
  ContentRail,
  type RailCard
} from "@/features/home/ui/ContentRail";
import { RecommendedFacilitiesSection } from "@/features/home/ui/RecommendedFacilitiesSection";
import { BannerCarousel } from "@/features/home/ui/BannerCarousel";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import { ThemeCategoryIcon } from "@/shared/ui/icons/theme/ThemeCategoryIcon";
import styles from "@/widgets/home/ui/HomePage.module.css";

type HomePageViewProps = {
  data: HomePageData;
};

export function HomePageView({ data }: HomePageViewProps) {
  const tvCards: RailCard[] = data.tvItems.map((item) => ({
    id: item.id,
    href: item.href,
    title: item.title,
    imageUrl: item.imageUrl,
    embedUrl: item.embedUrl,
    meta: item.views
  }));

  const regionCards: RailCard[] = data.regionalFacilities.map((item) => ({
    id: item.id,
    href: item.href,
    title: item.title,
    imageUrl: item.imageUrl,
    subtitle: item.summary
  }));

  return (
    <div className={styles.page}>
      <section className={styles.heroBlock}>
        <BannerCarousel items={data.heroBanners} />
      </section>

      <div className={styles.quickSearch}>
        <form action="/search" method="get" className={styles.quickSearchCard}>
          <span className={styles.quickSearchLabel}>시설 검색</span>
          <SystemIcon name="search" className={styles.quickSearchIcon} />
          <input
            type="search"
            name="keyword"
            placeholder="어떤 요양시설을 찾아볼까요?"
            aria-label="메인 검색"
          />
          <button type="submit" className={styles.quickSearchButton}>
            검색하기
          </button>
        </form>
      </div>

      <main className={styles.main}>
        <section className={styles.categories}>
          <div className={styles.categoryGrid}>
            {data.categories.map((category) => (
              <Link key={category.id} href={category.href} className={styles.categoryLink}>
                <span
                  className={`${styles.categoryIcon} ${
                    styles[`tone-${category.tone}` as keyof typeof styles]
                  }`}
                >
                  <ThemeCategoryIcon name={category.icon} />
                </span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <Link href="/partner" className={styles.partnerPromo}>
          <span className={styles.partnerPromoText}>
            <strong>시설 운영자이신가요?</strong>
            <span>요양이에 입점하고 상담 연결을 받아보세요</span>
          </span>
          <span className={styles.partnerPromoButton}>입점 신청</span>
        </Link>

        <a
          href="tel:1577-5776"
          className={styles.consultPromo}
          aria-label="요양이 상담 전화 연결"
        >
          <img
            src="/image/banner/youtube-pc.png"
            alt="요양이 상담 배너"
            className={styles.consultPromoDesktop}
            loading="lazy"
          />
          <img
            src="/image/banner/youtube-mobile.png"
            alt="요양이 상담 배너"
            className={styles.consultPromoMobile}
            loading="lazy"
          />
        </a>

        <div className={styles.divider} />

        <div className={styles.sectionSpacing}>
          <RecommendedFacilitiesSection />
          <ContentRail
            title="요양이 TV"
            href="/tv"
            items={tvCards}
            variant="video"
          />
          <ContentRail
            title="지역별 시설"
            href="/regions"
            items={regionCards}
            variant="region"
          />
        </div>
      </main>
    </div>
  );
}
