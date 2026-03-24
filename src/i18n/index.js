import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esES from './locales/es-ES.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      // Keep both locale keys mapped to Spanish to enforce full Spanish UI.
      en: { translation: esES },
      es: { translation: esES },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    initImmediate: false,        // init síncrono con recursos bundleados
    react: { useSuspense: false }, // sin Suspense — evita crash si no hay <Suspense> en el árbol
  });

export default i18n;
