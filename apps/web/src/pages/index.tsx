import Head from "next/head";
import Script from "next/script";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { getHomePageData } from "@/entities/home/api/get-home-page-data";
import type { HomePageData } from "@/entities/home/model/types";
import { siteConfig } from "@/shared/config/site";
import { HomePageView } from "@/widgets/home/ui/HomePageView";

type HomePageProps = {
  data: HomePageData;
};

function buildStructuredData(data: HomePageData) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      email: siteConfig.contactEmail,
      telephone: siteConfig.customerPhone
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.siteUrl}/search?keyword={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "요양이 TV",
      itemListElement: data.tvItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.siteUrl}${item.href}`,
        name: item.title
      }))
    }
  ];
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const data = await getHomePageData();

  return {
    props: {
      data
    }
  };
};

export default function HomePage({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const canonicalUrl = new URL(data.seo.canonicalPath, siteConfig.siteUrl).toString();

  return (
    <>
      <Head>
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
        <meta name="keywords" content={data.seo.keywords.join(", ")} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={data.seo.title} />
        <meta property="og:description" content={data.seo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content={siteConfig.locale} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={data.seo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.seo.title} />
        <meta name="twitter:description" content={data.seo.description} />
        <meta name="twitter:image" content={data.seo.ogImage} />
      </Head>
      <Script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(data))
        }}
      />
      <HomePageView data={data} />
    </>
  );
}
