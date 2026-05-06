import Head from "next/head";

import { ProfilePageView } from "@/widgets/profile/ui/ProfilePageView";

export default function MyRecentsPage() {
  return (
    <>
      <Head>
        <title>최근 본 시설 | 요양이</title>
      </Head>
      <ProfilePageView activeTab="recent" />
    </>
  );
}
