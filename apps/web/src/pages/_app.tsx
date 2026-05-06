import type { AppProps } from "next/app";
import type { NextPage } from "next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "@/app/globals.css";
import { FloatingQuickActions } from "@/shared/ui/layout/FloatingQuickActions";
import { SiteFooter } from "@/shared/ui/layout/SiteFooter";
import { SiteHeader } from "@/shared/ui/layout/SiteHeader";

type NextPageWithLayout<P = Record<string, never>> = NextPage<P> & {
  noChrome?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function DefaultChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <FloatingQuickActions />
    </>
  );
}

export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout): React.ReactNode {
  const page = <Component {...pageProps} />;

  if (Component.getLayout) {
    return Component.getLayout(page);
  }

  if (Component.noChrome) {
    return <>{page}</>;
  }

  return <DefaultChrome>{page}</DefaultChrome>;
}
