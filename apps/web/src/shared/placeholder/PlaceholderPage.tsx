import Head from "next/head";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import styles from "@/shared/placeholder/PlaceholderPage.module.css";
import type { PlaceholderConfig } from "@/shared/placeholder/types";

type PlaceholderPageProps = {
  config: PlaceholderConfig;
};

export function PlaceholderPage({ config }: PlaceholderPageProps) {
  return (
    <>
      <Head>
        <title>{`${config.title} | ${siteConfig.name}`}</title>
        <meta name="description" content={config.description} />
      </Head>

      <main className={styles.shell}>
        <section className={styles.stage}>
          <div className={styles.heroCard}>
            <div className={styles.copy}>
              <div className={styles.topline}>
                <span className={styles.eyebrow}>COMING SOON</span>
                <span className={styles.sectionLabel}>{config.eyebrow}</span>
              </div>
              <h1>{config.title}</h1>
              <p>{config.description}</p>
              <div className={styles.tagList}>
                {config.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.primaryButton}>
                  {config.ctaLabel}
                </button>
                <Link href="/" className={styles.secondaryButton}>
                  메인으로 돌아가기
                </Link>
              </div>
            </div>

            <div className={styles.previewPanel}>
              <div className={styles.previewHead}>
                <strong>{config.heroNote}</strong>
                <span>Sample Layout</span>
              </div>
              <div className={styles.previewGrid}>
                {config.blocks.map((block) => (
                  <article key={block.title} className={styles.previewCard}>
                    <span className={styles.previewLabel}>{block.label}</span>
                    <h2>{block.title}</h2>
                    <p>{block.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.bottomStrip}>
            {config.blocks.map((block) => (
              <div key={`${block.label}-mini`} className={styles.bottomCard}>
                <span>{block.label}</span>
                <strong>{block.title}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

