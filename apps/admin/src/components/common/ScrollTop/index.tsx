import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

const getScrollContainers = () => {
  const containers = [
    document.querySelector<HTMLElement>('[data-scroll-container="admin-content"]'),
    document.querySelector<HTMLElement>('[data-scroll-container="admin-main"]'),
    document.querySelector<HTMLElement>('[data-scroll-container="admin-layout"]'),
    document.scrollingElement,
    document.documentElement,
    document.body,
  ].filter((container): container is Element => !!container);

  return Array.from(new Set(containers));
};

const getScrollTop = () => Math.max(window.scrollY, ...getScrollContainers().map((container) => container.scrollTop));

const scrollToPosition = (top: number) => {
  window.scrollTo({ top, left: 0 });
  getScrollContainers().forEach((container) => {
    container.scrollTo({ top, left: 0 });
  });
};

const isAtScrollPosition = (top: number) => Math.abs(getScrollTop() - top) <= 2;

const addInteractionCancelListeners = (cancelRestore: () => void) => {
  window.addEventListener('wheel', cancelRestore, { passive: true });
  window.addEventListener('touchstart', cancelRestore, { passive: true });
  window.addEventListener('pointerdown', cancelRestore, { passive: true });
  window.addEventListener('mousedown', cancelRestore);
  window.addEventListener('keydown', cancelRestore);

  return () => {
    window.removeEventListener('wheel', cancelRestore);
    window.removeEventListener('touchstart', cancelRestore);
    window.removeEventListener('pointerdown', cancelRestore);
    window.removeEventListener('mousedown', cancelRestore);
    window.removeEventListener('keydown', cancelRestore);
  };
};

const restoreScrollPosition = (top: number, delays: number[]) => {
  const timers: number[] = [];
  let animationFrame = 0;
  let isCancelled = false;
  let removeInteractionCancelListeners = () => {};

  const clearScheduledRestore = () => {
    window.cancelAnimationFrame(animationFrame);
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.length = 0;
  };

  const cancelRestore = () => {
    if (isCancelled) return;

    isCancelled = true;
    clearScheduledRestore();
    removeInteractionCancelListeners();
  };

  const applyRestore = () => {
    if (isCancelled) return;

    if (!isAtScrollPosition(top)) {
      scrollToPosition(top);
    }

    if (isAtScrollPosition(top)) {
      clearScheduledRestore();
      removeInteractionCancelListeners();
    }
  };

  removeInteractionCancelListeners = addInteractionCancelListeners(cancelRestore);
  animationFrame = window.requestAnimationFrame(applyRestore);

  delays.forEach((delay) => {
    timers.push(window.setTimeout(applyRestore, delay));
  });

  return cancelRestore;
};

// 일반 페이지 이동은 상단으로 보내고, 브라우저 뒤/앞 이동은 이전 스크롤을 복원합니다.
const ScrollTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const locationKey = location.key;
    const saveScrollPosition = () => {
      scrollPositions.set(locationKey, getScrollTop());
    };

    getScrollContainers().forEach((container) => {
      container.addEventListener('scroll', saveScrollPosition, { passive: true });
    });
    window.addEventListener('scroll', saveScrollPosition, { passive: true });

    return () => {
      saveScrollPosition();
      getScrollContainers().forEach((container) => {
        container.removeEventListener('scroll', saveScrollPosition);
      });
      window.removeEventListener('scroll', saveScrollPosition);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    const savedPosition = scrollPositions.get(location.key);
    const targetTop = navigationType === 'POP' && savedPosition !== undefined ? savedPosition : 0;
    const restoreDelays = navigationType === 'POP' ? [50, 150] : [50, 150, 300, 600, 1000];
    scrollPositions.set(location.key, targetTop);

    return restoreScrollPosition(targetTop, restoreDelays);
  }, [location.key, navigationType]);

  return null;
};

export default ScrollTop;
