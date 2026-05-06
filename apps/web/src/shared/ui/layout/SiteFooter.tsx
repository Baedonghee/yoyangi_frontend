import Image from "next/image";
import Link from "next/link";

import { footerLinkGroups, siteConfig } from "@/shared/config/site";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function SiteFooter() {
  const customerPhone = formatKoreanPhoneNumber(siteConfig.customerPhone);

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
            </div>
            <p>안심하고 맡길 수 있는 가족을 위한 첫 걸음을 함께 만듭니다.</p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title} className={styles.footerGroup}>
              <strong>{group.title}</strong>
              {group.links.map((link) => {
                const opensNewWindow = "newWindow" in link && link.newWindow;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={opensNewWindow ? "_blank" : undefined}
                    rel={opensNewWindow ? "noreferrer" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className={styles.footerGroup}>
            <strong>대표전화</strong>
            <span className={styles.footerPhone}>{customerPhone}</span>
            <span>
              {siteConfig.customerHours}
              <br />
              주말 및 공휴일 휴무
            </span>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            요양이 대표이사 : 정웅택 / 소재지: 경기도 양주시 옥정로6길 18, 404호
            2호실
            <br />
            사업자등록: 678-86-03255 / 고객센터: {customerPhone}
            <br />
            Copyright © YOYANGEE CO., LTD. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
