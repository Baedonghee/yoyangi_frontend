import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { FacilityPlaceholderPage } from "@/shared/placeholder/FacilityPlaceholderPage";

type FacilityPageProps = {
  id: string;
};

export const getServerSideProps: GetServerSideProps<FacilityPageProps> = async (
  context
) => {
  const id = context.params?.id;

  return {
    props: {
      id: typeof id === "string" ? id : "0"
    }
  };
};

export default function FacilityPage({
  id
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <FacilityPlaceholderPage id={id} />;
}

