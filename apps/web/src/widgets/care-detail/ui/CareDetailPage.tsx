import { ChangeEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import type {
  CareDetail,
  CareReview,
  CareReviewPage,
  CareReviewsData,
} from "@/entities/cares/model/detail-types";
import { siteConfig } from "@/shared/config/site";
import { createLoginUrl } from "@/shared/lib/auth-redirect";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/care-detail/ui/CareDetailPage.module.css";

type CareDetailPageProps = {
  detail: CareDetail;
  initialReviews: CareReviewsData;
};

type Amenity = {
  icon: "tree" | "chef" | "droplets" | "bath" | "wind";
  label: string;
  available?: boolean;
  value?: string;
};

type CareReviewsApiResponse = {
  status: number;
  message: string;
  data?: CareReview | null;
  list?: CareReview[];
  page?: CareReviewPage | null;
};

type FileUploadApiResponse = {
  status?: number;
  message?: string;
  fileId?: string;
  id?: string;
  url?: string;
  data?:
    | string
    | {
        fileId?: string;
        file_id?: string;
        id?: string;
        key?: string;
        url?: string;
        file?: {
          fileId?: string;
          file_id?: string;
          id?: string;
          key?: string;
          url?: string;
        };
      }
    | null;
};

type FeedbackAlert = {
  tone: "success" | "error" | "info";
  title: string;
  message: string;
};

const fallbackImage = "/image/logo.png";
const defaultBaseCareFee = 489_240;

const CareImageSwiper = dynamic(
  () =>
    import("@/widgets/care-detail/ui/CareImageSwiper").then(
      (module) => module.CareImageSwiper,
    ),
  {
    ssr: false,
  },
);

const CareKakaoMap = dynamic(
  () =>
    import("@/widgets/care-detail/ui/CareKakaoMap").then(
      (module) => module.CareKakaoMap,
    ),
  {
    ssr: false,
  },
);

const feeRows = [
  { grade: "1등급", dayFee: 93_070, monthlyFee: 2_792_100, userFee: 558_420 },
  { grade: "2등급", dayFee: 86_340, monthlyFee: 2_590_200, userFee: 518_040 },
  { grade: "3-5등급", dayFee: 81_540, monthlyFee: 2_446_200, userFee: 489_240 },
];

function formatCurrency(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

function formatNumber(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat("ko-KR").format(value);
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (parsedUrl.pathname.includes("/embed/")) {
      return url;
    }

    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.replace("/", "")}`;
    }

    if (host.includes("youtube.com")) {
      const videoId =
        parsedUrl.searchParams.get("v") ||
        parsedUrl.pathname.split("/").filter(Boolean).at(-1);

      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    return url;
  } catch {
    return url;
  }
}

function getBaseCareFee(detail: CareDetail) {
  return detail.residenceId === "R4466" ? 372_000 : defaultBaseCareFee;
}

function getFormattedDate(value?: string) {
  if (!value) {
    return "";
  }

  return value.split("T")[0] ?? value;
}

function getLoginUrl() {
  return createLoginUrl();
}

async function parseApiResponse(response: Response) {
  try {
    return (await response.json()) as { status?: number; message?: string };
  } catch {
    return {
      status: response.status,
      message: "서버 응답을 읽을 수 없습니다.",
    };
  }
}

function getUploadedFileId(data: FileUploadApiResponse) {
  if (typeof data.data === "string") {
    return data.data;
  }

  return (
    data.data?.fileId ||
    data.data?.file_id ||
    data.data?.id ||
    data.data?.key ||
    data.data?.file?.fileId ||
    data.data?.file?.file_id ||
    data.data?.file?.id ||
    data.data?.file?.key ||
    data.fileId ||
    data.id ||
    ""
  );
}

function getHandledErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getAmenities(detail: CareDetail): Amenity[] {
  const services = detail.plan?.services ?? [];
  const hasService = (code: string) =>
    services.some((service) => service.code === code);
  const heatingTypes = [
    hasService("OD") ? "온돌" : "",
    hasService("WA") ? "온풍" : "",
  ].filter(Boolean);

  return [
    { icon: "tree", label: "산책시설", available: hasService("WK") },
    { icon: "chef", label: "직영요리", available: hasService("CK") },
    {
      icon: "droplets",
      label: "난방형식",
      value: heatingTypes.length ? heatingTypes.join(", ") : undefined,
      available: Boolean(heatingTypes.length),
    },
    { icon: "bath", label: "방마다 화장실", available: hasService("PB") },
    { icon: "wind", label: "방마다 에어컨", available: hasService("PA") },
  ];
}

function ReviewCard({ review, title }: { review: CareReview; title: string }) {
  return (
    <article className={styles.reviewCard}>
      <div className={styles.reviewTop}>
        <div className={styles.reviewAuthor}>
          <span>후기</span>
          <div>
            <strong>{title}</strong>
            <small>{getFormattedDate(review.createdAt)}</small>
          </div>
        </div>
        {typeof review.score === "number" ? (
          <div className={styles.reviewRating}>
            <SystemIcon name="star" />
            {review.score}
          </div>
        ) : null}
      </div>
      {review.status && review.status.code !== "A" ? (
        <div className={styles.reviewStatus}>{review.status.name}</div>
      ) : null}
      {review.imageUrl ? (
        <Image
          className={styles.reviewImage}
          src={review.imageUrl}
          alt="후기 이미지"
          width={720}
          height={420}
          unoptimized
        />
      ) : null}
      <p>{review.content}</p>
    </article>
  );
}

export function CareDetailPage({
  detail,
  initialReviews,
}: CareDetailPageProps) {
  const images = useMemo(
    () =>
      detail.plan?.imageUrls?.length ? detail.plan.imageUrls : [fallbackImage],
    [detail.plan?.imageUrls],
  );
  const youtubeUrls = detail.plan?.youtubeUrls ?? [];
  const rawPhone =
    detail.plan?.address?.phoneNumber ||
    detail.address?.phoneNumber ||
    siteConfig.customerPhone;
  const phone = formatKoreanPhoneNumber(rawPhone);
  const fullAddress =
    [detail.plan?.address?.address1, detail.plan?.address?.address2]
      .filter(Boolean)
      .join(" ") ||
    detail.address?.address ||
    "주소 정보 준비중";
  const description =
    detail.plan?.explain ||
    detail.plan?.comment ||
    "시설 소개 정보가 준비중입니다.";
  const amenities = getAmenities(detail);
  const [isLiked, setIsLiked] = useState(Boolean(detail.activity?.isLiked));
  const [likeCount, setLikeCount] = useState(detail.count?.like ?? 0);
  const [isLikeUpdating, setIsLikeUpdating] = useState(false);
  const [myReview, setMyReview] = useState(initialReviews.myReview);
  const [reviewList, setReviewList] = useState(initialReviews.list);
  const [reviewPage, setReviewPage] = useState(initialReviews.page);
  const [reviewCurrentPage, setReviewCurrentPage] = useState(
    initialReviews.page?.currentPage ?? initialReviews.page?.page ?? 1,
  );
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const [reviewFileId, setReviewFileId] = useState<string | null>(null);
  const [isReviewImageUploading, setIsReviewImageUploading] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [feedbackAlert, setFeedbackAlert] = useState<FeedbackAlert | null>(
    null,
  );
  const baseCareFee = getBaseCareFee(detail);
  const monthlyMealAmount =
    typeof detail.plan?.mealAmount === "number"
      ? detail.plan.mealAmount * 90
      : undefined;
  const monthlySnackAmount =
    typeof detail.plan?.snackAmount === "number"
      ? detail.plan.snackAmount * 30
      : undefined;
  const estimatedTotal =
    typeof monthlyMealAmount === "number" &&
    typeof monthlySnackAmount === "number"
      ? baseCareFee + monthlyMealAmount + monthlySnackAmount
      : undefined;

  useEffect(() => {
    setIsLiked(Boolean(detail.activity?.isLiked));
    setLikeCount(detail.count?.like ?? 0);
  }, [detail.activity?.isLiked, detail.count?.like, detail.residenceId]);

  useEffect(() => {
    setMyReview(initialReviews.myReview);
    setReviewList(initialReviews.list);
    setReviewPage(initialReviews.page);
    setReviewCurrentPage(
      initialReviews.page?.currentPage ?? initialReviews.page?.page ?? 1,
    );
  }, [detail.residenceId, initialReviews]);

  useEffect(() => {
    if (!isReviewModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsReviewModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isReviewModalOpen]);

  const loadReviews = async (page = 1) => {
    setIsReviewLoading(true);

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(detail.residenceId)}/reviews?page=${page}`,
        {
          method: "GET",
          credentials: "same-origin",
        },
      );
      const data = (await response.json()) as CareReviewsApiResponse;

      if (!response.ok || data.status !== 200) {
        throw new Error(data.message || "후기 정보를 불러올 수 없습니다.");
      }

      setMyReview(data.data ?? null);
      setReviewList(data.list ?? []);
      setReviewPage(data.page ?? null);
      setReviewCurrentPage(page);
    } catch (error) {
      console.error("[care-detail:reviews]", error);
      setMyReview(null);
      setReviewList([]);
      setReviewPage(null);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const toggleLike = async () => {
    if (isLikeUpdating) {
      return;
    }

    const nextLiked = !isLiked;
    setIsLikeUpdating(true);

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(detail.residenceId)}/like`,
        {
          method: nextLiked ? "POST" : "DELETE",
          credentials: "same-origin",
        },
      );
      const data = await parseApiResponse(response);

      if (response.status === 401) {
        window.location.href = getLoginUrl();
        return;
      }

      if (!response.ok || data.status !== 200) {
        throw new Error(data.message || "찜 처리에 실패했습니다.");
      }

      setIsLiked(nextLiked);
      setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
    } catch (error) {
      console.error("[care-detail:like]", error);
      setFeedbackAlert({
        tone: "error",
        title: "처리하지 못했어요",
        message:
          error instanceof Error ? error.message : "찜 처리에 실패했습니다.",
      });
    } finally {
      setIsLikeUpdating(false);
    }
  };

  const openReviewModal = async () => {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        credentials: "same-origin",
      });

      if (response.status === 401) {
        window.location.href = getLoginUrl();
        return;
      }

      setIsReviewModalOpen(true);
    } catch {
      window.location.href = getLoginUrl();
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedbackAlert({
        tone: "info",
        title: "이미지 파일만 첨부할 수 있어요",
        message: "JPG, PNG 등 이미지 형식의 파일로 다시 선택해주세요.",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    setIsReviewImageUploading(true);
    setReviewFileId(null);

    try {
      const response = await fetch("/api/uploads/review/images", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });
      const data = (await response.json()) as FileUploadApiResponse;
      const isApiSuccessStatus =
        typeof data.status !== "number" ||
        (data.status >= 200 && data.status < 300);
      const uploadFailed = !response.ok || !isApiSuccessStatus;

      if (response.status === 401) {
        window.location.href = getLoginUrl();
        return;
      }

      const fileId = getUploadedFileId(data);

      if (uploadFailed) {
        setReviewImage(null);
        setReviewFileId(null);
        setFeedbackAlert({
          tone: "error",
          title: "사진을 첨부하지 못했어요",
          message:
            data.message && data.message !== "success"
              ? data.message
              : "이미지 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
        return;
      }

      if (!fileId) {
        console.warn("[care-detail:review-image] missing fileId", data);
        setReviewImage(null);
        setReviewFileId(null);
        setFeedbackAlert({
          tone: "error",
          title: "사진 저장 정보를 확인하지 못했어요",
          message:
            "이미지는 전송됐지만 저장 식별값이 없어 다시 첨부가 필요합니다.",
        });
        return;
      }

      setReviewFileId(fileId);
      setFeedbackAlert({
        tone: "success",
        title: "사진이 첨부됐어요",
        message: "후기 등록 시 선택한 이미지가 함께 저장됩니다.",
      });
    } catch (error) {
      const message = getHandledErrorMessage(
        error,
        "이미지 업로드에 실패했습니다.",
      );
      console.warn("[care-detail:review-image]", message);
      setReviewImage(null);
      setReviewFileId(null);
      setFeedbackAlert({
        tone: "error",
        title: "사진을 첨부하지 못했어요",
        message,
      });
    } finally {
      setIsReviewImageUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      setFeedbackAlert({
        tone: "info",
        title: "별점을 선택해주세요",
        message: "시설 이용 경험에 맞는 별점을 먼저 선택해야 합니다.",
      });
      return;
    }

    if (reviewContent.trim() === "") {
      setFeedbackAlert({
        tone: "info",
        title: "후기 내용을 입력해주세요",
        message: "보호자분들이 참고할 수 있도록 짧게라도 내용을 남겨주세요.",
      });
      return;
    }

    if (isReviewImageUploading) {
      setFeedbackAlert({
        tone: "info",
        title: "사진을 업로드하고 있어요",
        message: "이미지 첨부가 끝난 뒤 후기를 등록할 수 있습니다.",
      });
      return;
    }

    setIsReviewSubmitting(true);

    try {
      const response = await fetch(
        `/api/cares/${encodeURIComponent(detail.residenceId)}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            content: reviewContent.trim(),
            score: reviewRating,
            ...(reviewFileId ? { fileId: reviewFileId } : {}),
          }),
        },
      );
      const data = await parseApiResponse(response);

      if (response.status === 401) {
        window.location.href = getLoginUrl();
        return;
      }

      const isApiSuccessStatus =
        typeof data.status !== "number" ||
        (data.status >= 200 && data.status < 300);

      if (!response.ok || !isApiSuccessStatus) {
        setFeedbackAlert({
          tone: "error",
          title: "후기 내용을 확인해주세요",
          message: data.message || "후기 등록에 실패했습니다.",
        });
        return;
      }

      setIsReviewModalOpen(false);
      setReviewRating(0);
      setIsAnonymous(false);
      setReviewContent("");
      setReviewImage(null);
      setReviewFileId(null);
      await loadReviews(reviewCurrentPage);
      setFeedbackAlert({
        tone: "success",
        title: "후기가 등록됐어요",
        message: "소중한 후기가 시설을 찾는 분들에게 도움이 됩니다.",
      });
    } catch (error) {
      const message = getHandledErrorMessage(
        error,
        "후기 등록에 실패했습니다.",
      );
      console.warn("[care-detail:review-submit]", message);
      setFeedbackAlert({
        tone: "error",
        title: "후기를 등록하지 못했어요",
        message,
      });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const reviewTotal =
    reviewPage?.totalItems ?? reviewList.length + (myReview ? 1 : 0);
  const reviewTotalPages = reviewPage?.totalPages ?? 0;
  const formattedLikeCount = likeCount.toLocaleString("ko-KR");
  const likeActionLabel = `${isLiked ? "찜 해제" : "찜하기"}, 좋아요 ${formattedLikeCount}개`;

  return (
    <main className={styles.page}>
      <section
        className={styles.imageSlider}
        aria-label={`${detail.name} 이미지`}
      >
        <CareImageSwiper
          images={images}
          name={detail.name}
          fallbackImage={fallbackImage}
        />

        <button
          type="button"
          className={`${styles.likeButton} ${isLiked ? styles.likeButtonActive : ""}`}
          onClick={toggleLike}
          disabled={isLikeUpdating}
          aria-label={likeActionLabel}
          aria-pressed={isLiked}
        >
          <SystemIcon name="heart" />
        </button>
      </section>

      <div className={styles.content}>
        <section className={styles.titleSection}>
          <h1>{detail.name}</h1>
          {detail.plan?.comment ? <p>{detail.plan.comment}</p> : null}

          <div className={styles.summaryRow}>
            <div className={styles.recommendBadge}>추천</div>
            <button
              type="button"
              className={`${styles.likeSummary} ${isLiked ? styles.likeSummaryActive : ""}`}
              onClick={toggleLike}
              disabled={isLikeUpdating}
              aria-label={likeActionLabel}
              aria-pressed={isLiked}
            >
              <SystemIcon name="heart" />
              <strong>{formattedLikeCount}</strong>
            </button>
          </div>
        </section>

        <section className={styles.detailSection}>
          <h2>시설 소개</h2>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </section>

        {youtubeUrls.length ? (
          <section className={styles.detailSection}>
            <h2 className={styles.iconTitle}>
              <SystemIcon name="play" />
              영상으로 확인하기
            </h2>
            <div className={styles.videoList}>
              {youtubeUrls.map((url, index) => (
                <div key={`${url}-${index}`} className={styles.videoFrame}>
                  <iframe
                    src={getYoutubeEmbedUrl(url)}
                    title={`${detail.name} 소개 영상 ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.detailSection}>
          <h2>시설 이용 요금</h2>
          <div className={styles.feeNotice}>
            요양원 입소비는{" "}
            <b>본인부담금+식비와 간식비+상급병실비용(선택)+이·미용비</b> 입니다.
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.feeTable}>
              <thead>
                <tr>
                  <th>등 급</th>
                  <th>1일수가</th>
                  <th>급여비용 합계</th>
                  <th>본인부담률</th>
                  <th>본인부담금</th>
                </tr>
              </thead>
              <tbody>
                {feeRows.map((row) => (
                  <tr key={row.grade}>
                    <td>{row.grade}</td>
                    <td>{formatNumber(row.dayFee)}</td>
                    <td>{formatNumber(row.monthlyFee)}</td>
                    <td>20%</td>
                    <td>{formatNumber(row.userFee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.feeNotes}>
            <p>
              · 본인부담금은 건강보험 공단이 정해놓은 수가(일일 비용)의 20%
              이며, 2026년도 공단 수가는 위와 같습니다.
            </p>
            <p>· 이는 국가가 정해놓은 금액이며, 전국 공통입니다.</p>
          </div>

          <div className={styles.calculationBox}>
            <h3>3~5등급 본인부담금 20% 기준</h3>
            <p className={styles.basePrice}>월 2,446,200원</p>
            <p className={styles.totalPrice}>
              기본금액 ({formatCurrency(baseCareFee)})
              {typeof monthlyMealAmount === "number"
                ? ` + 식비 (${formatCurrency(monthlyMealAmount)})`
                : ""}
              {typeof monthlySnackAmount === "number"
                ? ` + 간식비 (${formatCurrency(monthlySnackAmount)})`
                : ""}
              {typeof estimatedTotal === "number" ? (
                <>
                  {" "}
                  = <strong>{formatCurrency(estimatedTotal)}</strong>
                </>
              ) : null}
            </p>
            <p className={styles.feeDescription}>
              식비는 일일 아침, 점심, 저녁 한달 기준(30일)이며 간식비는 한달
              기준(30일) 기준입니다.
            </p>
          </div>

          <div className={styles.contactInfoList}>
            <div className={styles.infoLineCard}>
              <span>
                <SystemIcon name="phone" />
              </span>
              <div>
                <small>연락처</small>
                <strong>{phone}</strong>
              </div>
            </div>
            <div className={styles.infoLineCard}>
              <span>
                <SystemIcon name="map-pin" />
              </span>
              <div>
                <small>주소</small>
                <strong>{fullAddress}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.detailSection}>
          <h2>허가 인원</h2>
          <div className={styles.capacityCard}>
            <span>정원</span>
            <strong>
              {typeof detail.capacity === "number"
                ? `${detail.capacity}명`
                : "-"}
            </strong>
          </div>
        </section>

        <section className={styles.detailSection}>
          <h2>편의 사항</h2>
          <div className={styles.amenityList}>
            {amenities.map((amenity) => (
              <div key={amenity.label} className={styles.amenityItem}>
                <div className={styles.amenityName}>
                  <span>
                    <SystemIcon name={amenity.icon} />
                  </span>
                  <strong>{amenity.label}</strong>
                </div>
                {amenity.value ? (
                  <em className={styles.valueBadge}>{amenity.value}</em>
                ) : amenity.available ? (
                  <em className={styles.availableBadge}>
                    <SystemIcon name="check" />
                    제공
                  </em>
                ) : (
                  <em className={styles.unavailableBadge}>
                    <SystemIcon name="x" />
                    제공안함
                  </em>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.detailSection}>
          <h2>위치</h2>
          <div className={styles.addressCard}>
            <SystemIcon name="map-pin" />
            <p>{fullAddress}</p>
          </div>
          <div className={styles.mapBox}>
            <CareKakaoMap
              latitude={detail.plan?.address?.latitude}
              longitude={detail.plan?.address?.longitude}
              name={detail.name}
              address={fullAddress}
            />
          </div>
        </section>

        <section className={styles.reviewSection}>
          <div className={styles.reviewHead}>
            <h2>이용 후기 ({reviewTotal})</h2>
            {!myReview ? (
              <button type="button" onClick={openReviewModal}>
                후기 작성
              </button>
            ) : null}
          </div>

          <div className={styles.reviewList}>
            {myReview ? <ReviewCard review={myReview} title="내 후기" /> : null}
            {reviewList.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                title="이용 후기"
              />
            ))}
            {!myReview && !reviewList.length ? (
              <div className={styles.reviewEmpty}>
                {isReviewLoading
                  ? "후기를 불러오는 중입니다."
                  : "등록된 이용 후기가 없습니다."}
              </div>
            ) : null}
          </div>

          {reviewTotalPages > 1 ? (
            <div className={styles.reviewPagination}>
              <button
                type="button"
                disabled={reviewCurrentPage <= 1 || isReviewLoading}
                onClick={() => loadReviews(Math.max(1, reviewCurrentPage - 1))}
              >
                이전
              </button>
              <span>
                {reviewCurrentPage} / {reviewTotalPages}
              </span>
              <button
                type="button"
                disabled={
                  reviewCurrentPage >= reviewTotalPages || isReviewLoading
                }
                onClick={() => loadReviews(reviewCurrentPage + 1)}
              >
                다음
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {isReviewModalOpen ? (
        <div className={styles.modalRoot} role="presentation">
          <button
            type="button"
            className={styles.modalBackdrop}
            aria-label="후기 작성 닫기"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <section
            className={styles.reviewModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
          >
            <header className={styles.modalHeader}>
              <h3 id="review-modal-title">이용 후기 작성</h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                aria-label="닫기"
              >
                <SystemIcon name="x" />
              </button>
            </header>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>별점 선택</label>
                <div className={styles.starSelect}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= reviewRating ? styles.starActive : ""}
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star}점`}
                    >
                      <SystemIcon name="star" />
                    </button>
                  ))}
                  {reviewRating > 0 ? <strong>{reviewRating}.0</strong> : null}
                </div>
              </div>

              <label className={styles.checkboxLabel}>
                <button
                  type="button"
                  className={isAnonymous ? styles.checkboxActive : ""}
                  onClick={() => setIsAnonymous((current) => !current)}
                  aria-label="익명으로 작성하기"
                >
                  {isAnonymous ? <SystemIcon name="check" /> : null}
                </button>
                익명으로 작성하기
              </label>

              <div className={styles.formGroup}>
                <label>사진 첨부 (선택)</label>
                {reviewImage ? (
                  <div className={styles.previewImage}>
                    <Image
                      src={reviewImage}
                      alt="후기 첨부 이미지"
                      width={720}
                      height={384}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setReviewImage(null);
                        setReviewFileId(null);
                      }}
                      aria-label="사진 삭제"
                    >
                      <SystemIcon name="x" />
                    </button>
                    {isReviewImageUploading ? (
                      <small>이미지 업로드 중입니다.</small>
                    ) : null}
                  </div>
                ) : (
                  <label className={styles.uploadBox}>
                    <SystemIcon name="upload" />
                    <span>사진을 선택해주세요</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="review-content">후기 내용</label>
                <textarea
                  id="review-content"
                  value={reviewContent}
                  onChange={(event) => setReviewContent(event.target.value)}
                  placeholder="시설 이용 경험을 자세히 작성해주세요."
                  rows={6}
                  maxLength={500}
                />
                <small>{reviewContent.length} / 500자</small>
              </div>
            </div>

            <footer className={styles.modalFooter}>
              <button type="button" onClick={() => setIsReviewModalOpen(false)}>
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isReviewSubmitting || isReviewImageUploading}
              >
                {isReviewSubmitting ? "등록 중" : "등록하기"}
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {feedbackAlert ? (
        <div className={styles.feedbackRoot} role="presentation">
          <button
            type="button"
            className={styles.feedbackBackdrop}
            aria-label="알림 닫기"
            onClick={() => setFeedbackAlert(null)}
          />
          <section
            className={`${styles.feedbackDialog} ${
              feedbackAlert.tone === "error" ? styles.feedbackDialogError : ""
            }`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="care-feedback-title"
            aria-describedby="care-feedback-message"
          >
            <div
              className={`${styles.feedbackIcon} ${
                feedbackAlert.tone === "success"
                  ? styles.feedbackIconSuccess
                  : feedbackAlert.tone === "error"
                    ? styles.feedbackIconError
                    : styles.feedbackIconInfo
              }`}
              aria-hidden="true"
            >
              <SystemIcon
                name={feedbackAlert.tone === "error" ? "x" : "check"}
              />
            </div>
            <h3 id="care-feedback-title">{feedbackAlert.title}</h3>
            <p id="care-feedback-message">{feedbackAlert.message}</p>
            <button
              type="button"
              className={`${styles.feedbackConfirm} ${
                feedbackAlert.tone === "error"
                  ? styles.feedbackConfirmError
                  : ""
              }`}
              onClick={() => setFeedbackAlert(null)}
            >
              확인
            </button>
          </section>
        </div>
      ) : null}

      <div className={styles.mobileCallBar}>
        <div>
          <strong>{detail.name}</strong>
          <span>{phone}</span>
        </div>
        <a href={`tel:${phone}`}>상담하기</a>
      </div>
    </main>
  );
}
