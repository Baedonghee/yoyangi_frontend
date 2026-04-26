import Image from "next/image";
import Link from "next/link";

import {
  footerLinkGroups,
  siteConfig
} from "@/shared/config/site";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.brand}>
              <Image
                src="/image/logo.png"
                alt="요양이 로고"
                width={396}
                height={220}
                className={styles.brandLogo}
              />
              <span className={styles.brandCaption}>Care Discovery Platform</span>
            </div>
            <p>안심하고 맡길 수 있는 가족을 위한 첫 걸음을 함께 만듭니다.</p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title} className={styles.footerGroup}>
              <strong>{group.title}</strong>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div className={styles.footerGroup}>
            <strong>대표전화</strong>
            <span className={styles.footerPhone}>{siteConfig.customerPhone}</span>
            <span>
              {siteConfig.customerHours}
              <br />
              주말 및 공휴일 휴무
            </span>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            (주)요양이 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890
            <br />
            통신판매업신고: 제2026-서울강남-0000호 | 주소: 서울특별시 강남구 테헤란로 123
            <br />© {siteConfig.name} Corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
