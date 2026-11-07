import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isFirstMount.current) {
      setTimeout(() => {
        const h1 = document.querySelector<HTMLElement>('main h1');
        if (h1) {
          h1.tabIndex = -1;
          h1.focus({ preventScroll: true });
        } else {
          const main = document.querySelector<HTMLElement>('main');
          if (main) {
            main.tabIndex = -1;
            main.focus({ preventScroll: true });
          }
        }
      }, 60);
    }
    isFirstMount.current = false;
  }, [pathname]);

  return null;
};
