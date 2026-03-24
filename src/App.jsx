
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ScrollToTop from './components/ScrollToTop';
import { AMAZON_CONFIG } from '@/config';
import { useSeo } from './hooks/use-seo';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const PromotionPage = lazy(() => import('./pages/PromotionPage'));

const isUS = AMAZON_CONFIG.LANGUAGE === 'en';

function SeoManager() {
  const { canonicalUrl, alternateLinks, currentLang, ogLocale } = useSeo();
  
  return (
    <Helmet>
      <html lang={currentLang} />
      <link rel="canonical" href={canonicalUrl} />
      {alternateLinks.map(link => (
        <link key={link.hrefLang} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
      ))}
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="Noworries.gift" />
    </Helmet>
  );
}

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <Router basename={basename}>
      <SeoManager />
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfil/:profileId" element={<ProfilePage />} />
          <Route path="/producto/:asin" element={<ProductDetailPage />} />
          <Route path="/regalos_sin_estres" element={<PromotionPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}


export default App;
