import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { getCaresPageData } from "@/entities/cares/api/get-cares-page-data";
import type { CarePageData } from "@/entities/cares/model/types";
import { siteConfig } from "@/shared/config/site";
import { CasesPageView } from "@/widgets/cases/ui/CasesPageView";

type CaresPageProps = {
  data: CarePageData;
};

export const getServerSideProps: GetServerSideProps<CaresPageProps> = async (context) => {
  const data = await getCaresPageData(context.query, context.req.cookies.token);

  return {
    props: {
      data
    }
  };
};

export default function CaresPage({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = "요양이 | 요양시설 검색 결과";
  const description =
    "요양이에서 지역, 시설 유형, 평가등급을 기준으로 요양시설 리스트를 비교해보세요.";
  const canonicalUrl = new URL("/cares", siteConfig.siteUrl).toString();

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
      </Head>
      <CasesPageView data={data} />
    </>
  );
}
