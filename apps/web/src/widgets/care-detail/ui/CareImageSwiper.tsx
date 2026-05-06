import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/care-detail/ui/CareDetailPage.module.css";

type CareImageSwiperProps = {
  images: string[];
  name: string;
  fallbackImage: string;
};

export function CareImageSwiper({ images, name, fallbackImage }: CareImageSwiperProps) {
  const swiperElementRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);
  const imageSources = images.length ? images : [fallbackImage];
  const imageKey = imageSources.join("|");
  const hasMultipleImages = imageSources.length > 1;

  useEffect(() => {
    if (!swiperElementRef.current) {
      return;
    }

    swiperInstanceRef.current?.destroy(true, true);
    swiperInstanceRef.current = new Swiper(swiperElementRef.current, {
      modules: [Navigation, Pagination],
      loop: hasMultipleImages,
      speed: 400,
      slidesPerView: 1,
      navigation:
        hasMultipleImages
          ? {
              prevEl: prevButtonRef.current,
              nextEl: nextButtonRef.current
            }
          : false,
      pagination:
        hasMultipleImages
          ? {
              el: paginationRef.current,
              clickable: true
            }
          : false
    });

    return () => {
      swiperInstanceRef.current?.destroy(true, true);
      swiperInstanceRef.current = null;
    };
  }, [fallbackImage, hasMultipleImages, imageKey]);

  return (
    <div ref={swiperElementRef} className={`${styles.swiper} swiper`}>
      <div className="swiper-wrapper">
        {imageSources.map((image, index) => (
          <div key={`${image}-${index}`} className="swiper-slide">
            <CareSlideImage
              image={image}
              fallbackImage={fallbackImage}
              alt={`${name} ${index + 1}`}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {hasMultipleImages ? (
        <>
          <button
            ref={prevButtonRef}
            type="button"
            className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
            aria-label="이전 이미지"
          >
            <SystemIcon name="arrow-left" />
          </button>
          <button
            ref={nextButtonRef}
            type="button"
            className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
            aria-label="다음 이미지"
          >
            <SystemIcon name="arrow-right" />
          </button>
          <div ref={paginationRef} className="swiper-pagination" />
        </>
      ) : null}
    </div>
  );
}

function CareSlideImage({
  image,
  fallbackImage,
  alt,
  priority,
}: {
  image: string;
  fallbackImage: string;
  alt: string;
  priority: boolean;
}) {
  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="100vw"
      priority={priority}
      unoptimized
      style={{ objectFit: "cover" }}
      onError={() => {
        if (imageSrc !== fallbackImage) {
          setImageSrc(fallbackImage);
        }
      }}
    />
  );
}
