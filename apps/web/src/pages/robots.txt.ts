import type {
  GetServerSideProps,
  GetServerSidePropsContext
} from "next";

import { siteConfig } from "@/shared/config/site";

export const getServerSideProps: GetServerSideProps = async ({
  res
}: GetServerSidePropsContext) => {
  res.setHeader("Content-Type", "text/plain");
  res.write(
    [
      "User-agent: *",
      "Allow: /",
      `Host: ${siteConfig.siteUrl}`,
      `Sitemap: ${siteConfig.siteUrl}/sitemap.xml`
    ].join("\n")
  );
  res.end();

  return {
    props: {}
  };
};

export default function Robots() {
  return null;
}

