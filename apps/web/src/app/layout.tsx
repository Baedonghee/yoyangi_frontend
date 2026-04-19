import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "요양이",
  description: "추천 시설, 요양이 TV, 지역별 정보를 한 번에 보는 요양이 메인"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
