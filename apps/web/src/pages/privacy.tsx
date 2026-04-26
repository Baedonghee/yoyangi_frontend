import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/term/personal",
    permanent: true
  }
});

export default function PrivacyPage() {
  return null;
}
