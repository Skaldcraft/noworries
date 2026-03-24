import { useLocation, useNavigationType } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';

const scrollStore = new Map();

const ScrollToTop = () => {
    const { pathname, search } = useLocation();
    const navType = useNavigationType();
    const routeKey = `${pathname}${search}`;
    const previousPathRef = useRef(pathname);

    useLayoutEffect(() => {
        const previousPath = previousPathRef.current;

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
            const savedY = scrollStore.get(routeKey);
            if (typeof savedY === 'number') {
                window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
                previousPathRef.current = pathname;
                return;
            }
        }

        // Restore home scroll when returning from any non-home route via normal navigation.
        if (pathname === '/' && previousPath !== '/') {
            const savedY = scrollStore.get('/');
            if (typeof savedY === 'number') {
                window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
                previousPathRef.current = pathname;
                return;
            }
        }

        if (navType !== 'POP') {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }

        return () => {
            scrollStore.set(routeKey, window.scrollY || window.pageYOffset || 0);
            previousPathRef.current = pathname;
        };
    }, [routeKey, navType, pathname]);

    return null;
}

export default ScrollToTop;