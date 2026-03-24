import React, { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ShoppingCart, Share2, Check, Tag, ExternalLink } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMarketGifts } from '@/data/market-gifts';
import styleGuide from '@/config/style-guide.json';
import { getImageUrl } from '../utils/getImageUrl';
import { useTranslation } from 'react-i18next';
import { AMAZON_CONFIG } from '@/config';

const AmazonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.012 19.405c-1.114.721-2.674 1.144-4.321 1.144-2.887 0-5.385-.944-7.076-2.404-.325-.281-.132-.733.266-.643 2.126.471 4.417.721 6.772.721 2.217 0 4.398-.225 6.37-.655.45-.1.68.423.23.702.408-.073.344.028.188.135zm7.394-1.258c-.521.682-1.442 1.391-2.164 1.391-.722 0-1.402-.244-1.964-.606-.088-.057-.101-.179-.028-.276 1.096-1.447 2.564-2.28 4.167-2.207.088.004.156.082.152.171-.035.789-.163 1.527-.163 1.527zm-1.122-4.031c-1.84.053-3.513.911-4.57 2.378-.051.071-.144.088-.22.053-.51-.233-.974-.537-1.373-.895-.067-.06-.073-.158-.016-.225.86-1.02 2.113-1.761 3.513-2.072 1.4-.311 2.871-.24 4.126.24.1.037.147.161.09.25-.42.66-.889 1.257-1.55 2.271z" />
    </svg>
);

// Mapeo corregido para coincidir con los nuevos IDs de gifts.json
const profileToGiftId = {
    'pareja': 'for-couple', 'mama': 'for-mom', 'papa': 'for-dad',
    'bebes': 'for-babies', 'ninos': 'for-kids', 'adolescentes': 'for-teens',
    'abuelos': 'for-grandparents', 'mejor_amigo': 'for-best-friend',
    'companeros': 'for-coworker', 'cumpleanios': 'for-birthday',
    'cuidarse': 'for-selfcare', 'deportistas': 'for-fitness',
    'viajeros': 'for-traveler', 'mascotas': 'for-petowner',
    'gente_tecnologica': 'for-techies', 'manitas': 'for-diy',
    'nuevos_papis': 'for-newparents', 'nuevo_hogar': 'new-home',
    'nuevo_trabajo': 'new-job', 'cocinillas': 'for-cooks',
    'creativos': 'for-creative-persons', 'lectores': 'for-readers',
    'ecologistas': 'for-eco-friendly', 'gente_casera': 'for-homebodies',
    'amigo_invisible': 'for-invisible-friend', 'despedida': 'farewell',
    'detalle': 'small-gift', 'solo_porque_si': 'just-because',
    'quien_lo_tiene_todo': 'for-someone-who-has-everything'
};

const getPriceLabel = (range) => {
    const isUS = AMAZON_CONFIG.MARKET === 'us';
    const labels = {
        'under15': isUS ? 'Up to $15' : 'Hasta 15€',
        '15-35': isUS ? '$15-$35' : '15€-35€',
        '35-70': isUS ? '$35-$70' : '35€-70€',
        '70-150': isUS ? '$70-$150' : '70€-150€'
    };
    return labels[range] || range;
};

// Mapeo entre prefijo de ID y Perfil dinámico (Mismo orden y claves)
const idToProfileMap = {
    'for-couple': 'pareja', 'for-mom': 'mama', 'for-dad': 'papa',
    'for-babies': 'bebes', 'for-kids': 'ninos', 'for-teens': 'adolescentes',
    'for-grandparents': 'abuelos', 'for-best-friend': 'mejor_amigo',
    'for-coworker': 'companeros', 'for-birthday': 'cumpleanios',
    'for-selfcare': 'cuidarse', 'for-fitness': 'deportistas',
    'for-traveler': 'viajeros', 'for-petowner': 'mascotas',
    'for-techies': 'gente_tecnologica', 'for-diy': 'manitas',
    'for-newparents': 'nuevos_papis', 'new-home': 'nuevo_hogar',
    'new-job': 'nuevo_trabajo', 'for-cooks': 'cocinillas',
    'for-creative-persons': 'creativos', 'for-readers': 'lectores',
    'for-eco-friendly': 'ecologistas', 'for-homebodies': 'gente_casera',
    'for-invisible-friend': 'amigo_invisible', 'farewell': 'despedida',
    'small-gift': 'detalle', 'just-because': 'solo_porque_si',
    'for-someone-who-has-everything': 'quien_lo_tiene_todo'
};

const getProfileIdFromGiftId = (giftId) => {
    const baseId = Object.keys(idToProfileMap).find(prefix => giftId.startsWith(prefix));
    return baseId ? idToProfileMap[baseId] : null;
};

function ProfilePage() {
    const { profileId } = useParams();
    const [searchParams] = useSearchParams();
    const selectedId = searchParams.get('id');
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    const giftsData = useMemo(() => getMarketGifts(), []);



    const profileInfo = styleGuide.profiles[profileId];
    const prefix = profileToGiftId[profileId];

    // 1. Obtenemos todos los que coinciden con el prefijo del perfil
    const allMatchingGifts = useMemo(() => {
        return giftsData.filter(g => prefix && g.id.startsWith(prefix));
    }, [prefix]);

    // 2. Recomendación actual: la de la URL o la ÚLTIMA del JSON (la más reciente)
    const currentGift = useMemo(() => {
        if (!allMatchingGifts.length) return null;
        if (selectedId) {
            return allMatchingGifts.find(g => g.id === selectedId) || allMatchingGifts[allMatchingGifts.length - 1];
        }
        return allMatchingGifts[allMatchingGifts.length - 1];
    }, [allMatchingGifts, selectedId]);

    // 3. Debajo de la recomendacion actual, mostramos todos los demas regalos del mismo perfil
    const historyProducts = useMemo(() => {
        const others = allMatchingGifts.filter(g => g.id !== currentGift?.id);

        return others.map(g => ({
            id: g.id,
            title: g.product_name,
            ai_description: g.justification,
            price: getPriceLabel(g.price_range),
            affiliate_url: g.affiliate_url_format,
            image: g.image,
            tier: g.price_range === '70-150' ? 'alto' : (g.price_range === 'under15' ? 'bajo' : 'medio')
        })).reverse();
    }, [allMatchingGifts, currentGift]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            window.prompt('Copia este enlace:', window.location.href);
        }
    };

    if (!profileInfo) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-6 text-center">
                    <div className="animate-in fade-in slide-in-from-bottom duration-700">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            {profileId ? 'Perfil no configurado o en construcción' : 'Perfil no encontrado'}
                        </h2>
                        <Link to="/" className="text-primary hover:underline flex items-center justify-center gap-2 font-bold transition-all">
                            <ArrowLeft size={18} /> Volver al Inicio
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{profileInfo.title} | OneClickFix</title>
                <meta property="og:title" content={`${profileInfo.title} | Ideas de Regalo`} />
                <meta property="og:description" content={profileInfo.public_description} />
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <Header />

                {/* Hero del perfil */}
                <div className="bg-card border-b border-border py-10 sm:py-16">
                    <div className="max-w-[860px] mx-auto px-6 animate-in fade-in slide-in-from-bottom duration-700">
                        <Link to="/" className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground mb-10 transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver a la selección
                        </Link>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-muted/5 rounded-full shrink-0 shadow-inner border border-border/50">
                                <span className="text-[64px] sm:text-[80px] leading-none shrink-0 filter drop-shadow-md">{currentGift?.emoji || '🎁'}</span>
                            </div>
                            <div>
                                <h1 className="text-[36px] sm:text-[48px] font-black text-foreground leading-tight mb-4 uppercase tracking-tight">{profileInfo.title}</h1>
                                <div className="h-2 w-20 bg-primary mb-6 rounded-full mx-auto sm:mx-0" />
                                <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed max-w-[600px] font-medium">{profileInfo.public_description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-grow py-16 px-6">
                    <div className="max-w-[860px] mx-auto space-y-20">

                        {/* RECOMENDACIÓN PRINCIPAL */}
                        {currentGift && (
                            <motion.section 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="stagger-1"
                            >
                                <p className="text-[12px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-8 flex items-center justify-center sm:justify-start gap-2">
                                    <Tag size={12} /> Recomendación actual
                                </p>
                                <motion.div 
                                    layout
                                    whileHover={{ y: -4 }}
                                    className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden p-8 md:p-12 transition-all hover:shadow-xl group/card relative"
                                >
                                    {currentGift.image && (
                                        <div className="mb-10 flex justify-center bg-muted/5 rounded-2xl p-6 border border-border/50 shadow-inner group-hover/card:bg-muted/10 transition-colors duration-500 overflow-hidden">
                                            <motion.img
                                                layoutId={`gift-image-${currentGift.id}`}
                                                src={getImageUrl(currentGift.image)}
                                                alt={currentGift.product_name}
                                                className="max-h-[300px] w-full object-contain"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                                onError={(e) => {
                                                    if (!e.target.src.includes('placeholder')) {
                                                        e.target.src = '/images/placeholder.jpg';
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    <h2 className="text-[28px] sm:text-[34px] font-black text-foreground mb-3 leading-tight text-center sm:text-left">{currentGift.product_name}</h2>
                                    <p className="text-[14px] font-bold text-primary uppercase tracking-[0.15em] mb-10 text-center sm:text-left bg-primary/10 inline-block px-4 py-1 rounded-full">Presupuesto: {getPriceLabel(currentGift.price_range)}</p>
                                    <blockquote className="border-l-4 border-primary pl-6 mb-10 py-2 bg-primary/5 rounded-r-xl">
                                        <p className="text-[18px] sm:text-[20px] italic text-foreground font-medium leading-relaxed">"{currentGift.justification}"</p>
                                    </blockquote>
                                    <div className="bg-muted/5 rounded-2xl p-6 sm:p-8 mb-12 border border-border/50">
                                        <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Por qué funciona</p>
                                        <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed font-medium">{currentGift.why_it_works}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <motion.a 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={currentGift.affiliate_url_format} target="_blank" rel="noopener noreferrer sponsored" className="flex-[2] flex items-center justify-center gap-3 bg-[#FF9900] hover:bg-[#FF8C00] text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-orange-500/10"
                                        >
                                            <AmazonIcon /> {t ? t('card.go_to_amazon', 'Ver en Amazon') : 'Ver en Amazon'} <ExternalLink size={16} />
                                        </motion.a>
                                        <motion.button 
                                            whileHover={{ scale: 1.02, backgroundColor: "var(--background)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleShare} className={`flex-1 flex items-center justify-center gap-3 font-bold py-5 rounded-2xl border-2 transition-all ${copied ? 'bg-green-50 border-green-300 text-green-700' : 'bg-card text-muted-foreground border-border hover:border-muted'}`}
                                        >
                                            {copied ? <><Check size={20} /> ¡Copiado!</> : <><Share2 size={20} /> Compartir</>}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.section>
                        )}


                        {/* TODOS LOS REGALOS DEL PERFIL (EXCEPTO EL ACTUAL) */}
                        {historyProducts.length > 0 && (
                            <section>
                                <h2 className="text-[13px] font-black text-muted-foreground uppercase tracking-[0.25em] flex items-center gap-2 mb-8 opacity-70">
                                    <Clock size={16} /> Más regalos para este perfil
                                </h2 >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {historyProducts.map((item, index) => (
                                        <div key={item.id} className={`bg-card rounded-2xl border border-border overflow-hidden flex flex-col p-6 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom stagger-${(index % 5) + 1}`}>
                                            {item.image && (
                                                <div className="h-[180px] mb-6 flex items-center justify-center bg-muted/5 rounded-xl border border-border/50">
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.title}
                                                        className="max-h-[140px] w-full object-contain transition-transform duration-700 hover:scale-110"
                                                        onError={(e) => {
                                                            if (!e.target.src.includes('placeholder')) {
                                                                e.target.src = '/images/placeholder.jpg';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${item.tier === 'alto' ? 'bg-purple-100 text-purple-700' : item.tier === 'medio' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-800'}`}>Rango {item.tier}</span>
                                            </div>
                                            <h3 className="text-[18px] font-black text-foreground mb-3 line-clamp-2 leading-tight">{item.title}</h3>
                                            <p className="text-[14px] text-muted-foreground italic mb-6 line-clamp-3 font-medium opacity-80 leading-relaxed">"{item.ai_description}"</p>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                                                <span className="text-[16px] font-black text-primary uppercase tracking-tight">{item.price}</span>
                                                <Link
                                                    to={`/perfil/${profileId}?id=${item.id}`}
                                                    onClick={() => window.scrollTo(0, 0)}
                                                    className="text-[14px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                                                >
                                                    Ver más <ExternalLink size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}


                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default ProfilePage;

