
export const cacheStats = {
  hits: 0,
  misses: 0
};

export function getCacheContents() {
  const contents = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('paapi_')) {
        try {
          const raw = sessionStorage.getItem(key);
          if (!raw) continue;
          
          const data = JSON.parse(raw);
          // paapi.js stores the product data directly, not wrapped in { product: ... }
          // We also check if it's an object to avoid errors with primitive values
          if (data && typeof data === 'object') {
            contents.push({
              key,
              asin: key.replace('paapi_', ''),
              timestamp: data.timestamp || new Date().toISOString(), // Fallback if no timestamp
              data: data // The data is the product itself
            });
          }
        } catch (e) {
          console.error(`[CacheDebug] Error parsing cache key ${key}:`, e);
        }
      }
    }
  } catch (e) {
    console.error('[CacheDebug] Error accessing sessionStorage:', e);
  }
  return contents;
}

export function getCacheStats() {
  const contents = getCacheContents();
  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    totalItems: contents.length
  };
}

export function clearCache() {
  const keysToRemove = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('paapi_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    cacheStats.hits = 0;
    cacheStats.misses = 0;
    console.log(`[Cache] Cleared ${keysToRemove.length} items.`);
  } catch (err) {
    console.error('[Cache] Failed while clearing cache:', err);
  }
}

export function getCacheSize() {
  let size = 0;
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('paapi_')) {
        const item = sessionStorage.getItem(key);
        if (item) {
          size += key.length + item.length;
        }
      }
    }
  } catch (err) {
    console.warn('[CacheSize] Failed while getting cache size:', err);
  }
  return size; // rough byte size of UTF-16 strings (should multiply by 2 for actual bytes, but this is an approximation)
}

export function recordCacheHit(asin) {
  cacheStats.hits++;
  console.log(`[Cache Hit] ${asin} at ${new Date().toISOString()}`);
}

export function recordCacheMiss(asin) {
  cacheStats.misses++;
  console.log(`[Cache Miss] ${asin} at ${new Date().toISOString()}`);
}
