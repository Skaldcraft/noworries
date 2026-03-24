// src/lib/paapi.js
// Wrapper de la PA API: delega al proxy backend (server/api-proxy.js).
// HomePage.jsx importa fetchProductData desde aqui.

import { AMAZON_CONFIG } from '@/config';
import { recordCacheHit, recordCacheMiss } from './cacheDebug';
import { telemetry } from './telemetry';

const CACHE_PREFIX = 'paapi_';

function getCached(asin) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + asin);
    if (raw) {
      recordCacheHit(asin);
      telemetry.log('PAAPI', `Cache hit for ${asin}`);
      return JSON.parse(raw);
    }
  } catch (err) { 
    telemetry.error('PAAPI', 'SessionStorage access error', err);
    return null; 
  }
  return null;
}

function setCache(asin, data) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + asin, JSON.stringify(data));
  } catch (err) { 
    telemetry.log('PAAPI', 'SessionStorage full, skipping cache write');
  }
}

function clearCached(asin) {
  try {
    sessionStorage.removeItem(CACHE_PREFIX + asin);
  } catch (err) {
    telemetry.log('PAAPI', `Failed clearing cache for ${asin}`);
  }
}

const makeFallback = (asin, tag) => ({
  title:         null,
  price:         null,
  available:     true,
  image:         null,
  affiliate_url: `https://www.amazon.es/dp/${asin}/?tag=${tag || AMAZON_CONFIG.PARTNER_TAG}`
});

const generateMockData = (asin, tag) => ({
  title:         null, // Al ser null, la UI usara el product_name de gifts.json
  price:         null, // Al ser null, la UI usara el rango de precio de gifts.json
  available:     true,
  image:         null,
  affiliate_url: `https://www.amazon.es/dp/${asin}/?tag=${tag || AMAZON_CONFIG.PARTNER_TAG}`,
  isMock:        true
});

export async function fetchProductData(asin, tag, marketplace) {
  if (!asin || asin === 'ASIN_PLACEHOLDER') {
    return makeFallback(asin || 'unknown', tag);
  }

  if (AMAZON_CONFIG.DEBUG_MODE === true) {
    telemetry.log('PAAPI', `Using mock data for ${asin}`);
    return generateMockData(asin, tag);
  }

  const cached = getCached(asin);
  if (cached) {
    // Ignore stale demo/mock entries once the live API mode is active.
    if (cached.isMock && AMAZON_CONFIG.DEBUG_MODE !== true) {
      clearCached(asin);
    } else {
    return cached;
    }
  }

  recordCacheMiss(asin);
  const startTime = performance.now();
  const proxyUrl = AMAZON_CONFIG.API_ENDPOINT || '/api/products';
  
  telemetry.log('PAAPI', `Fetching ${asin} from proxy`);

  try {
    const res = await fetch(proxyUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        asin,
        tag: tag || AMAZON_CONFIG.PARTNER_TAG
      })
    });

    const duration = performance.now() - startTime;
    telemetry.trackTiming('PAAPI_Fetch', duration, { asin });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      telemetry.error('PAAPI', `HTTP ${res.status} for ${asin}`, errBody);
      return makeFallback(asin, tag);
    }

    const data = await res.json();
    telemetry.log('PAAPI', `Success fetching ${asin}`);
    
    setCache(asin, data);
    return data;

  } catch (err) {
    telemetry.error('PAAPI', `Network error for ${asin}`, { message: err.message });
    return makeFallback(asin, tag);
  }
}

export async function fetchAllProducts(gifts) {
  const results = await Promise.allSettled(
    gifts.map(g => fetchProductData(g.asin, g.tag, g.marketplace))
  );
  return results.map((r, i) => ({
    asin: gifts[i].asin,
    data: r.status === 'fulfilled' ? r.value : makeFallback(gifts[i].asin, gifts[i].tag)
  }));
}