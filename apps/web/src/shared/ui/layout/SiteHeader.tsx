"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FormEvent, useEffect, useRef, useState } from "react";

import type { UserPayload } from "@/entities/auth/model/types";
import {
  logoutCurrentUser,
  requestCurrentUser,
} from "@/entities/auth/api/kakao-auth";
import { globalNavigation } from "@/shared/config/site";
import { SystemIcon } from "@/shared/ui/icons/SystemIcon";
import styles from "@/shared/ui/layout/SiteChrome.module.css";

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const standardNavigation = globalNavigation.filter(
    (item) => !item.emphasized,
  );
  const emphasizedNavigation = globalNavigation.filter(
    (item) => item.emphasized,
  );
  const visibleStandardNavigation = user
    ? standardNavigation.filter(
        (item) => item.href !== "/login" && item.href !== "/signup",
      )
    : standardNavigation;
  const userName = user?.profile.name || "마이페이지";
  const shouldShowDivider =
    emphasizedNavigation.length > 0 &&
    (visibleStandardNavigation.length > 0 || Boolean(user));
  const currentSearchQuery = getQueryValue(router.query.q);

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
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    setSearchQuery(currentSearchQuery ?? "");
  }, [currentSearchQuery]);

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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();

    void router.push({
      pathname: "/cares",
      query: query ? { q: query } : {},
    });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <MenuIcon />
          </button>

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

          <button
            type="button"
            className={styles.mobileSearchButton}
            aria-label="검색 열기"
            aria-expanded={isMobileSearchOpen}
            onClick={() => setIsMobileSearchOpen((current) => !current)}
          >
            <SystemIcon name="search" />
          </button>

          <form
            action="/cares"
            method="get"
            className={`${styles.searchForm} ${isMobileSearchOpen ? styles.searchFormOpen : ""}`}
            onSubmit={handleSearchSubmit}
          >
            <div className={styles.searchField}>
              <input
                type="search"
                name="q"
                value={searchQuery}
                placeholder="어떤 요양시설을 찾으시나요?"
                aria-label="시설 검색"
                onChange={(event) => setSearchQuery(event.target.value)}
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
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
            {emphasizedNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLinkPrimary}
              >
                {item.label}
              </Link>
            ))}
            {shouldShowDivider ? <span className={styles.navDivider} /> : null}
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
          </nav>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          className={styles.mobileMenuOverlay}
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className={styles.mobileMenuPanel}
            role="dialog"
            aria-modal="true"
            aria-label="모바일 메뉴"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.mobileMenuHead}>
              <Image
                src="/image/logo.png"
                alt="요양이 로고"
                width={396}
                height={220}
                className={styles.mobileMenuLogo}
              />
              <button
                type="button"
                className={styles.mobileMenuClose}
                aria-label="메뉴 닫기"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </button>
            </div>
            {user ? (
              <div className={styles.mobileUserSummary}>
                <span className={styles.userAvatar} aria-hidden="true">
                  <UserIcon />
                </span>
                <strong>{userName}</strong>
              </div>
            ) : null}
            <div className={styles.mobileMenuLinks}>
              {user ? (
                <>
                  <Link href="/my">마이페이지</Link>
                  <button type="button" onClick={handleLogout}>
                    로그아웃
                  </button>
                </>
              ) : (
                visibleStandardNavigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))
              )}
              {emphasizedNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="8"
        r="3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
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
