import { useLocation, useNavigationType } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';

const scrollStore = new Map();

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();
    const previousPathRef = useRef(pathname);

    useLayoutEffect(() => {
        // If Home has an explicit saved position, restore it first and skip any forced top reset.
        if (pathname === '/' && sessionStorage.getItem('homeShouldRestoreScroll') === '1') {
            const savedHomeY = Number(sessionStorage.getItem('homeScrollY') || '0');
            if (savedHomeY > 0) {
                window.scrollTo({ top: savedHomeY, left: 0, behavior: 'auto' });
                previousPathRef.current = pathname;
                return;
            }
        }

        if (navType === 'POP') {
            const savedY = scrollStore.get(pathname);
            if (typeof savedY === 'number') {
                window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
                previousPathRef.current = pathname;
                return;
            }
        }

        if (navType !== 'POP') {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }

        return () => {
            scrollStore.set(pathname, window.scrollY || window.pageYOffset || 0);
            previousPathRef.current = pathname;
        };
    }, [navType, pathname]);

    return null;
}

export default ScrollToTop;