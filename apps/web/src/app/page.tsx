import type { Metadata } from "next";

import { getHomePageData } from "@/entities/home/api/get-home-page-data";
import { siteConfig } from "@/shared/config/site";
import { HomePage } from "@/widgets/home/ui/HomePage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData();
  const canonicalUrl = new URL(data.seo.canonicalPath, siteConfig.siteUrl).toString();

  return {
    title: data.seo.title,
    description: data.seo.description,
    keywords: data.seo.keywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: data.seo.ogImage
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo.title,
      description: data.seo.description,
      images: [data.seo.ogImage]
    }
  };
}

export default async function Page() {
  return <HomePage />;
}
