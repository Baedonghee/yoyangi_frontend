import { getHomePageData } from "@/entities/home/api/get-home-page-data";
import type { HomePageData } from "@/entities/home/model/types";
import { StructuredData } from "@/shared/ui/seo/StructuredData";
import { siteConfig } from "@/shared/config/site";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import { HomePageView } from "@/widgets/home/ui/HomePageView";

function toStructuredDataUrl(href: string) {
  return /^https?:\/\//i.test(href)
    ? href
    : new URL(href, siteConfig.siteUrl).toString();
}

function buildStructuredData(data: HomePageData) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      email: siteConfig.contactEmail,
      telephone: formatKoreanPhoneNumber(siteConfig.customerPhone),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.siteUrl}/cares?q={search_term_string}`,
        "query-input": "required name=q",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "요양이 TV",
      itemListElement: data.tvItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toStructuredDataUrl(item.href),
        name: item.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "요양여지도",
      itemListElement: data.careYoutubeItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toStructuredDataUrl(item.href),
        name: item.title,
      })),
    },
  ];
}

export async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <StructuredData data={buildStructuredData(data)} />
      <HomePageView data={data} />
    </>
  );
}
