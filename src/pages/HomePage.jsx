
import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Activity, ChevronUp, ChevronDown, RefreshCw, Trash2, Info, X } from 'lucide-react';
import Footer from '@/components/Footer';
import SeasonalBanner from '@/components/SeasonalBanner';
import FilterBar from '@/components/FilterBar';
import GiftCard from '@/components/GiftCard';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getMarketGifts } from '@/data/market-gifts';
import { fetchProductData } from '@/lib/paapi';
import { getCacheStats, getCacheSize, getCacheContents, clearCache } from '@/lib/cacheDebug';
import { getProfileIdFromGiftId } from '@/lib/profiles';
import { AMAZON_CONFIG } from '@/config';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gifts, setGifts] = useState([]);
  const [productDataMap, setProductDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState([]);
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const [activeFilters, setActiveFilters] = useState({
    tier: searchParams.get('tier') || 'all',
    budget: searchParams.get('budget') || 'all',
    profile: searchParams.get('profile') || 'all'
  });

  const [debugStats, setDebugStats] = useState({
    totalCalls: 0,
    successes: 0,
    failures: 0,
    totalTimeMs: 0,
    lastAttempt: null,
    lastError: null,
    failedProducts: []
  });
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [cacheInfo, setCacheInfo] = useState({ stats: null, size: 0, contents: [] });
  const giftsData = useMemo(() => getMarketGifts(), []);

  const homepageGifts = useMemo(() => {
    // Keep one card per profile+budget pair on home: newest entry stays on home,
    // while older ones remain available in profile pages.
    const latestIndexByKey = new Map();

    giftsData.forEach((gift, index) => {
      const profileId = getProfileIdFromGiftId(gift.id) || gift.recipient;
      const key = `${profileId}::${gift.price_range}`;
      latestIndexByKey.set(key, index);
    });

    return giftsData.filter((gift, index) => {
      const profileId = getProfileIdFromGiftId(gift.id) || gift.recipient;
      const key = `${profileId}::${gift.price_range}`;
      return latestIndexByKey.get(key) === index;
    });
  }, [giftsData]);

  const IS_DEV = import.meta.env.DEV;
  const isManualProductMode = AMAZON_CONFIG.MANUAL_PRODUCT_MODE === true;

  const updateCacheInfo = useCallback(() => {
    try {
      setCacheInfo({
        stats: getCacheStats(),
        size: getCacheSize(),
        contents: getCacheContents()
      });
    } catch (e) {
      console.error('[HomePage] Error updating cache info:', e);
    }
  }, []);

  const fetchAllProducts = useCallback(async (giftsToFetch) => {
    if (isManualProductMode) {
      setLoadingProducts([]);
      setProductDataMap({});
      setShowDemoBanner(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    let hasApiErrors = false;
    let usingMockData = false;

    let calls = 0;
    let success = 0;
    let fail = 0;
    let timeAcc = 0;
    let failedArr = [];
    let lastErr = null;

    const fetchPromises = giftsToFetch.map(async (gift) => {
      setLoadingProducts(prev => [...prev, gift.asin]);
      try {
        const data = await fetchProductData(gift.asin, gift.tag, gift.marketplace);

        calls++;
        timeAcc += (data.timingMs || 0);

        if (data.isMock) {
          usingMockData = true;
        }

        if (data.hasApiError) {
          hasApiErrors = true;
          fail++;
          failedArr.push(gift.asin);
          lastErr = data;
        } else {
          success++;
        }

        setLoadingProducts(prev => prev.filter(a => a !== gift.asin));
        return { id: gift.id, data };
      } catch (error) {
        calls++;
        fail++;
        failedArr.push(gift.asin);
        hasApiErrors = true;
        setLoadingProducts(prev => prev.filter(a => a !== gift.asin));
        console.error(`Error al obtener producto ${gift.id}:`, error);

        const errObj = {
          title: gift.product_name,
          price: gift.price_range,
          available: false,
          image: null,
          affiliate_url: `https://${gift.marketplace}/dp/${gift.asin}?tag=${gift.tag}`,
          error: "Tenemos problemas para obtener los datos del producto. Inténtalo de nuevo más tarde.",
          errorType: 'UNKNOWN',
          hasApiError: true,
          isMock: false
        };
        lastErr = errObj;
        return { id: gift.id, data: errObj };
      }
    });

    const results = await Promise.allSettled(fetchPromises);

    setDebugStats(prev => ({
      totalCalls: prev.totalCalls + calls,
      successes: prev.successes + success,
      failures: prev.failures + fail,
      totalTimeMs: prev.totalTimeMs + timeAcc,
      lastAttempt: new Date().toISOString(),
      lastError: lastErr || prev.lastError,
      failedProducts: failedArr
    }));
    updateCacheInfo();

    const dataMap = {};
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        dataMap[result.value.id] = result.value.data;
      }
    });

    setShowDemoBanner(usingMockData);

    /* Eliminado el toast de error para evitar asustar a los usuarios durante la fase inicial
    if (hasApiErrors && !usingMockData) {
      toast({
        title: "Problema de conexión",
        description: "Tenemos problemas para conectar con Amazon y obtener los precios en vivo.",
        variant: "destructive",
        duration: 5000,
      });
    }
    */

    setProductDataMap(prev => ({ ...prev, ...dataMap }));
    setLoading(false);
  }, [isManualProductMode, toast, updateCacheInfo]);

  useEffect(() => {
    setGifts(homepageGifts);
    fetchAllProducts(homepageGifts);
  }, [fetchAllProducts, homepageGifts]);

  useLayoutEffect(() => {
    const shouldRestore = sessionStorage.getItem('homeShouldRestoreScroll') === '1';
    const savedY = Number(sessionStorage.getItem('homeScrollY') || '0');

    if (shouldRestore && savedY > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
      });
    }

    sessionStorage.removeItem('homeShouldRestoreScroll');
  }, []);

  const handleRetryFailed = () => {
    if (isManualProductMode) {
      return;
    }

    const failedGifts = gifts.filter(g => debugStats.failedProducts.includes(g.asin));
    if (failedGifts.length > 0) {
      fetchAllProducts(failedGifts);
    }
  };

  const handleClearCache = () => {
    clearCache();
    updateCacheInfo();
    toast({ title: "Caché borrada" });
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => {
      // Lógica simple: tier y profile son mutuamente excluyentes
      if (filterType === 'tier') {
        // Hacemos toggle de tier. Si es igual, pasa a 'all'. Si es diferente, setea el nuevo valor
        const newTier = prev.tier === value ? 'all' : value;
        // Si setea un tier específico, limpia profile. Si es 'all', lo deja como está
        const newProfile = newTier !== 'all' ? 'all' : prev.profile;
        return { ...prev, tier: newTier, profile: newProfile };
      }
      
      if (filterType === 'profile') {
        // Hacemos toggle de profile. Si es igual, pasa a 'all'. Si es diferente, setea el nuevo valor
        const newProfile = prev.profile === value ? 'all' : value;
        // Si setea un profile específico, limpia tier. Si es 'all', lo deja como está
        const newTier = newProfile !== 'all' ? 'all' : prev.tier;
        return { ...prev, tier: newTier, profile: newProfile };
      }
      
      if (filterType === 'budget') {
        // Budget es independiente, simplemente toggle
        const newBudget = prev.budget === value ? 'all' : value;
        return { ...prev, budget: newBudget };
      }
      
      return prev;
    });
  };

  // Actualizar URL params cuando cambian los filtros
  useEffect(() => {
    const newParams = {};
    if (activeFilters.tier !== 'all') newParams.tier = activeFilters.tier;
    if (activeFilters.budget !== 'all') newParams.budget = activeFilters.budget;
    if (activeFilters.profile !== 'all') newParams.profile = activeFilters.profile;
    setSearchParams(newParams);
  }, [activeFilters, setSearchParams]);

  const filteredGifts = gifts.filter((gift) => {
    const pId = getProfileIdFromGiftId(gift.id);
    const tierMatch = activeFilters.tier === 'all' || gift.tier === activeFilters.tier;
    const budgetMatch = activeFilters.budget === 'all' || gift.price_range === activeFilters.budget;
    const profileMatch = activeFilters.profile === 'all' || pId === activeFilters.profile;
    return tierMatch && budgetMatch && profileMatch;
  });

  const isInitialLoading = loading && gifts.length === 0;

  return (
    <>
      <Helmet>
        <title>{t('seo.home_title')}</title>
        <meta name="description" content={t('seo.home_description')} />
      </Helmet>

      <div className="min-h-screen bg-[#f9f9f9] flex flex-col relative pb-16">
        <SeasonalBanner />
        <FilterBar onFilterChange={handleFilterChange} activeFilters={activeFilters} />

        <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6" aria-busy={isInitialLoading}>
          <div className="max-w-[1100px] mx-auto">
            {/* Banner de Modo Demo eliminado para Producción */}

            {!isInitialLoading && filteredGifts.length > 0 && (
              <p className="mb-6 text-[13px] font-bold text-muted-foreground animate-in fade-in duration-700" aria-live="polite">
                {t('home.results', { count: filteredGifts.length })}
              </p>
            )}

            {isInitialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="bg-card rounded-2xl shadow-sm border border-border p-6 h-[410px] animate-pulse">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredGifts.map((gift, index) => (
                  <div 
                    key={gift.id} 
                    className={`animate-in fade-in slide-in-from-bottom stagger-${(index % 5) + 1}`}
                  >
                    <GiftCard
                      gift={gift}
                      productData={productDataMap[gift.id]}
                      loading={loading && loadingProducts.includes(gift.asin)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>


        <Footer />
        <Toaster />

        {/* Panel de Depuración */}
        {IS_DEV && (
          <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-green-400 font-mono text-xs z-50 border-t border-gray-700 transition-all duration-300 ${isDebugOpen ? 'h-72 overflow-y-auto' : 'h-10'}`}>
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-800 sticky top-0"
              onClick={() => setIsDebugOpen(!isDebugOpen)}
            >
              <div className="flex items-center gap-3">
                <Activity size={16} className={debugStats.failures > 0 ? 'text-red-400' : 'text-green-400'} />
                <span className="font-bold text-white">Panel Depuración PAAPI</span>
                <span className="text-gray-400">|</span>
                <span>Llamadas: {debugStats.totalCalls}</span>
                <span className="text-green-400">Éxito: {debugStats.successes}</span>
                <span className="text-red-400">Fallos: {debugStats.failures}</span>
                {loading && <span className="animate-pulse text-yellow-400 ml-2">Cargando...</span>}
              </div>
              <button className="text-gray-400 hover:text-white">
                {isDebugOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            </div>

            {isDebugOpen && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white border-b border-gray-700 pb-1 mb-2">Estadísticas de API</h3>
                    <p>Tiempo Respuesta Medio: {debugStats.totalCalls > 0 ? (debugStats.totalTimeMs / debugStats.totalCalls).toFixed(1) : 0}ms</p>
                    <p>Último Intento: {debugStats.lastAttempt || 'N/A'}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRetryFailed(); }}
                      disabled={debugStats.failedProducts.length === 0 || loading}
                      className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      <RefreshCw size={14} /> Reintentar {debugStats.failedProducts.length} Fallidos
                    </button>
                  </div>

                  {debugStats.lastError && (
                    <div className="bg-red-900/30 p-2 rounded border border-red-800 text-red-300 overflow-x-auto">
                      <p className="font-bold text-red-400 mb-1">Detalles del Último Error:</p>
                      <p>Tipo: {debugStats.lastError.errorType}</p>
                      <p>Código: {debugStats.lastError.statusCode || 'N/A'}</p>
                      <p>Mensaje: {debugStats.lastError.error}</p>
                      {debugStats.lastError.details && (
                        <pre className="mt-1 text-[10px] whitespace-pre-wrap">{JSON.stringify(debugStats.lastError.details, null, 2)}</pre>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-white border-b border-gray-700 pb-1 mb-2 flex justify-between items-center">
                      Información de Caché
                      <button onClick={handleClearCache} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                        <Trash2 size={12} /> Borrar Caché
                      </button>
                    </h3>
                    <p>Aciertos: {cacheInfo.stats?.hits || 0} | Fallos: {cacheInfo.stats?.misses || 0}</p>
                    <p>Items en Caché: {cacheInfo.stats?.totalItems || 0} (~{(cacheInfo.size / 1024).toFixed(2)} KB)</p>
                  </div>

                  {cacheInfo.contents.length > 0 && (
                    <div className="bg-gray-800 p-2 rounded h-32 overflow-y-auto">
                      <p className="text-gray-400 text-[10px] mb-1 uppercase tracking-wider">ASINs en Caché</p>
                      <ul className="space-y-1">
                        {cacheInfo.contents.map(c => (
                          <li key={c.key} className="text-[11px] truncate">
                            <span className="text-yellow-400">{c.asin}</span> - {c.data.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
