import Head from "next/head";

import { ProfilePageView } from "@/widgets/profile/ui/ProfilePageView";

export default function MyLikesPage() {
  return (
    <>
      <Head>
        <title>좋아요 한 시설 | 요양이</title>
      </Head>
      <ProfilePageView activeTab="liked" />
    </>
  );
}
