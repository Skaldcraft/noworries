import { lazy } from 'react';
import { Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const PromotionPage = lazy(() => import('./pages/PromotionPage'));

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
