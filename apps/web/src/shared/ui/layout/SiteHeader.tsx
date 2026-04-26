"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import type { UserPayload } from "@/entities/auth/model/types";
import {
  logoutCurrentUser,
  requestCurrentUser
} from "@/entities/auth/api/kakao-auth";
import { globalNavigation } from "@/shared/config/site";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const standardNavigation = globalNavigation.filter((item) => !item.emphasized);
  const emphasizedNavigation = globalNavigation.filter((item) => item.emphasized);
  const visibleStandardNavigation = user
    ? standardNavigation.filter((item) => item.href !== "/login" && item.href !== "/signup")
    : standardNavigation;
  const userName = user?.profile.name || "마이페이지";
  const shouldShowDivider =
    emphasizedNavigation.length > 0 &&
    (visibleStandardNavigation.length > 0 || Boolean(user));

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const currentUser = await requestCurrentUser();

      if (!isMounted) {
        return;
      }

      setUser(currentUser);
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [router.asPath]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleLogout = async () => {
    await logoutCurrentUser();
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/image/logo.png"
            alt="요양이 로고"
            width={396}
            height={220}
            priority
            className={styles.brandLogo}
          />
        </Link>

        <form action="/search" method="get" className={styles.searchForm}>
          <div className={styles.searchField}>
            <input
              type="search"
              name="keyword"
              placeholder="어떤 요양시설을 찾으시나요?"
              aria-label="시설 검색"
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="검색"
            >
              <SystemIcon name="search" />
            </button>
          </div>
        </form>

        <nav className={styles.navigation}>
          {visibleStandardNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                type="button"
                className={styles.userButton}
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen((current) => !current)}
              >
                <span className={styles.userAvatar} aria-hidden="true">
                  <UserIcon />
                </span>
                <span className={styles.userName}>{userName}</span>
              </button>
              {isUserMenuOpen ? (
                <div className={styles.userDropdown}>
                  <Link href="/my" onClick={() => setIsUserMenuOpen(false)}>
                    마이페이지
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          {shouldShowDivider ? (
            <span className={styles.navDivider} />
          ) : null}
          {emphasizedNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLinkPrimary}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M5.5 20c1.1-3.8 3.5-5.7 6.5-5.7s5.4 1.9 6.5 5.7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}
