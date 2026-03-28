import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import GiftCard from '@/components/GiftCard';
import { getProfileIdFromGiftId } from '@/lib/profiles';

const budgetRangeMap = {
  low: 'under15',
  mid: '15-35',
  high: '35-70',
  wow: '70-150',
};

export function ResultsGrid({
  gifts,
  productDataMap,
  loading,
  loadingProducts,
  searchQuery,
  onSearchQueryChange,
  budget,
  tier,
  profileId,
}) {
  const { t } = useTranslation();

  const filteredGifts = useMemo(() => {
    const budgetRange = budgetRangeMap[budget] || budget;
    return gifts.filter((gift) => {
      const pId = getProfileIdFromGiftId(gift.id);
      const tierMatch = tier === 'all' || gift.tier === tier;
      const budgetMatch = budget === 'all' || gift.price_range === budgetRange;
      const profileMatch = profileId === 'all' || !profileId || pId === profileId;
      const searchMatch = searchQuery === '' || gift.product_name.toLowerCase().includes(searchQuery.toLowerCase());
      return tierMatch && budgetMatch && profileMatch && searchMatch;
    }).sort((a, b) => {
      const pIdA = getProfileIdFromGiftId(a.id) || a.recipient;
      const pIdB = getProfileIdFromGiftId(b.id) || b.recipient;
      if (pIdA !== pIdB) {
        const idxA = gifts.findIndex((g) => g.id === a.id);
        const idxB = gifts.findIndex((g) => g.id === b.id);
        return idxA - idxB;
      }
      const priceOrder = { under15: 0, '15-35': 1, '35-75': 2, '75-150': 3, '150-300': 4 };
      return (priceOrder[a.price_range] ?? 99) - (priceOrder[b.price_range] ?? 99);
    });
  }, [budget, gifts, profileId, searchQuery, tier]);

  const isInitialLoading = loading && gifts.length === 0;

  return (
    <section className="nw-results" aria-busy={isInitialLoading}>
      {!isInitialLoading && (
        <div className="mb-6 animate-in fade-in duration-700">
          <div className="relative max-w-md">
            <div className="flex items-center w-full h-full">
              <span className="flex items-center justify-center h-full absolute left-0 top-0 pl-4" style={{ height: '100%' }}>
                <Search className="text-gray-400" size={20} />
              </span>
              <input
                type="text"
                placeholder="Buscar regalos por el nombre"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C8E63A] focus:border-[#C8E63A] transition-all shadow-sm"
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
            <p className="mt-3 text-[12px] font-medium text-[#888880]">
              {filteredGifts.length} resultado{filteredGifts.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      )}

      {isInitialLoading ? (
        <div className="gift-section-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-card rounded-2xl shadow-sm border border-[#C8E63A] p-6 h-[410px] animate-pulse">
              <div className="h-4 w-32 bg-muted/20 rounded mx-auto mb-3" />
              <div className="h-4 w-20 bg-muted/20 rounded mx-auto mb-6" />
              <div className="h-[190px] bg-muted/10 rounded-xl mb-6" />
              <div className="h-5 w-3/4 bg-muted/20 rounded mx-auto mb-3" />
              <div className="h-5 w-2/3 bg-muted/20 rounded mx-auto mb-8" />
              <div className="h-12 w-full bg-muted/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredGifts.length === 0 ? (
        <div className="text-center py-20 animate-in fade-in slide-in-from-bottom duration-700" role="status" aria-live="polite">
          <p className="text-[18px] text-muted-foreground font-medium">
            {t('home.no_results')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredGifts.map((gift, index) => (
            <div key={gift.id} className={`gift-card animate-in fade-in slide-in-from-bottom stagger-${(index % 5) + 1}`}>
              <GiftCard gift={gift} productData={productDataMap[gift.id]} loading={loading && loadingProducts.includes(gift.asin)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
