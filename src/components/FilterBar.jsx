import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import giftsData from '@/data/gifts.json';
import { getOrderedProfileOptionsFromGifts } from '@/lib/profiles';

function FilterBar({ onFilterChange, activeFilters }) {
  const { t } = useTranslation();

  const orderedProfiles = useMemo(() => {
    return getOrderedProfileOptionsFromGifts(giftsData);
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

  return (
    <div className="bg-card/80 backdrop-blur-md border-b border-border py-4 sm:py-5 sticky top-0 z-40 transition-all duration-300">
      {/* Header */}
      <div className="w-full border-y border-accent/20 bg-accent/10 px-6 py-5 sm:px-10 sm:py-8 text-center backdrop-blur-sm">
        <h1 className="text-[22px] sm:text-[32px] font-black text-accent leading-tight tracking-tight max-w-3xl mx-auto drop-shadow-sm">
          🎁 Ideas de regalo para perfiles y presupuestos a medida 🎁
        </h1>
        <p className="mt-3 text-[16px] sm:text-[18px] font-semibold text-accent/80 leading-relaxed max-w-2xl mx-auto">
          ¡Utiliza los filtros y encuentra buenas opciones rápido y sin estrés!
        </p>
      </div>

      {/* Amazon notice */}
      <div className="w-full border-b border-border bg-muted/5 px-6 py-4 text-center">
        <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto opacity-80">
          Estos enlaces llevan a Amazon. Si compras desde ellos recibimos una pequeña comisión y a ti te cuesta lo mismo.
        </p>
      </div>


      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-6 sm:mt-8">

        {/* Budget Filter */}
        <div>
          <h3 className="text-[14px] sm:text-[15px] font-black text-foreground uppercase tracking-[0.2em] mb-4 opacity-70">
            PRESUPUESTO
          </h3>
          <div className="flex flex-wrap gap-3">
            {budgetRanges.map((budget) => (
              <button
                key={budget.value}
                onClick={() => onFilterChange('budget', budget.value)}
                aria-pressed={activeFilters.budget === budget.value}
                className={`group px-4 sm:px-6 py-3 h-[84px] rounded-2xl transition-all duration-300 border-2 flex flex-col items-center justify-center flex-1 basis-[calc(50%-6px)] sm:flex-none sm:min-w-[150px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:translate-y-[-2px] ${activeFilters.budget === budget.value
                  ? 'bg-gradient-to-br from-primary to-orange-600 text-primary-foreground border-transparent shadow-lg scale-[1.02]'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5'
                  }`}
              >
                <div className={`text-[12px] sm:text-[13px] font-black uppercase tracking-tight leading-tight transition-colors ${activeFilters.budget === budget.value ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {budget.label}
                </div>
                {budget.sublabel && (
                  <div className={`text-[14px] sm:text-[15px] font-black mt-1 transition-colors ${activeFilters.budget === budget.value ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                    {budget.sublabel}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Categories Filter */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-[14px] sm:text-[15px] font-black text-foreground uppercase tracking-[0.2em] opacity-70">
              PARA QUIÉN BUSCAS
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange('tier', cat.id)}
                aria-pressed={activeFilters.tier === cat.id}
                className={`px-6 py-2.5 min-h-[44px] rounded-full text-[14px] font-bold border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeFilters.tier === cat.id
                  ? 'bg-foreground text-background border-foreground shadow-md scale-[1.05]'
                  : 'bg-card border-border text-muted-foreground hover:border-muted'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <h3 className="text-[12px] sm:text-[13px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">
              O elige un perfil específico
            </h3>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-4 pr-1 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {orderedProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onFilterChange('profile', profile.id)}
                  aria-pressed={activeFilters.profile === profile.id}
                  className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${activeFilters.profile === profile.id
                    ? 'bg-primary/20 text-primary border-primary/30 shadow-sm'
                    : 'bg-muted/10 text-muted-foreground border-transparent hover:bg-muted/20 hover:border-border'
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
