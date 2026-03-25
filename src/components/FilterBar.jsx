import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMarketGifts } from '@/data/market-gifts';
import { getOrderedProfileOptionsFromGifts } from '@/lib/profiles';

function FilterBar({ onFilterChange, activeFilters }) {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef(null);
  const giftsData = useMemo(() => getMarketGifts(), []);

  const orderedProfiles = useMemo(() => {
    return getOrderedProfileOptionsFromGifts(giftsData);
  }, [giftsData]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', label: t('filters.categories.all') },
    { id: 'person', label: t('filters.categories.person') },
    { id: 'personality', label: t('filters.categories.personality') },
    { id: 'occasion', label: t('filters.categories.occasion') }
  ];

  const budgetRanges = [
    { label: t('filters.budget_ranges.all'), value: 'all' },
    { label: t('filters.budget_ranges.under15_label'), sublabel: t('filters.budget_ranges.under15_sub'), value: 'under15' },
    { label: t('filters.budget_ranges.r15_35_label'), sublabel: t('filters.budget_ranges.r15_35_sub'), value: '15-35' },
    { label: t('filters.budget_ranges.r35_70_label'), sublabel: t('filters.budget_ranges.r35_70_sub'), value: '35-70' },
    { label: t('filters.budget_ranges.r70_150_label'), sublabel: t('filters.budget_ranges.r70_150_sub'), value: '70-150' }
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const parallaxOffset = Math.min(scrollY * 0.4, 80);

  return (
    <div className="relative z-30">
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-[500px] sm:min-h-[560px]"
        style={{
          backgroundImage: `url('/images/cabecera.jpg')`,
          backgroundPosition: `center ${parallaxOffset}px`
        }}
      >
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />

        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-6 sm:pt-16 sm:pb-8 flex flex-col h-full">
          <div className="text-center mb-8 sm:mb-10">
            <h1
              className="text-[28px] sm:text-[36px] font-normal text-[#1C1917] leading-tight tracking-wide"
              style={{ fontFamily: "'Questrial', sans-serif" }}
            >
              Ideas de regalo para perfiles y presupuestos a medida
            </h1>
            <p
              className="mt-3 text-[20px] sm:text-[22px] font-normal text-[#B91C1C] leading-relaxed"
              style={{ fontFamily: "'Questrial', sans-serif" }}
            >
              ¡Utiliza los filtros y encuentra buenas opciones rápido y sin estrés!
            </p>
          </div>

          <div className="flex flex-col items-center mt-auto">
            <h3 className="text-[15px] sm:text-[15px] font-bold text-[#1C1917] uppercase tracking-[0.15em] mb-3"
              style={{ fontFamily: "'Questrial', sans-serif" }}>
              PRESUPUESTO
            </h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-[720px]">
              {budgetRanges.map((budget) => (
                <button
                  key={budget.value}
                  onClick={() => onFilterChange('budget', budget.value)}
                  aria-pressed={activeFilters.budget === budget.value}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 border flex flex-col items-center justify-center min-w-[100px] sm:min-w-[110px] shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:translate-y-[-1px] ${activeFilters.budget === budget.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-white/95 border-[#D6D3D1] text-foreground hover:border-primary/45 hover:bg-white'
                    }`}
                  style={{ fontFamily: "'Questrial', sans-serif" }}
                >
                  <div className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wide leading-tight transition-colors ${activeFilters.budget === budget.value ? 'text-primary-foreground' : 'text-[#57534E]'}`}>
                    {budget.label}
                  </div>
                  {budget.sublabel && (
                    <div className={`text-[13px] sm:text-[14px] font-medium mt-0.5 transition-colors ${activeFilters.budget === budget.value ? 'text-primary-foreground' : 'text-[#1C1917]'}`}>
                      {budget.sublabel}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="flex justify-center">
              <h3 className="text-[15px] sm:text-[15px] font-bold text-[#1C1917] uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "'Questrial', sans-serif" }}>
                PARA QUIÉN BUSCAS
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange('tier', cat.id)}
                  aria-pressed={activeFilters.tier === cat.id}
                  className={`px-4 sm:px-5 py-2 min-h-[38px] rounded-full text-[13px] font-semibold border transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeFilters.tier === cat.id
                    ? 'bg-foreground text-background border-foreground shadow-lg'
                    : 'bg-white/95 border-[#D6D3D1] text-foreground/85 hover:border-muted'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="pt-3">
              <h3 className="text-[10px] sm:text-[11px] font-black text-[#78716C] uppercase tracking-[0.2em] mb-2.5 text-center">
                O elige un perfil específico
              </h3>
              <div className="relative">
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md rounded-full p-1.5 opacity-70 transition-opacity duration-200 -ml-1"
                  aria-label="Desplazar izquierda"
                >
                  <ChevronLeft size={18} className="text-[#78716C]" />
                </button>
                <div
                  ref={scrollContainerRef}
                  className="flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-1 custom-scrollbar -mx-4 px-6 sm:mx-0 sm:px-0"
                >
                  {orderedProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => onFilterChange('profile', profile.id)}
                      aria-pressed={activeFilters.profile === profile.id}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 shadow-sm ${activeFilters.profile === profile.id
                        ? 'bg-primary/15 text-primary border-primary/30 shadow-md'
                        : 'bg-white/80 text-foreground/85 border-transparent hover:bg-muted/20 hover:border-border'
                        }`}
                    >
                      {profile.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md rounded-full p-1.5 opacity-70 transition-opacity duration-200 -mr-1"
                  aria-label="Desplazar derecha"
                >
                  <ChevronRight size={18} className="text-[#78716C]" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 text-center">
            <p className="text-[13px] text-[#57534E]">
              Enlaces a Amazon · Si compras desde aquí recibimos una pequeña comisión, a ti te cuesta lo mismo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
