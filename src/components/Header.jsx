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
    <header className="sticky top-0 z-50 border-b border-[#E7E5E4] bg-[#F7F6F3]/90 backdrop-blur-md overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ transform: `translateY(${Math.min(scrollY * 0.12, 18)}px)` }}
      >
        <div className="absolute -top-12 -right-20 h-40 w-40 rounded-full bg-amber-200/35 blur-2xl" />
        <div className="absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-emerald-200/30 blur-2xl" />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 py-3 sm:py-3.5">
        <div className="flex items-center justify-between rounded-2xl border border-[#E7E5E4] bg-white/78 px-4 sm:px-5 py-2.5 shadow-[0_8px_24px_rgba(28,25,23,0.06)]">
          <div className="min-w-0">
            <h1 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight text-[#1C1917] leading-none">
              {t('site.name')}
            </h1>
            <p className="hidden sm:block text-[12px] text-[#57534E] mt-1 truncate max-w-[720px]">
              {t('site.tagline')}
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] text-[#57534E] bg-[#F5F5F4] border border-[#E7E5E4] rounded-full px-2.5 py-1">
            Guia practica
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
