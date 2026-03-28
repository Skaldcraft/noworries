import { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const PromotionPage = lazy(() => import('./pages/PromotionPage'));
const ComoFuncionaPage = lazy(() => import('./pages/ComoFuncionaPage'));
const AvisoLegalPage = lazy(() => import('./pages/AvisoLegalPage'));
const PoliticaPrivacidadPage = lazy(() => import('./pages/PoliticaPrivacidadPage'));
const PoliticaCookiesPage = lazy(() => import('./pages/PoliticaCookiesPage'));

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <Router basename={basename}>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfil/:profileId" element={<ProfilePage />} />
          <Route path="/producto/:asin" element={<ProductDetailPage />} />
          <Route path="/regalos-sin-estrés" element={<PromotionPage />} />
          <Route path="/regalos_sin_estres" element={<PromotionPage />} />
          <Route path="/aviso-legal" element={<AvisoLegalPage />} />
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidadPage />} />
          <Route path="/politica-cookies" element={<PoliticaCookiesPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}


export default App;
