import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMarketGifts } from '@/data/market-gifts';
import { getOrderedProfileOptionsFromGifts } from '@/lib/profiles';

function FilterBar({ onFilterChange, activeFilters }) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef(null);
  const giftsData = useMemo(() => getMarketGifts(), []);

  const orderedProfiles = useMemo(() => {
    return getOrderedProfileOptionsFromGifts(giftsData);
  }, [giftsData]);

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

  return (
    <div className="relative z-30 bg-[#f9f9f9] px-4 sm:px-6 pb-6 sm:pb-8">
      <div className="max-w-[1100px] mx-auto rounded-[0_0_30px_30px] bg-white px-4 sm:px-8 pt-4 sm:pt-5 pb-8 sm:pb-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto whitespace-nowrap text-[11px] leading-none text-[#888] pb-4 sm:pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="inline-block">{t('filters.legal')}</span>
        </div>

        <div className="mx-auto max-w-[760px] mb-8 sm:mb-10">
          <h1
            className="text-[2rem] sm:text-[2.35rem] lg:text-[2.6rem] font-extrabold text-[#1a7431] leading-[1.08] tracking-[-0.03em]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Ideas de regalo para perfiles y presupuestos a medida
          </h1>
          <p
            className="mt-3 mx-auto max-w-[42rem] text-[0.98rem] sm:text-[1.05rem] font-medium text-[#666] leading-relaxed"
            style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
          >
            Utiliza los filtros y encuentra buenas opciones rápido, sin ruido y sin estrés.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <div className="w-full">
            <h3
              className="text-[13px] sm:text-[14px] font-bold text-[#1a7431] uppercase tracking-[0.18em] mb-4"
              style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
            >
              Presupuesto
            </h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-[760px] mx-auto lg:flex-nowrap">
              {budgetRanges.map((budget) => (
                <button
                  key={budget.value}
                  onClick={() => onFilterChange('budget', budget.value)}
                  aria-pressed={activeFilters.budget === budget.value}
                  className={`px-3 sm:px-4 lg:px-3 xl:px-4 py-2 sm:py-2.5 lg:py-2 rounded-[10px] transition-all duration-300 border border-transparent flex flex-col items-center justify-center min-w-[92px] sm:min-w-[102px] lg:min-w-[94px] xl:min-w-[102px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f39c12]/35 focus-visible:ring-offset-2 hover:translate-y-[-1px] ${activeFilters.budget === budget.value
                    ? 'bg-[#f39c12] text-white shadow-[0_5px_15px_rgba(243,156,18,0.3)]'
                    : 'bg-[#f0f0f0] text-[#444] hover:bg-[#ebebeb]'
                    }`}
                  style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
                >
                  <div className={`text-[9px] sm:text-[10px] lg:text-[9px] xl:text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight transition-colors ${activeFilters.budget === budget.value ? 'text-white/85' : 'text-[#777]'}`}>
                    {budget.label}
                  </div>
                  {budget.sublabel && (
                    <div className={`text-[12px] sm:text-[13px] lg:text-[12px] xl:text-[13px] font-semibold mt-0.5 transition-colors ${activeFilters.budget === budget.value ? 'text-white' : 'text-[#444]'}`}>
                      {budget.sublabel}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-center">
              <h3
                className="text-[13px] sm:text-[14px] font-bold text-[#1a7431] uppercase tracking-[0.18em] mb-4"
                style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
              >
                Para quién buscas
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:gap-1.5 xl:gap-2.5 max-w-[840px] mx-auto lg:flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange('tier', cat.id)}
                  aria-pressed={activeFilters.tier === cat.id}
                  className={`px-4 sm:px-5 lg:px-3.5 xl:px-5 py-2.5 lg:py-2 min-h-[40px] lg:min-h-[36px] rounded-full text-[12px] sm:text-[13px] lg:text-[11px] xl:text-[13px] font-bold border border-transparent transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f39c12]/35 focus-visible:ring-offset-2 ${activeFilters.tier === cat.id
                    ? 'bg-[#f39c12] text-white shadow-[0_5px_15px_rgba(243,156,18,0.3)]'
                    : 'bg-[#f0f0f0] text-[#444] hover:bg-[#ebebeb]'
                    }`}
                  style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="pt-5 sm:pt-6">
              <h3 className="text-[10px] sm:text-[11px] font-bold text-[#888] uppercase tracking-[0.18em] mb-3 text-center"
                style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}>
                O elige un perfil específico
              </h3>
              <div className="relative">
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-full p-2 opacity-80 transition-opacity duration-200 -ml-1 hover:opacity-100"
                  aria-label="Desplazar izquierda"
                >
                  <ChevronLeft size={18} className="text-[#78716C]" />
                </button>
                <div
                  ref={scrollContainerRef}
                  className="flex flex-nowrap gap-2.5 overflow-x-auto pb-2 pr-1 custom-scrollbar -mx-4 px-6 sm:mx-0 sm:px-0"
                >
                  {orderedProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => onFilterChange('profile', profile.id)}
                      aria-pressed={activeFilters.profile === profile.id}
                      className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f39c12]/35 focus-visible:ring-offset-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] ${activeFilters.profile === profile.id
                        ? 'bg-[#f39c12] text-white border-transparent shadow-[0_5px_15px_rgba(243,156,18,0.3)]'
                        : 'bg-white text-[#444] border-[#eeeeee] hover:bg-[#f7f7f7]'
                        }`}
                      style={{ fontFamily: "'Inter', 'Lato', sans-serif" }}
                    >
                      {profile.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] rounded-full p-2 opacity-80 transition-opacity duration-200 -mr-1 hover:opacity-100"
                  aria-label="Desplazar derecha"
                >
                  <ChevronRight size={18} className="text-[#78716C]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
