import Link from "next/link";

import { globalNavigation } from "@/shared/config/site";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>
            <SystemIcon name="heart" />
          </span>
          <span className={styles.brandText}>
            <strong>요양이</strong>
            <span>Care Discovery Platform</span>
          </span>
        </Link>

        <form action="/search" method="get" className={styles.searchForm}>
          <div className={styles.searchField}>
            <input
              type="search"
              name="keyword"
              placeholder="어떤 요양시설을 찾으시나요?"
              aria-label="시설 검색"
            />
            <button type="submit" className={styles.searchButton} aria-label="검색">
              <SystemIcon name="search" />
            </button>
          </div>
        </form>

        <nav className={styles.navigation}>
          {globalNavigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.emphasized ? styles.navLinkPrimary : styles.navLink
              }
            >
              {item.label}
            </Link>
          ))}
          <span className={styles.navDivider} />
        </nav>
      </div>
    </header>
  );
}

