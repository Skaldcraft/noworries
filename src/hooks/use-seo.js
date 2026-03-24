import { useLocation } from 'react-router-dom';
import { DEPLOYMENT_CONFIG } from '../../app-config';
import { AMAZON_CONFIG } from '../config';

/**
 * Hook to manage SEO metadata including canonical and hreflang tags.
 */
export function useSeo() {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentLang = AMAZON_CONFIG.LANGUAGE;

  const getFullUrl = (lang, path = currentPath) => {
    const domain = DEPLOYMENT_CONFIG.ALTERNATE_DOMAINS[lang] || DEPLOYMENT_CONFIG.CANONICAL_DOMAIN;
    // Remove duplication if path already contains base_path and we are on a subdomain
    // For now, we assume domains point to the root of the app.
    return `${domain}${path}`;
  };

  const canonicalUrl = getFullUrl(currentLang);

  const alternateLinks = Object.keys(DEPLOYMENT_CONFIG.ALTERNATE_DOMAINS).map(lang => ({
    rel: 'alternate',
    hrefLang: lang === 'en' ? 'en-US' : 'es-ES',
    href: getFullUrl(lang)
  }));

  // Add x-default (usually the main language or a specific domain)
  alternateLinks.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: getFullUrl('es')
  });

  return {
    canonicalUrl,
    alternateLinks,
    currentLang: currentLang === 'en' ? 'en-US' : 'es-ES',
    ogLocale: currentLang === 'en' ? 'en_US' : 'es_ES'
  };
}
