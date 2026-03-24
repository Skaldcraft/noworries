// src/api/products.js
// Cliente frontend: llama al proxy backend (server/api-proxy.js) para obtener datos reales
// de Amazon PA API 5.0 sin problemas CORS.

import { AMAZON_CONFIG } from '@/config';

const CACHE_PREFIX = 'paapi_';

function getCached(asin) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + asin);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCache(asin, data) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + asin, JSON.stringify(data));
  } catch { /* sessionStorage llena */ }
}

const fallback = (asin, tag) => ({
  title:         null,
  price:         null,
  available:     false,
  image:         null,
  affiliate_url: `https://www.amazon.es/dp/${asin}/?tag=${tag || AMAZON_CONFIG.PARTNER_TAG}`
});

export async function fetchProductData(asin, tag) {
  if (!asin || asin === 'ASIN_PLACEHOLDER') return fallback(asin, tag);

  // SI DEBUG_MODE está activo, devolvemos fallback (datos estáticos) inmediatamente
  if (AMAZON_CONFIG.DEBUG_MODE) {
    if (AMAZON_CONFIG.DEBUG_VERBOSE) {
      console.log(`[products] Debug mode: usando fallback para ${asin}`);
    }
    return fallback(asin, tag);
  }

  const cached = getCached(asin);
  if (cached) return cached;

  const proxyUrl = AMAZON_CONFIG.API_ENDPOINT || '/api/products';

  try {
    const res = await fetch(proxyUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ asin, tag: tag || AMAZON_CONFIG.PARTNER_TAG })
    });

    if (!res.ok) {
      console.error(`[products] HTTP ${res.status} para ${asin}`);
      return fallback(asin, tag);
    }

    const data = await res.json();
    setCache(asin, data);
    return data;

  } catch (err) {
    console.error(`[products] Error de red para ${asin}:`, err.message);
    return fallback(asin, tag);
  }
}

export async function fetchAllProducts(gifts) {
  const results = await Promise.allSettled(
    gifts.map(g => fetchProductData(g.asin, g.tag))
  );
  return results.map((r, i) => ({
    asin: gifts[i].asin,
    data: r.status === 'fulfilled' ? r.value : fallback(gifts[i].asin, gifts[i].tag)
  }));
}