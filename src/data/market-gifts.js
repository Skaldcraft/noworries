import baseGifts from '@/data/gifts.json';
import usOverrides from '@/data/gifts-us.json';
import { AMAZON_CONFIG } from '@/config';

function normalizeGiftForMarket(gift) {
  const isUSMarket = AMAZON_CONFIG.MARKET === 'us';
  const marketplace = isUSMarket
    ? (gift.marketplace?.includes('amazon.com') ? gift.marketplace : AMAZON_CONFIG.MARKETPLACE)
    : (gift.marketplace || AMAZON_CONFIG.MARKETPLACE);

  const tag = isUSMarket
    ? (gift.tag && gift.tag.endsWith('-20') ? gift.tag : AMAZON_CONFIG.PARTNER_TAG)
    : (gift.tag || AMAZON_CONFIG.PARTNER_TAG);

  return {
    ...gift,
    tag,
    marketplace,
    affiliate_url_format: `https://${marketplace}/dp/${gift.asin}/?tag=${tag}`,
  };
}

function mergeOverrides(baseList, overrides) {
  if (!Array.isArray(overrides) || overrides.length === 0) {
    return baseList;
  }

  const mergedById = new Map(baseList.map((gift) => [gift.id, gift]));
  overrides.forEach((gift) => {
    if (gift?.id) {
      mergedById.set(gift.id, gift);
    }
  });

  return Array.from(mergedById.values());
}

export function getMarketGifts() {
  const normalizedBase = baseGifts.map(normalizeGiftForMarket);

  // EN-US can override specific cards via src/data/gifts-us.json without duplicating all data.
  if (AMAZON_CONFIG.MARKET === 'us') {
    return mergeOverrides(normalizedBase, usOverrides).map(normalizeGiftForMarket);
  }

  return normalizedBase;
}
