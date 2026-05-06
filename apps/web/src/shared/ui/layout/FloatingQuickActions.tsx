"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { quickActions, siteConfig } from "@/shared/config/site";
import { formatKoreanPhoneNumber } from "@/shared/lib/format-phone";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function FloatingQuickActions() {
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const youtubeAction = quickActions.find(
    (action) => action.icon === "youtube",
  );
  const blogAction = quickActions.find((action) => action.icon === "blog");
  const customerPhone = formatKoreanPhoneNumber(siteConfig.customerPhone);

  useEffect(() => {
    if (!isConsultModalOpen && !isMobileSheetOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsConsultModalOpen(false);
        setIsMobileSheetOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConsultModalOpen, isMobileSheetOpen]);

  return (
    <>
      <aside className={styles.floatingActions} aria-label="빠른 액션">
        {quickActions.map((action) => {
          const isExternal = action.href.startsWith("http");

          if (action.icon === "chat") {
            return (
              <button
                key={action.href}
                type="button"
                data-tone={action.icon}
                className={styles.floatingLink}
                onClick={() => setIsConsultModalOpen(true)}
              >
                <SystemIcon
                  name={action.icon}
                  className={styles.floatingIcon}
                />
                <span>{action.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={action.href}
              href={action.href}
              data-tone={action.icon}
              className={styles.floatingLink}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              <SystemIcon name={action.icon} className={styles.floatingIcon} />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </aside>

      <div className={styles.mobileQuickDock}>
        <button
          type="button"
          className={styles.mobileQuickButton}
          onClick={() => setIsMobileSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isMobileSheetOpen}
        >
          <SystemIcon name="chat" className={styles.mobileQuickIcon} />
          <span>상담하기</span>
        </button>
      </div>

      {isConsultModalOpen ? (
        <div
          className={styles.consultOverlay}
          role="presentation"
          onClick={() => setIsConsultModalOpen(false)}
        >
          <section
            className={styles.consultDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.consultIcon} aria-hidden="true">
              <SystemIcon name="chat" />
            </div>
            <h2 id="consult-title">고객센터</h2>
            <a href={`tel:${customerPhone}`} className={styles.consultPhone}>
              {customerPhone}
            </a>
            <p className={styles.consultHelp}>
              전화연결은 모바일에서 가능합니다
            </p>
            <button
              type="button"
              className={styles.consultConfirm}
              onClick={() => setIsConsultModalOpen(false)}
            >
              확인
            </button>
          </section>
        </div>
      ) : null}

      {isMobileSheetOpen ? (
        <div
          className={styles.quickSheetOverlay}
          role="presentation"
          onClick={() => setIsMobileSheetOpen(false)}
        >
          <section
            className={styles.quickSheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className={styles.quickSheetHandle} aria-hidden="true" />
            <div className={styles.quickSheetHeader}>
              <div>
                <strong id="quick-sheet-title">무엇을 도와드릴까요?</strong>
                <p>필요한 채널로 바로 연결해드릴게요.</p>
              </div>
              <button
                type="button"
                className={styles.quickSheetClose}
                onClick={() => setIsMobileSheetOpen(false)}
                aria-label="빠른 액션 닫기"
              >
                ×
              </button>
            </div>

            <div className={styles.quickSheetActions}>
              <a
                href={`tel:${customerPhone}`}
                className={styles.quickSheetAction}
              >
                <span className={styles.quickSheetIcon} data-tone="chat">
                  <SystemIcon name="chat" />
                </span>
                <span>
                  <strong>전화 상담</strong>
                  <em>{customerPhone}</em>
                </span>
              </a>

              {youtubeAction ? (
                <Link
                  href={youtubeAction.href}
                  className={styles.quickSheetAction}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.quickSheetIcon} data-tone="youtube">
                    <SystemIcon name="youtube" />
                  </span>
                  <span>
                    <strong>유튜브</strong>
                    <em>요양이 TV 바로가기</em>
                  </span>
                </Link>
              ) : null}

              {blogAction ? (
                <Link
                  href={blogAction.href}
                  className={styles.quickSheetAction}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.quickSheetIcon} data-tone="blog">
                    <SystemIcon name="blog" />
                  </span>
                  <span>
                    <strong>블로그</strong>
                    <em>요양 정보 보러가기</em>
                  </span>
                </Link>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
