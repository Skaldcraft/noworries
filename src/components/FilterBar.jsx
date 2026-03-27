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
    <div className="relative z-30 bg-white px-0 sm:px-0 pb-0 sm:pb-0 border-none">
      <div className="max-w-[1100px] mx-auto bg-white px-0 sm:px-0 pt-4 sm:pt-5 pb-8 sm:pb-10 text-center border-none shadow-none rounded-none">
        <div className="overflow-x-auto whitespace-nowrap text-[11px] leading-none text-[#888] pb-4 sm:pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="inline-block">{t('filters.legal')}</span>
        </div>

        <div className="mx-auto max-w-[720px] mb-10">
          <h1
            className="hero-title is-visible text-[2.4rem] lg:text-[2.7rem] font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            Encuentra el regalo perfecto sin romperte la cabeza
          </h1>
          <p
            className="hero-subtitle is-visible mt-3 mx-auto max-w-[42rem] text-[1rem] font-normal text-[#5a5a5a] leading-[1.6]"
            style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", marginBottom: '-8px' }}
          >
            Ofrecemos información de precios aproximados clasificados por rangos. Los precios pueden variar de rango por unos euros.<br />
            El precio final es el de la web oficial de Amazon, verifica siempre antes de comprar.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <div className="w-full">
            <p
              className="hero-microcopy is-visible text-[13px] font-semibold text-[#9b9b9b] uppercase tracking-[0.12em] mb-3 text-center"
              style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" }}
            >
              Filtra por presupuesto y perfil y evita el laberinto de Amazon
            </p>
            <div className="filter-section is-visible mt-0">
              <h3 className="filter-section-title mt-0 mb-2">
                Presupuesto
              </h3>
              <div className="filter-buttons-group">
                {budgetRanges.map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => onFilterChange('budget', budget.value)}
                    aria-pressed={activeFilters.budget === budget.value}
                    className={`filter-button px-3 sm:px-4 lg:px-3 xl:px-4 py-2 sm:py-2.5 lg:py-2 flex flex-col items-center justify-center min-w-[92px] sm:min-w-[102px] lg:min-w-[94px] xl:min-w-[102px] ${activeFilters.budget === budget.value ? 'is-active' : ''}`}
                  >
                    <div className="text-[9px] sm:text-[10px] lg:text-[9px] xl:text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight">
                      {budget.label}
                    </div>
                    {budget.sublabel && (
                      <div className="text-[12px] sm:text-[13px] lg:text-[12px] xl:text-[13px] font-semibold mt-0.5">
                        {budget.sublabel}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="filter-section is-visible">
              <h3 className="filter-section-title">
                Para quién buscas
              </h3>
              <div className="filter-buttons-group">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onFilterChange('tier', cat.id)}
                    aria-pressed={activeFilters.tier === cat.id}
                    className={`filter-button px-4 sm:px-5 lg:px-3.5 xl:px-5 py-2.5 lg:py-2 min-h-[40px] lg:min-h-[36px] ${activeFilters.tier === cat.id ? 'is-active' : ''}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-5 sm:pt-6">
              <h3 className="text-[11px] font-medium text-[#b0b0b0] uppercase tracking-[0.16em] mb-3 text-center"
                style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}>
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
                  className="gift-profiles overflow-x-auto whitespace-nowrap"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {orderedProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => onFilterChange('profile', profile.id)}
                      aria-pressed={activeFilters.profile === profile.id}
                      className={`profile-chip shrink-0 px-4 sm:px-5 py-2.5 text-[12px] whitespace-nowrap focus-visible:outline-none ${activeFilters.profile === profile.id
                          ? 'is-active bg-[#f7f7f2] border-[#C8E63A] font-semibold'
                          : 'bg-white border-[#C8E63A] font-medium'
                          }`}
                      style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}
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
