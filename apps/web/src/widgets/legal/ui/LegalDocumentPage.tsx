import Head from "next/head";
import Link from "next/link";

import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/widgets/legal/ui/LegalDocumentPage.module.css";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  subsections?: Array<{
    title: string;
    paragraphs?: string[];
    list?: string[];
  }>;
  notice?: string;
};

type LegalDocumentPageProps = {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export function LegalDocumentPage({
  title,
  description,
  effectiveDate,
  sections,
}: LegalDocumentPageProps) {
  const pageTitle = `${title} | 요양이`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Head>
      <main className={styles.page}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <SystemIcon name="arrow-left" />
            홈으로 돌아가기
          </Link>

          <header className={styles.hero}>
            <h1>{title}</h1>
            <p className={styles.effectiveDate}>시행일자: {effectiveDate}</p>
          </header>

          <article className={styles.content}>
            {sections.map((section) => (
              <section key={section.title} className={styles.section}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.title}>
                    <h3>{subsection.title}</h3>
                    {subsection.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {subsection.list ? (
                      <ul>
                        {subsection.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
                {section.notice ? (
                  <div className={styles.noticeBox}>
                    <p>{section.notice}</p>
                  </div>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </main>
    </>
  );
}
