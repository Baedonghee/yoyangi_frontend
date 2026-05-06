import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Script from "next/script";

import { getRecommendedFacilities } from "@/entities/home/api/get-home-page-data";
import type { RecommendedFacility } from "@/entities/home/model/types";
import { siteConfig } from "@/shared/config/site";
import { RecommendedPageView } from "@/widgets/recommended/ui/RecommendedPageView";

type RecommendedPageProps = {
  facilities: RecommendedFacility[];
};

function buildStructuredData(facilities: RecommendedFacility[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "요양이 추천 시설",
    itemListElement: facilities.map((facility, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: new URL(facility.href, siteConfig.siteUrl).toString(),
      name: facility.name,
    })),
  };
}

export const getServerSideProps: GetServerSideProps<
  RecommendedPageProps
> = async () => {
  const facilities = await getRecommendedFacilities();

  return {
    props: {
      facilities,
    },
  };
};

export default function RecommendedPage({
  facilities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = "요양이 추천 시설 | 요양이";
  const description =
    "요양이가 추천하는 요양시설을 사진, 위치, 상담 가능 여부와 함께 비교해보세요.";
  const canonicalUrl = new URL("/recommended", siteConfig.siteUrl).toString();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content={siteConfig.locale} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            facilities[0]?.imageUrl || `${siteConfig.siteUrl}/image/logo.png`
          }
        />
      </Head>
      <Script
        id="recommended-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(facilities)),
        }}
      />
      <RecommendedPageView facilities={facilities} />
    </>
  );
}
