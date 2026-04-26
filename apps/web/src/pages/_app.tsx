import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

import "@/app/globals.css";
import { FloatingQuickActions } from "@/shared/ui/layout/FloatingQuickActions";
import { SiteFooter } from "@/shared/ui/layout/SiteFooter";
import { SiteHeader } from "@/shared/ui/layout/SiteHeader";

type NextPageWithLayout<P = Record<string, never>> = NextPage<P> & {
  noChrome?: boolean;
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function DefaultChrome({ children }: { children: ReactNode }) {
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
  pageProps
}: AppPropsWithLayout): ReactElement {
  const page = <Component {...pageProps} />;

  if (Component.getLayout) {
    return Component.getLayout(page);
  }

  if (Component.noChrome) {
    return <>{page}</>;
  }

  return <DefaultChrome>{page}</DefaultChrome>;
}
