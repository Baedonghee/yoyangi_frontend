import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/term/service",
    permanent: true
  }
});

export default function TermsPage() {
  return null;
}
