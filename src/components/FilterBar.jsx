import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMarketGifts } from '@/data/market-gifts';
import { getOrderedProfileOptionsFromGifts } from '@/lib/profiles';

function FilterBar({ onFilterChange, activeFilters }) {
  const { t } = useTranslation();
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

  return (
    <div className="bg-card border-b border-border py-3 sm:py-4 relative z-30 transition-all duration-300">
      {/* Header */}
      <div className="w-full border-y border-accent/15 bg-accent/5 px-5 py-4 sm:px-8 sm:py-5 text-center backdrop-blur-sm">
        <h1 className="text-[18px] sm:text-[24px] font-extrabold text-accent leading-tight tracking-tight max-w-3xl mx-auto">
          Ideas de regalo para perfiles y presupuestos a medida
        </h1>
        <p className="mt-2 text-[14px] sm:text-[16px] font-semibold text-accent/85 leading-relaxed max-w-2xl mx-auto">
          ¡Utiliza los filtros y encuentra buenas opciones rápido y sin estrés!
        </p>
      </div>

      {/* Amazon notice */}
      <div className="w-full border-b border-border bg-muted/5 px-6 py-3 text-center">
        <p className="text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto opacity-90">
          Estos enlaces llevan a Amazon. Si compras desde ellos recibimos una pequeña comisión y a ti te cuesta lo mismo.
        </p>
      </div>


      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6 mt-5 sm:mt-6">

        {/* Budget Filter */}
        <div>
          <h3 className="text-[12px] sm:text-[13px] font-black text-foreground uppercase tracking-[0.2em] mb-3 opacity-75">
            PRESUPUESTO
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {budgetRanges.map((budget) => (
              <button
                key={budget.value}
                onClick={() => onFilterChange('budget', budget.value)}
                aria-pressed={activeFilters.budget === budget.value}
                className={`group px-3 sm:px-4 py-2 h-[66px] sm:h-[68px] rounded-xl transition-all duration-300 border flex flex-col items-center justify-center flex-1 basis-[calc(50%-5px)] sm:flex-none sm:min-w-[142px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:translate-y-[-1px] ${activeFilters.budget === budget.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card border-border text-foreground hover:border-primary/45 hover:bg-primary/5'
                  }`}
              >
                <div className={`text-[11px] sm:text-[12px] font-black uppercase tracking-tight leading-tight transition-colors ${activeFilters.budget === budget.value ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {budget.label}
                </div>
                {budget.sublabel && (
                  <div className={`text-[13px] sm:text-[14px] font-black mt-0.5 transition-colors ${activeFilters.budget === budget.value ? 'text-primary-foreground/95' : 'text-muted-foreground'}`}>
                    {budget.sublabel}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Categories Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-[12px] sm:text-[13px] font-black text-foreground uppercase tracking-[0.2em] opacity-75">
              PARA QUIÉN BUSCAS
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange('tier', cat.id)}
                aria-pressed={activeFilters.tier === cat.id}
                className={`px-4 py-2 min-h-[38px] rounded-full text-[13px] font-bold border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeFilters.tier === cat.id
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-card border-border text-foreground/85 hover:border-muted'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <h3 className="text-[11px] sm:text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
              O elige un perfil específico
            </h3>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 pr-1 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {orderedProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onFilterChange('profile', profile.id)}
                  aria-pressed={activeFilters.profile === profile.id}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${activeFilters.profile === profile.id
                    ? 'bg-primary/15 text-primary border-primary/30 shadow-sm'
                    : 'bg-muted/10 text-foreground/85 border-transparent hover:bg-muted/20 hover:border-border'
                    }`}
                >
                  {profile.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}

export default FilterBar;
