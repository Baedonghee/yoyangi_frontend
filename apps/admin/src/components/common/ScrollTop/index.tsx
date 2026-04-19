import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 페이지 이동시 스크롤 top
const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  return null;
};

export default ScrollTop;
