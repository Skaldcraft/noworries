/* eslint-disable no-unused-vars */
import { Search, X } from 'lucide-react';
import GiftCard from '@/components/GiftCard';
import { getProfileIdFromGiftId } from '@/lib/profiles';
import { useMemo } from 'react';

const budgetRangeMap = {
  low: 'under15',
  mid: '15-35',
  high: '35-70',
  wow: '70-150',
};

function GiftCardSkeleton() {
  return (
    <article className="nw-gift-card nw-gift-card--skeleton">
      <div className="nw-skeleton-box nw-skeleton-box--image" />
      <div className="nw-skeleton-box nw-skeleton-box--line" />
      <div className="nw-skeleton-box nw-skeleton-box--line-short" />
    </article>
  );
}

export function ResultsGrid({
  gifts,
  searchGifts,
  productDataMap,
  isLoading,
  loadingProducts,
  searchQuery,
  onSearchQueryChange,
  budget,
  tier,
  profileId,
}) {
  const filteredByFilters = useMemo(() => {
    const budgetRange = budgetRangeMap[budget] || budget;

    return gifts.filter((gift) => {
      const pId = getProfileIdFromGiftId(gift.id);
      const tierMatch = tier === 'all' || gift.tier === tier;
      const budgetMatch = budget === 'all' || gift.price_range === budgetRange;
      const profileMatch = profileId === 'all' || !profileId || pId === profileId;
      return tierMatch && budgetMatch && profileMatch;
    });
  }, [budget, gifts, profileId, tier]);

  const searchableGifts = searchGifts || gifts;

  const searchFilteredGifts = useMemo(() => {
    const budgetRange = budgetRangeMap[budget] || budget;

    return searchableGifts.filter((gift) => {
      const pId = getProfileIdFromGiftId(gift.id);
      const tierMatch = tier === 'all' || gift.tier === tier;
      const budgetMatch = budget === 'all' || gift.price_range === budgetRange;
      const profileMatch = profileId === 'all' || !profileId || pId === profileId;
      return tierMatch && budgetMatch && profileMatch;
    });
  }, [budget, profileId, searchableGifts, tier]);

  const visibleGifts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredByFilters;

    return searchFilteredGifts.filter((gift) => {
      const textFields = [
        gift.titleShort,
        gift.product_name,
        gift.recipient,
        gift.descriptionShort,
        gift.public_description,
        gift.description,
      ].filter(Boolean);

      const tagValues = Array.isArray(gift.tags)
        ? gift.tags
        : typeof gift.tags === 'string'
          ? gift.tags.split(',')
          : [];

      return (
        textFields.some((value) => String(value).toLowerCase().includes(q)) ||
        tagValues.some((tag) => String(tag).toLowerCase().includes(q))
      );
    });
  }, [searchFilteredGifts, searchQuery]);

  const hasAnyGifts = (searchQuery.trim() ? searchFilteredGifts : filteredByFilters).length > 0;
  const hasVisibleGifts = visibleGifts.length > 0;
  const hasQuery = searchQuery.trim().length > 0;
  const isInitialLoading = isLoading && gifts.length === 0;

  return (
    <section className="nw-results" aria-busy={isLoading}>
      {!isInitialLoading && (
        <div className="mb-6 animate-in fade-in duration-700">
          <div className="nw-search">
            <div className="relative max-w-xl mx-auto">
              <span className="flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 pl-5 text-gray-400 pointer-events-none">
                <Search size={20} />
              </span>
                <input
                  type="search"
                  className="nw-search__input w-full pl-14 pr-12 py-3 bg-white border border-gray-200 rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C8E63A] focus:border-[#C8E63A] transition-all shadow-sm"
                  placeholder="Buscar en todo el sitio (manta, libro, taza…)"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                />
              {searchQuery && (
                <button
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          {searchQuery && (
            <p className="mt-3 text-[12px] font-medium text-[#888880] text-center">
              {visibleGifts.length} resultado{visibleGifts.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      )}

      {isLoading && !isInitialLoading && (
        <p className="nw-results__status">Buscando ideas que encajen contigo…</p>
      )}

      {isInitialLoading ? (
        <div className="nw-results-grid gift-section-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <GiftCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : !hasVisibleGifts ? (
        <div className="nw-empty-state" role="status" aria-live="polite">
          {hasAnyGifts && hasQuery ? (
            <>
              <h3>Con &ldquo;{searchQuery}&rdquo; no hemos encontrado nada 🤔</h3>
              <p>
                Prueba con otra palabra (por ejemplo, &ldquo;taza&rdquo;, &ldquo;libro&rdquo;, &ldquo;manta&rdquo;) o borra el buscador para ver todas las ideas del sitio.
              </p>
            </>
          ) : (
            <>
              <h3>Con estos filtros no tenemos ideas todavía</h3>
              <p>
                Prueba a ampliar el presupuesto, cambiar el perfil o elegir &ldquo;Todos los perfiles&rdquo; para ver opciones más generales.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="nw-results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {visibleGifts.map((gift, index) => (
            <div key={gift.id} className={`gift-card animate-in fade-in slide-in-from-bottom stagger-${(index % 5) + 1}`}>
              <GiftCard gift={gift} productData={productDataMap[gift.id]} loading={isLoading && loadingProducts.includes(gift.asin)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
