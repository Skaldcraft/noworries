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
    <header className="sticky top-0 z-50 bg-white px-2 py-2 lg:px-3 lg:py-2.5">
      <div className="relative max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-white px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_6px_18px_rgba(0,0,0,0.03)] lg:rounded-[1.5rem]">
          <div className="min-w-0">
            <h1
              className="text-[19px] sm:text-[22px] font-extrabold tracking-[-0.03em] text-[#1a7431] leading-none"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {t('site.name')}
            </h1>
            <p
              className="hidden sm:block text-[12px] text-[#666] mt-1 truncate max-w-[600px] font-medium"
              style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
            >
              {t('site.tagline')}
            </p>
          </div>
          <span
            className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666] bg-[#f0f0f0] rounded-full px-2.5 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
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
