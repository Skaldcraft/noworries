import baseGifts from '@/data/gifts.json';
import { AMAZON_CONFIG } from '@/config';

export function getMarketGifts() {
  return baseGifts.map(gift => {
    const tag = gift.tag || AMAZON_CONFIG.PARTNER_TAG;
    const marketplace = gift.marketplace || AMAZON_CONFIG.MARKETPLACE;
    return {
      ...gift,
      tag,
      marketplace,
      affiliate_url_format: `https://${marketplace}/dp/${gift.asin}/?tag=${tag}`,
    };
  });
}
