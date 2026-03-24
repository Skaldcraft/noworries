// app-config.js
/**
 * Unified deployment configuration for OneClickFix.
 * This file is the single source of truth for the base path and other deployment-specific settings.
 * It is used by Vite, the React App, and the Node.js static servers.
 */

export const DEPLOYMENT_CONFIG = {
  BASE_PATH: '/',
  
  // Production domains for SEO (Canonical and Alternates)
  CANONICAL_DOMAIN: 'https://es.noworries.gift',
  ALTERNATE_DOMAINS: {
    es: 'https://es.noworries.gift',
    en: 'https://en.noworries.gift'
  },
};
