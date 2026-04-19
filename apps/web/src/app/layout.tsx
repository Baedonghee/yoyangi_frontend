import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site";
import { FloatingQuickActions } from "@/shared/ui/layout/FloatingQuickActions";
import { SiteFooter } from "@/shared/ui/layout/SiteFooter";
import { SiteHeader } from "@/shared/ui/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingQuickActions />
      </body>
    </html>
  );
}
