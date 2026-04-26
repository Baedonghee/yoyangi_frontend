"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { quickActions } from "@/shared/config/site";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function FloatingQuickActions() {
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  useEffect(() => {
    if (!isConsultModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsConsultModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConsultModalOpen]);

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
                <SystemIcon name={action.icon} className={styles.floatingIcon} />
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
            <a href="tel:1577-5776" className={styles.consultPhone}>
              1577-5776
            </a>
            <p className={styles.consultHelp}>전화연결은 모바일에서 가능합니다</p>
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
    </>
  );
}
