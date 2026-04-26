import type {
  GetServerSideProps,
  GetServerSidePropsContext
} from "next";

import { siteConfig } from "@/shared/config/site";

const routes = [
  "",
  "/search",
  "/guide",
  "/tv",
  "/regions",
  "/partner",
  "/login",
  "/signup"
];

export const getServerSideProps: GetServerSideProps = async ({
  res
}: GetServerSidePropsContext) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `<url>
  <loc>${siteConfig.siteUrl}${path}</loc>
</url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

export default function Sitemap() {
  return null;
}

