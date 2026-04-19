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
      <section className={styles.stage}>
        <div className={styles.heroCard}>
          <div className={styles.copy}>
            <div className={styles.topline}>
              <span className={styles.eyebrow}>DETAIL PREVIEW</span>
              <span className={styles.sectionLabel}>FACILITY {id}</span>
            </div>
            <h1>시설 상세 {id}</h1>
            <p>
              추천시설 상세 페이지는 갤러리, 시설 소개, 제공 서비스, 상담 CTA를
              한 화면에 담는 구조로 들어갈 예정입니다.
            </p>
            <div className={styles.tagList}>
              <span className={styles.tag}>갤러리</span>
              <span className={styles.tag}>시설 소개</span>
              <span className={styles.tag}>상담 CTA</span>
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton}>
                샘플 상세 보기
              </button>
              <Link href="/" className={styles.secondaryButton}>
                메인으로 돌아가기
              </Link>
            </div>
          </div>

          <div className={styles.previewPanel}>
            <div className={styles.previewHead}>
              <strong>상단 갤러리와 핵심 정보, 하단 서비스 블록을 넣는 상세형 샘플입니다.</strong>
              <span>Detail Modules</span>
            </div>
            <div className={styles.previewGrid}>
              <article className={styles.previewCard}>
                <span className={styles.previewLabel}>GALLERY</span>
                <h2>대표 사진과 내부 공간 이미지</h2>
                <p>첫 화면에서 시설 분위기를 알 수 있도록 상단 대형 이미지와 썸네일 묶음을 둡니다.</p>
              </article>
              <article className={styles.previewCard}>
                <span className={styles.previewLabel}>INFO</span>
                <h2>위치, 평점, 서비스 태그</h2>
                <p>주소, 전화번호, 시설 유형, 주요 서비스 태그를 핵심 정보 영역에 정리합니다.</p>
              </article>
              <article className={styles.previewCard}>
                <span className={styles.previewLabel}>CTA</span>
                <h2>상담 신청과 비교 저장</h2>
                <p>바로 상담하기, 찜하기, 비교하기 같은 전환 버튼을 우측에 배치합니다.</p>
              </article>
            </div>
          </div>
        </div>

        <div className={styles.bottomStrip}>
          <div className={styles.bottomCard}>
            <span>SECTION</span>
            <strong>시설 소개</strong>
          </div>
          <div className={styles.bottomCard}>
            <span>SECTION</span>
            <strong>서비스 안내</strong>
          </div>
          <div className={styles.bottomCard}>
            <span>SECTION</span>
            <strong>상담 연결</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
