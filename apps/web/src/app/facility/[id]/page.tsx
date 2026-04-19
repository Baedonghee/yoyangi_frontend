import Link from "next/link";
import type { Metadata } from "next";

import styles from "@/app/[slug]/placeholder.module.css";

type FacilityPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params
}: FacilityPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `시설 상세 ${id}`,
    description: "시설 상세 페이지가 들어갈 자리입니다."
  };
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { id } = await params;

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>COMING SOON</span>
        <h1>시설 상세 {id}</h1>
        <p>추천시설 상세 페이지는 이후 서버 응답 스펙에 맞춰 연결될 예정입니다.</p>
        <Link href="/" className={styles.link}>
          메인으로 돌아가기
        </Link>
      </section>
    </main>
  );
}

