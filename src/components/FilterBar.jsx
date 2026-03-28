import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMarketGifts } from '@/data/market-gifts';
import styleGuide from '@/config/style-guide.json';
import { getProfileIdFromGiftId, profileDisplayLabels } from '@/lib/profiles';

function FilterBar({ onFilterChange, activeFilters }) {
  const { t } = useTranslation();
  const [showAllProfiles, setShowAllProfiles] = useState(false);
  const giftsData = useMemo(() => getMarketGifts(), []);

  const segments = [
    { key: 'person', label: t('filters.categories.person') },
    { key: 'personality', label: t('filters.categories.personality') },
    { key: 'occasion', label: t('filters.categories.occasion') }
  ];

  const budgetRanges = [
    { label: t('filters.budget_ranges.all'), value: 'all' },
    { label: t('filters.budget_ranges.under15_label'), sublabel: t('filters.budget_ranges.under15_sub'), value: 'under15' },
    { label: t('filters.budget_ranges.r15_35_label'), sublabel: t('filters.budget_ranges.r15_35_sub'), value: '15-35' },
    { label: t('filters.budget_ranges.r35_70_label'), sublabel: t('filters.budget_ranges.r35_70_sub'), value: '35-70' },
    { label: t('filters.budget_ranges.r70_150_label'), sublabel: t('filters.budget_ranges.r70_150_sub'), value: '70-150' }
  ];

  const profileSegmentById = {
    pareja: 'person',
    mama: 'person',
    papa: 'person',
    bebes: 'person',
    ninos: 'person',
    adolescentes: 'person',
    abuelos: 'person',
    mejor_amigo: 'person',
    companeros: 'person',
    nuevos_papis: 'person',
    mascotas: 'personality',
    gente_tecnologica: 'personality',
    manitas: 'personality',
    cuidarse: 'personality',
    deportistas: 'personality',
    viajeros: 'personality',
    cocinillas: 'personality',
    creativos: 'personality',
    lectores: 'personality',
    ecologistas: 'personality',
    gente_casera: 'personality',
    quien_lo_tiene_todo: 'personality',
    basicos_utiles: 'personality',
    cumpleanios: 'occasion',
    nuevo_hogar: 'occasion',
    nuevo_trabajo: 'occasion',
    amigo_invisible: 'occasion',
    despedida: 'occasion',
    detalle: 'occasion',
    solo_porque_si: 'occasion'
  };

  const standardProfileOrder = useMemo(
    () => Object.keys(styleGuide.profiles || {}),
    []
  );

  const profilesBySegment = useMemo(() => {
    const grouped = {
      person: [],
      personality: [],
      occasion: []
    };

    const seen = new Set();

    standardProfileOrder.forEach((profileId) => {
      const segment = profileSegmentById[profileId];
      if (!segment || seen.has(profileId)) return;

      const label = profileDisplayLabels[profileId] || styleGuide.profiles?.[profileId]?.title || profileId;
      grouped[segment].push({ id: profileId, label });
      seen.add(profileId);
    });

    giftsData.forEach((gift) => {
      const profileId = getProfileIdFromGiftId(gift.id);
      const segment = profileSegmentById[profileId] || gift.tier;
      if (!profileId || !grouped[segment] || seen.has(profileId)) return;

      grouped[segment].push({
        id: profileId,
        label: profileDisplayLabels[profileId] || gift.recipient || profileId
      });
      seen.add(profileId);
    });

    grouped.personality = grouped.personality.sort((a, b) => {
      const priority = ['quien_lo_tiene_todo', 'basicos_utiles'];
      const indexA = priority.includes(a.id) ? priority.indexOf(a.id) : 99;
      const indexB = priority.includes(b.id) ? priority.indexOf(b.id) : 99;
      return indexA - indexB;
    });

    return grouped;
  }, [giftsData, standardProfileOrder]);

  const profileTierMap = useMemo(() => {
    const map = new Map();

    giftsData.forEach((gift) => {
      const profileId = getProfileIdFromGiftId(gift.id);
      if (profileId && !map.has(profileId)) {
        map.set(profileId, gift.tier);
      }
    });

    return map;
  }, [giftsData]);

  const activeSegment = activeFilters.tier !== 'all'
    ? activeFilters.tier
    : profileTierMap.get(activeFilters.profile) || 'person';

  const visibleProfiles = profilesBySegment[activeSegment] || [];
  const SHORT_LIST_LIMIT = 8;
  const shortList = visibleProfiles.slice(0, SHORT_LIST_LIMIT);
  const activeSegmentLabel = segments.find((segment) => segment.key === activeSegment)?.label || '';
  const allProfiles = standardProfileOrder.map((profileId) => ({
    id: profileId,
    label: profileDisplayLabels[profileId] || styleGuide.profiles?.[profileId]?.title || profileId
  }));

  return (
    <div className="relative z-30 bg-white px-0 sm:px-0 pb-0 sm:pb-0 border-none">
      <div className="max-w-[1100px] mx-auto bg-white px-0 sm:px-0 pt-2 sm:pt-3 pb-4 sm:pb-6 text-center border-none shadow-none rounded-none">
        <div className="overflow-x-auto whitespace-nowrap text-[11px] leading-none text-[#888] pb-4 sm:pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="inline-block">{t('filters.legal')}</span>
        </div>

        <div className="mx-auto max-w-[720px] mb-4">
          <h1
            className="hero-title is-visible text-[2.2rem] lg:text-[2.5rem] font-bold text-[#111111] leading-[1.13] tracking-[-0.01em] mt-0 mb-1"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            {t('site.name')}
          </h1>
          <p
            className="hero-subtitle is-visible mt-2 mx-auto max-w-[42rem] text-[0.97rem] font-normal text-[#5a5a5a] leading-[1.5] mb-2"
            style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", marginBottom: '-4px' }}
          >
            {t('site.tagline')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-7">
          <div className="w-full">
            <p
              className="hero-microcopy is-visible text-[13px] font-semibold text-[#9b9b9b] uppercase tracking-[0.12em] mb-2 text-center"
              style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" }}
            >
              Elige presupuesto y afina por perfil sin barra deslizante
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
                {segments.map((segment) => (
                  <button
                    key={segment.key}
                    onClick={() => {
                      setShowAllProfiles(false);
                      onFilterChange('tier', segment.key);
                    }}
                    aria-pressed={activeFilters.tier === segment.key}
                    className={`filter-button px-4 sm:px-5 lg:px-3.5 xl:px-5 py-2.5 lg:py-2 min-h-[40px] lg:min-h-[36px] ${activeFilters.tier === segment.key ? 'is-active' : ''}`}
                  >
                    {segment.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-5 sm:pt-6">
              <div className="flex flex-col items-center gap-2 mb-3">
                <h3
                  className="text-[11px] font-medium text-[#b0b0b0] uppercase tracking-[0.16em] text-center"
                  style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}
                >
                  {activeSegmentLabel ? `Perfiles de ${activeSegmentLabel.toLowerCase()}` : 'Perfiles destacados'}
                </h3>
                {visibleProfiles.length > shortList.length && (
                  <button
                    type="button"
                    className="text-[12px] font-semibold text-[#7f7f75] hover:text-[#5f5f55] transition-colors"
                    onClick={() => setShowAllProfiles(true)}
                  >
                    Ver todos
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {shortList.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => onFilterChange('profile', profile.id)}
                    aria-pressed={activeFilters.profile === profile.id}
                    className={`profile-chip shrink-0 px-4 py-2.5 text-[12px] whitespace-nowrap focus-visible:outline-none ${activeFilters.profile === profile.id
                        ? 'is-active bg-[#f7f7f2] border-[#C8E63A] font-semibold'
                        : 'bg-white border-[#C8E63A] font-medium'
                      }`}
                    style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}
                  >
                    {profile.label}
                  </button>
                ))}
              </div>

              {showAllProfiles && visibleProfiles.length > 0 && (
                <div
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]"
                  onClick={() => setShowAllProfiles(false)}
                >
                  <div
                    className="w-full max-w-3xl rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] border border-[#ece8d7] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-[#f0ecdf] bg-[#faf8f1]">
                      <div>
                        <h4 className="text-[18px] font-semibold text-[#111111]" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
                          Todos los perfiles
                        </h4>
                        <p className="text-[13px] text-[#777]">
                          Orden estándar de la web
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAllProfiles(false)}
                        className="rounded-full px-4 py-2 text-[13px] font-semibold text-[#111] bg-white border border-[#ddd7c4] hover:bg-[#f7f4ea] transition-colors"
                      >
                        Cerrar
                      </button>
                    </header>

                    <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                        {allProfiles.map((profile) => (
                          <button
                            key={profile.id}
                            type="button"
                            onClick={() => {
                              onFilterChange('profile', profile.id);
                              setShowAllProfiles(false);
                            }}
                            aria-pressed={activeFilters.profile === profile.id}
                            className={`profile-chip px-4 py-2.5 text-[12px] whitespace-nowrap focus-visible:outline-none ${activeFilters.profile === profile.id
                                ? 'is-active bg-[#f7f7f2] border-[#C8E63A] font-semibold'
                                : 'bg-white border-[#C8E63A] font-medium'
                              }`}
                            style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}
                          >
                            {profile.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
