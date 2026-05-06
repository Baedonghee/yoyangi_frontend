import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { getCareDetail } from "@/entities/cares/api/get-care-detail";
import { getCareReviews } from "@/entities/cares/api/get-care-reviews";
import type {
  CareDetail,
  CareReviewsData,
} from "@/entities/cares/model/detail-types";
import { siteConfig } from "@/shared/config/site";
import { CareDetailPage } from "@/widgets/care-detail/ui/CareDetailPage";

type FacilityPageProps = {
  detail: CareDetail;
  reviews: CareReviewsData;
};

export const getServerSideProps: GetServerSideProps<FacilityPageProps> = async (
  context,
) => {
  const id = context.params?.id;

  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  const token = context.req.cookies.token;
  const detail = await getCareDetail(id, token);

  if (!detail) {
    return {
      notFound: true,
    };
  }

  const reviews = await getCareReviews(id, 1, token);

  return {
    props: {
      detail,
      reviews,
    },
  };
};

export default function FacilityPage({
  detail,
  reviews,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = `${detail.name} | 요양이`;
  const description =
    detail.plan?.comment ||
    detail.plan?.explain ||
    `${detail.name}의 시설 소개, 이용 요금, 위치 정보를 확인하세요.`;
  const canonicalUrl = new URL(
    `/care/${detail.residenceId}`,
    siteConfig.siteUrl,
  ).toString();
  const ogImage = detail.plan?.imageUrls?.[0]
    ? new URL(detail.plan.imageUrls[0], siteConfig.siteUrl).toString()
    : new URL("/image/logo.png", siteConfig.siteUrl).toString();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content={siteConfig.locale} />
        <meta property="og:type" content="article" />
      </Head>
      <CareDetailPage detail={detail} initialReviews={reviews} />
    </>
  );
}
