import Link from "next/link";

import { quickActions } from "@/shared/config/site";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function FloatingQuickActions() {
  return (
    <aside className={styles.floatingActions} aria-label="빠른 액션">
      {quickActions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          data-tone={action.icon}
          className={styles.floatingLink}
        >
          <SystemIcon name={action.icon} className={styles.floatingIcon} />
          <span>{action.label}</span>
        </Link>
      ))}
    </aside>
  );
}

