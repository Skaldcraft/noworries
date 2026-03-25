import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#f9f9f9]/92 backdrop-blur-md overflow-hidden px-3 py-3 lg:px-4 lg:py-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ transform: `translateY(${Math.min(scrollY * 0.12, 18)}px)` }}
      >
        <div className="absolute -top-12 -right-20 h-40 w-40 rounded-full bg-[#f39c12]/10 blur-2xl" />
        <div className="absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-[#1a7431]/10 blur-2xl" />
      </div>

      <div className="relative max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-white px-4 sm:px-6 py-3.5 sm:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:rounded-[2rem]">
          <div className="min-w-0">
            <h1
              className="text-[20px] sm:text-[24px] font-extrabold tracking-[-0.03em] text-[#1a7431] leading-none"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {t('site.name')}
            </h1>
            <p
              className="hidden sm:block text-[12px] text-[#666] mt-1.5 truncate max-w-[720px] font-medium"
              style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
            >
              {t('site.tagline')}
            </p>
          </div>
          <span
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666] bg-[#f0f0f0] rounded-full px-3 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
            style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
          >
            Guia practica
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
