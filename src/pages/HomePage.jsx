/* eslint-disable no-unused-vars */
import { useEffect, useCallback, useMemo, useLayoutEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Activity, ChevronUp, ChevronDown, RefreshCw, Trash2 } from 'lucide-react';
import Footer from '@/components/Footer';
import SeasonalBanner from '@/components/SeasonalBanner';
import { GiftSteps } from '@/components/GiftSteps';
import { ProfilesSelector } from '@/components/ProfilesSelector';
import { ResultsGrid } from '@/components/ResultsGrid';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchProductData } from '@/lib/paapi';
import { getCacheStats, getCacheSize, getCacheContents, clearCache } from '@/lib/cacheDebug';
import { useGiftFilters } from '@/hooks/useGiftFilters';
import { AMAZON_CONFIG } from '@/config';
import { getMarketGifts } from '@/data/market-gifts';
import { getSortedUniqueGifts } from '@/lib/profiles';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gifts, setGifts] = useState([]);
  const [productDataMap, setProductDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState([]);
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);
  const didMountRef = useRef(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    tier,
    budget,
    profileId,
    searchQuery,
    setTier,
    setBudget,
    setProfileId,
    setSearchQuery,
  } = useGiftFilters({
    tier: searchParams.get('tier') || 'all',
    budget: searchParams.get('budget') || 'all',
    profileId: searchParams.get('profile') || 'all',
    searchQuery: '',
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
  const displayGifts = useMemo(() => getSortedUniqueGifts(giftsData), [giftsData]);

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
        setLoadingProducts(prev => prev.filter(a => a !== gift.asin));
        console.error('Error al obtener producto ' + gift.id + ':', error);

        const errObj = {
          title: gift.product_name,
          price: gift.price_range,
          available: false,
          image: null,
          affiliate_url: 'https://' + gift.marketplace + '/dp/' + gift.asin + '?tag=' + gift.tag,
          error: 'Tenemos problemas para obtener los datos del producto. Inténtalo de nuevo más tarde.',
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
    setProductDataMap(prev => ({ ...prev, ...dataMap }));
    setLoading(false);
  }, [isManualProductMode, updateCacheInfo]);

  useEffect(() => {
    setGifts(displayGifts);
    fetchAllProducts(displayGifts);
  }, [displayGifts, fetchAllProducts]);

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

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (loading && gifts.length === 0) return;

    setIsFilterTransitioning(true);
    const timeoutId = window.setTimeout(() => setIsFilterTransitioning(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [budget, profileId, tier]);

  const handleSelectTier = (value) => {
    setTier((current) => (current === value ? 'all' : value));
    setProfileId('all');
  };

  const handleSelectProfile = (value) => {
    setProfileId((current) => (current === value ? 'all' : value));
    setTier('all');
  };

  const handleSelectBudget = (value) => {
    setBudget((current) => (current === value ? 'all' : value));
  };

  useEffect(() => {
    const newParams = {};
    if (tier !== 'all') newParams.tier = tier;
    if (budget !== 'all') newParams.budget = budget;
    if (profileId !== 'all') newParams.profile = profileId;
    setSearchParams(newParams);
  }, [budget, profileId, setSearchParams, tier]);

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
    toast({ title: 'Caché borrada' });
  };

  return (
    <>
      <Helmet>
        <title>{t('seo.home_title')}</title>
        <meta name="description" content={t('seo.home_description')} />
      </Helmet>

      <div className="min-h-screen flex flex-col relative pb-16" style={{ backgroundColor: 'var(--nw-bg)' }}>
        <SeasonalBanner />
        <div className="max-w-3xl mx-auto mt-6 mb-0 px-2">
          <p className="text-[12px] sm:text-[13px] text-[#444] font-normal text-center leading-snug" style={{ marginTop: 0 }}>
            Algunos enlaces van a Amazon y son de afiliado (más info en{' '}
            <Link to="/como-funciona" className="underline underline-offset-2 decoration-1 text-[#333] hover:text-[#111]">
              Cómo funciona NoWorries
            </Link>
            ).
          </p>
        </div>

        <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6" aria-busy={loading && gifts.length === 0}>
          <div className="max-w-[1100px] mx-auto">
            <div className="mx-auto max-w-[720px] mb-8 text-center mt-0 sm:mt-0">
              <h1 className="hero-title is-visible text-[2.2rem] lg:text-[2.5rem] font-bold text-[#111111] leading-[1.13] tracking-[-0.01em] mt-0 mb-1" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", marginTop: 0 }}>
                {t('site.name')}
              </h1>
              <p className="hero-subtitle is-visible mt-2 mx-auto max-w-[42rem] text-[0.97rem] font-normal text-[#5a5a5a] leading-[1.5] mb-2" style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", marginBottom: '-4px' }}>
                {t('site.tagline')}
              </p>
            </div>

            {showDemoBanner && (
              <div className="mb-6 rounded-2xl border border-[#e8e1c7] bg-[#fbf8ef] px-4 py-3 text-sm text-[#5e5a45]">
                Modo demostración activo mientras se validan algunos datos de producto.
              </div>
            )}

            <GiftSteps
              selectedBudget={budget}
              onSelectBudget={handleSelectBudget}
              profileSelector={(
                <ProfilesSelector
                  selectedTier={tier}
                  onSelectTier={handleSelectTier}
                  selectedProfileId={profileId}
                  onSelectProfile={handleSelectProfile}
                />
              )}
              results={(
                <ResultsGrid
                  gifts={gifts}
                  searchGifts={giftsData}
                  productDataMap={productDataMap}
                  isLoading={loading || isFilterTransitioning}
                  loadingProducts={loadingProducts}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  budget={budget}
                  tier={tier}
                  profileId={profileId}
                />
              )}
            />
          </div>
        </main>

        <Footer />
        <Toaster />

        {IS_DEV && (
          <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-green-400 font-mono text-xs z-50 border-t border-gray-700 transition-all duration-300 ${isDebugOpen ? 'h-72 overflow-y-auto' : 'h-10'}`}>
            <div className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-800 sticky top-0" onClick={() => setIsDebugOpen(!isDebugOpen)}>
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
