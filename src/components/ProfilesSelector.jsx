import { useMemo, useState } from 'react';
import { getMarketGifts } from '@/data/market-gifts';
import styleGuide from '@/config/style-guide.json';
import { getProfileIdFromGiftId, profileDisplayLabels } from '@/lib/profiles';

const segmentLabels = {
  all: 'Todos',
  person: 'Personas',
  personality: 'Características',
  occasion: 'Ocasiones',
};

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
  nuevos_papis: 'occasion',
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
  cumpleanios: 'occasion',
  nuevo_hogar: 'occasion',
  nuevo_trabajo: 'occasion',
  amigo_invisible: 'occasion',
  despedida: 'occasion',
  detalle: 'occasion',
  solo_porque_si: 'occasion',
  basicos_utiles: 'occasion',
};

const allProfileOption = {
  id: 'all',
  label: 'Todos',
  segment: null,
};

export function ProfilesSelector({
  selectedTier,
  onSelectTier,
  selectedProfileId,
  onSelectProfile,
}) {
  const [showAllProfiles, setShowAllProfiles] = useState(false);
  const giftsData = useMemo(() => getMarketGifts(), []);

  const orderedProfiles = useMemo(() => {
    const profiles = [];
    const seen = new Set();

    giftsData.forEach((gift) => {
      const profileId = getProfileIdFromGiftId(gift.id);
      const segment = profileSegmentById[profileId] || gift.tier;
      if (!profileId || !segment || seen.has(profileId)) return;
      profiles.push({
        id: profileId,
        label: profileDisplayLabels[profileId] || styleGuide.profiles?.[profileId]?.title || gift.recipient || profileId,
        segment,
      });
      seen.add(profileId);
    });

    Object.keys(styleGuide.profiles || {}).forEach((profileId) => {
      const segment = profileSegmentById[profileId];
      if (!segment || seen.has(profileId)) return;
      profiles.push({
        id: profileId,
        label: profileDisplayLabels[profileId] || styleGuide.profiles?.[profileId]?.title || profileId,
        segment,
      });
      seen.add(profileId);
    });

    return profiles;
  }, [giftsData]);

  const profilesBySegment = useMemo(() => {
    return {
      person: orderedProfiles.filter((profile) => profile.segment === 'person'),
      personality: orderedProfiles.filter((profile) => profile.segment === 'personality'),
      occasion: orderedProfiles.filter((profile) => profile.segment === 'occasion'),
    };
  }, [orderedProfiles]);

  const activeSegment = selectedTier !== 'all' ? selectedTier : 'all';
  const visibleProfiles = selectedTier === 'all' ? orderedProfiles : (profilesBySegment[selectedTier] || []);
  const shortList = selectedTier === 'all' ? visibleProfiles : visibleProfiles.slice(0, 8);
  const visibleWithAll = [allProfileOption, ...shortList];
  const showAllButton = selectedTier !== 'all' && visibleProfiles.length > shortList.length;

  return (
    <section className="profiles-selector nw-profiles-selector">
      <div className="segments filter-buttons-group">
        {Object.entries(segmentLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setShowAllProfiles(false);
              onSelectTier(key);
            }}
            aria-pressed={selectedTier === key}
            className={`segment-button filter-button px-4 sm:px-5 lg:px-3.5 xl:px-5 py-2.5 lg:py-2 min-h-[40px] lg:min-h-[36px] ${selectedTier === key ? 'segment-button--active is-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pt-2 sm:pt-3">
        <div className="flex flex-col items-center gap-1 mb-1.5">
          <h3 className="text-[11px] font-medium text-[#b0b0b0] uppercase tracking-[0.16em] text-center" style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}>
            {selectedTier === 'all' ? 'Todos los perfiles' : (segmentLabels[activeSegment] ? `Perfiles de ${segmentLabels[activeSegment].toLowerCase()}` : 'Perfiles destacados')}
          </h3>
          {showAllButton && (
            <button
              type="button"
              className="profile-chip profile-chip--secondary text-[12px] font-semibold text-[#7f7f75] hover:text-[#5f5f55] transition-colors"
              onClick={() => setShowAllProfiles(true)}
            >
              Ver todos
            </button>
          )}
        </div>

        <div className="profiles-grid grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {visibleWithAll.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelectProfile(profile.id)}
              aria-pressed={selectedProfileId === profile.id}
              className={`profile-chip ${profile.id === 'all' ? 'profile-chip--all' : ''} shrink-0 px-4 py-2.5 text-[12px] whitespace-nowrap focus-visible:outline-none ${selectedProfileId === profile.id
                ? 'profile-chip--selected is-active bg-[#c8e63a] border-[#c8e63a] font-semibold'
                : 'bg-[#f7f7f2] border-[#c8e63a] font-medium'
              }`}
              style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}
            >
              {profile.label}
            </button>
          ))}
        </div>

        {showAllProfiles && visibleProfiles.length > 0 && (
          <div className="profiles-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]" onClick={() => setShowAllProfiles(false)}>
            <div className="profiles-modal w-full max-w-3xl rounded-[22px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] border border-[#ece8d7] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <header className="profiles-modal__header flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-[#f0ecdf] bg-[#faf8f1]">
                <div>
                  <h4 className="text-[18px] font-semibold text-[#111111]" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
                    Todos los perfiles
                  </h4>
                  <p className="text-[13px] text-[#777]">Orden estándar de la web</p>
                </div>
                <button type="button" onClick={() => setShowAllProfiles(false)} className="profiles-modal__close rounded-full px-4 py-2 text-[13px] font-semibold text-[#111] bg-white border border-[#ddd7c4] hover:bg-[#f7f4ea] transition-colors">
                  Cerrar
                </button>
              </header>

              <div className="profiles-modal__content max-h-[70vh] overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {[allProfileOption, ...orderedProfiles].map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => {
                        onSelectProfile(profile.id);
                        setShowAllProfiles(false);
                      }}
                      aria-pressed={selectedProfileId === profile.id}
                      className={`profile-chip ${profile.id === 'all' ? 'profile-chip--all' : ''} px-4 py-2.5 text-[12px] whitespace-nowrap focus-visible:outline-none ${selectedProfileId === profile.id
                        ? 'profile-chip--selected is-active bg-[#c8e63a] border-[#c8e63a] font-semibold'
                        : 'bg-[#f7f7f2] border-[#c8e63a] font-medium'
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
    </section>
  );
}
