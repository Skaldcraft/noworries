import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import { AMAZON_CONFIG } from '@/config';

// La detección de mercado ya está centralizada en config.js (subdominio / parámetro ?lang=).
// Usamos AMAZON_CONFIG.LANGUAGE como fuente única de verdad para evitar doble lógica.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enUS },
      es: { translation: esES },
    },
    lng: AMAZON_CONFIG.LANGUAGE,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    initImmediate: false,        // init síncrono con recursos bundleados
    react: { useSuspense: false }, // sin Suspense — evita crash si no hay <Suspense> en el árbol
  });

export default i18n;
