// src/config.js
// Configuracion de la API de Publicidad de Productos de Amazon (PAAPI)

// Detección de dominio / subdominio para internacionalización
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Lógica de subdominio: es.* para español, en.* para inglés. 
// Si no hay subdominio, detectamos por TLD o parámetro.
const isES = hostname.startsWith('es.') || hostname.includes('.es');
const isEN = hostname.startsWith('en.') || hostname.includes('.com') || hostname === 'localhost' && !hostname.startsWith('es.'); 

// Para desarrollo local o si no detecta subdominio, podemos forzarlo por parámetro ?lang=en o ?lang=es
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const forceUS = urlParams.get('lang') === 'en';
const forceES = urlParams.get('lang') === 'es';
const manualProductMode = import.meta.env.VITE_MANUAL_PRODUCT_MODE !== 'false';

const finalLang = (forceES || isES) ? 'es' : (forceUS || isEN ? 'en' : 'es');
const marketCode = finalLang === 'en' ? 'us' : 'es';

const MARKET_CONFIG = {
  es: {
    partnerTag: 'skaldcraft-21',
    marketplace: 'www.amazon.es',
    region: 'eu-west-1',
    currency: 'EUR',
  },
  us: {
    partnerTag: 'noworriesgift-20',
    marketplace: 'www.amazon.com',
    region: 'us-east-1',
    currency: 'USD',
  },
};

const market = MARKET_CONFIG[marketCode];

export const AMAZON_CONFIG = {
  // Tags según el mercado
  PARTNER_TAG: market.partnerTag,
  MARKETPLACE: market.marketplace,
  REGION: market.region,
  CURRENCY: market.currency,
  MARKET: marketCode,

  // Configuracion de la aplicacion
  MANUAL_PRODUCT_MODE: manualProductMode,
  DEBUG_MODE: false,
  DEBUG_VERBOSE: false,
  API_ENDPOINT: import.meta.env.VITE_API_URL || '/api/products',
  
  // Idioma actual detectado
  LANGUAGE: finalLang,
};

export const isConfigured = () => {
  return AMAZON_CONFIG.PARTNER_TAG !== 'skaldcraft-21' && AMAZON_CONFIG.PARTNER_TAG !== 'noworriesgift-20';
};

export const validateCredentials = () => {
  return true; // Las credenciales reales (API keys) ahora se gestionan de forma segura en el proxy backend
};