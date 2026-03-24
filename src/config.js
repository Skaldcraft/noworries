// src/config.js
// Configuracion de la API de Publicidad de Productos de Amazon (PAAPI)

// Detección de dominio / subdominio para internacionalización
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Lógica de subdominio: es.* para español, en.* para inglés. 
// Si no hay subdominio, detectamos por TLD o parámetro.
const isES = hostname.startsWith('es.') || hostname.includes('.es');
const isEN = hostname.startsWith('en.') || hostname.includes('.com') || hostname === 'localhost' && !hostname.startsWith('es.'); 

const isUSMarket = isEN && !isES;

// Para desarrollo local o si no detecta subdominio, podemos forzarlo por parámetro ?lang=en o ?lang=es
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const forceUS = urlParams.get('lang') === 'en';
const forceES = urlParams.get('lang') === 'es';

const finalLang = (forceES || isES) ? 'es' : (forceUS || isEN ? 'en' : 'es');

export const AMAZON_CONFIG = {
  // Tags según el mercado
  PARTNER_TAG: (finalLang === 'en') ? 'noworriesgift-20' : 'skaldcraft-21',
  MARKETPLACE: (finalLang === 'en') ? 'www.amazon.com' : 'www.amazon.es',
  REGION:      (finalLang === 'en') ? 'us-east-1' : 'eu-west-1',

  // Configuracion de la aplicacion
  DEBUG_MODE: false, // ACTIVADO: Se conecta al proxy para obtener datos reales de Amazon
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