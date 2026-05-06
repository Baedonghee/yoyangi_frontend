import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/cases/ui/CasesPageView.module.css";

type CareListingImageSwiperProps = {
  images: string[];
  name: string;
  fallbackImage?: string;
};

export function CareListingImageSwiper({
  images,
  name,
  fallbackImage = "/image/logo.png",
}: CareListingImageSwiperProps) {
  const swiperElementRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);
  const imageSources = useMemo(
    () => (images.length ? images : [fallbackImage]),
    [fallbackImage, images],
  );
  const imageKey = imageSources.join("|");
  const hasMultipleImages = imageSources.length > 1;

  useEffect(() => {
    let isMounted = true;

    function initSwiper() {
      if (!swiperElementRef.current) {
        return;
      }

      if (!isMounted || !swiperElementRef.current) {
        return;
      }

      swiperInstanceRef.current?.destroy(true, true);
      swiperInstanceRef.current = new Swiper(swiperElementRef.current, {
        modules: [Navigation, Pagination],
        loop: hasMultipleImages,
        speed: 360,
        slidesPerView: 1,
        navigation: hasMultipleImages
          ? {
              prevEl: prevButtonRef.current,
              nextEl: nextButtonRef.current,
            }
          : false,
        pagination: hasMultipleImages
          ? {
              el: paginationRef.current,
              clickable: false,
            }
          : false,
      });
    }

    initSwiper();

    return () => {
      isMounted = false;
      swiperInstanceRef.current?.destroy(true, true);
      swiperInstanceRef.current = null;
    };
  }, [hasMultipleImages, imageKey]);

  return (
    <div ref={swiperElementRef} className={`${styles.imageSwiper} swiper`}>
      <div className="swiper-wrapper">
        {imageSources.map((image, index) => (
          <div key={`${image}-${index}`} className="swiper-slide">
            <CareListingSlideImage
              image={image}
              fallbackImage={fallbackImage}
              alt={`${name} ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {hasMultipleImages ? (
        <>
          <button
            ref={prevButtonRef}
            type="button"
            className={`${styles.imageArrow} ${styles.imageArrowLeft}`}
            aria-label="이전 이미지"
            onClick={(event) => event.stopPropagation()}
          >
            <SystemIcon name="arrow-left" />
          </button>
          <button
            ref={nextButtonRef}
            type="button"
            className={`${styles.imageArrow} ${styles.imageArrowRight}`}
            aria-label="다음 이미지"
            onClick={(event) => event.stopPropagation()}
          >
            <SystemIcon name="arrow-right" />
          </button>
          <div ref={paginationRef} className="swiper-pagination" />
        </>
      ) : null}
    </div>
  );
}

function CareListingSlideImage({
  image,
  fallbackImage,
  alt,
}: {
  image: string;
  fallbackImage: string;
  alt: string;
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
      sizes="(max-width: 768px) 100vw, 360px"
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
