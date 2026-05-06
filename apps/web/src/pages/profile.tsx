import Head from "next/head";

import { ProfilePageView } from "@/widgets/profile/ui/ProfilePageView";

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>마이페이지 | 요양이</title>
      </Head>
      <ProfilePageView activeTab="liked" />
    </>
  );
}
