import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';
import { idToProfileMap } from '@/lib/profiles';

function GiftCard({ gift, productData, loading }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getProfileIdFromGiftId = (giftId) => {
      const baseId = Object.keys(idToProfileMap).find(prefix => giftId.startsWith(prefix));
      return baseId ? idToProfileMap[baseId] : null;
  };

  const isUnavailable = !loading && productData && !productData.available && !productData.hasApiError && !productData.isMock;
  const hasError = !loading && productData?.hasApiError;
  const isMock = !loading && productData?.isMock;
  const isLive = !loading && productData && !productData.isMock && !productData.hasApiError;

  const displayTitle = (gift.product_name || productData?.title || '').replace(/ \(ASIN: .*\)/g, '');

  const getPriceLabel = (range) => {
    const labels = {
      'under15': 'Hasta 15€',
      '15-35': '15€–35€',
      '35-70': '35€–70€',
      '70-150': '70€–150€'
    };
    return labels[range] || range;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-card rounded-2xl shadow-soft hover:shadow-xl transition-shadow duration-500 p-3 sm:p-4 flex flex-col relative overflow-hidden h-full border border-border group/card"
    >
      {/* 1. Emoji | Perfil | Rango de precio */}
      <div className="flex flex-col items-center justify-center mb-3 mt-1">
        <div className="w-12 h-12 flex items-center justify-center bg-muted/5 rounded-full mb-2 group-hover/card:scale-110 transition-transform duration-500">
          <span
            className="text-[40px] leading-none filter drop-shadow-sm"
            role="img"
            aria-label={gift.recipient}
            style={gift.emoji === '👴👵' ? { fontFamily: 'Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Android Emoji,EmojiSymbols', letterSpacing: '-0.4em' } : {}}
          >
            {gift.recipient.includes('NUEVOS PAPÁS') ? '👨‍🍼' : gift.emoji}
          </span>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-foreground font-black text-center opacity-80">
          {gift.recipient}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-[11px] text-primary font-black uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
            {getPriceLabel(gift.price_range)}
          </p>
          {isLive && (
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Precio en vivo de Amazon"></span>
          )}
        </div>
      </div>

      {/* 2. Imagen */}
      <div className="relative bg-muted/5 rounded-2xl mb-4 flex items-center justify-center min-h-[200px] overflow-hidden group shadow-inner border border-border/50">
        {loading ? (
          <div className="w-full h-[180px] flex flex-col items-center justify-center rounded-lg p-4 bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-[10px] text-primary font-bold tracking-widest uppercase animate-pulse">
              {t('card.verifying')}
            </p>
          </div>
        ) : hasError ? (
          <div className="w-full h-[180px] bg-destructive/5 flex flex-col items-center justify-center rounded-lg p-4 text-center">
            <AlertCircle className="text-destructive/50 mb-2" size={32} />
            <p className="text-destructive text-xs font-bold uppercase tracking-tight">{t('card.error')}</p>
          </div>
        ) : (productData?.image || gift.image) ? (
          <>
            <img
              src={getImageUrl(gift.image || productData?.image)}
              alt={displayTitle}
              className={`max-h-[180px] max-w-[90%] object-contain transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                setImageLoaded(true);
                if (!e.target.src.includes('placeholder')) {
                    e.target.src = '/images/placeholder.jpg';
                }
              }}
            />
            {isUnavailable && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                <p className="bg-card text-foreground px-4 py-2 rounded-lg font-black text-[12px] shadow-lg uppercase tracking-wider border border-border">
                  {t('card.unavailable')}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-[180px] bg-muted/10 flex items-center justify-center rounded-lg text-muted-foreground font-medium text-xs">
            {t('card.no_image')}
          </div>
        )}
      </div>

      {/* 3. Nombre del producto */}
      <div className="flex-grow flex flex-col justify-end">
        <h3 className="title text-foreground line-clamp-2 text-center group-hover/card:text-primary transition-colors duration-300 max-h-[2.7em] overflow-hidden">
          {displayTitle}
        </h3>
      </div>

      {/* 4. Botón: Ver características */}
      <div className="flex flex-col gap-1 mt-auto">
        <button
          onClick={() => {
            const profileId = getProfileIdFromGiftId(gift.id);
            sessionStorage.setItem('homeScrollY', String(window.scrollY || window.pageYOffset || 0));
            sessionStorage.setItem('homeShouldRestoreScroll', '1');
            navigate(`/perfil/${profileId}?id=${gift.id}`);
          }}
          aria-label={`Ver características de ${displayTitle}`}
          className="gift-button font-black text-white hover:opacity-90 transition-all duration-300 shadow-md shadow-emerald-900/20 transform active:scale-[0.98] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ backgroundColor: '#1B4332', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ textAlign: 'center', width: '100%' }}>{t('card.view_details')}</span>
        </button>
      </div>
    </motion.div>
  );
}

export default GiftCard;
