import { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2, Check, Tag, ExternalLink } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMarketGifts } from '@/data/market-gifts';
import styleGuide from '@/config/style-guide.json';
import { getImageUrl } from '../utils/getImageUrl';
import { useTranslation } from 'react-i18next';
import { idToProfileMap, getProfileIdFromGiftId } from '@/lib/profiles';

const AmazonIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g>
            <text x="8" y="28" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="28" fill="#F9F6F2">a</text>
            <path d="M13 30c4 3 10 3 14 0" stroke="#F9F6F2" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M23 30c.5.7 1.5 1.4 3 1.4s2.5-.7 3-1.4" stroke="#F9F6F2" strokeWidth="1.2" strokeLinecap="round"/>
        </g>
    </svg>
);

// Mapeo de perfil → prefijo de ID de regalo (usado para filtrar gifts.json)
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
    'quien_lo_tiene_todo': 'for-someone-who-has-everything',
    'basicos_utiles': 'basicos-utiles'
};

const getPriceLabel = (range) => {
    const labels = {
        'under15': 'Hasta 15€',
        '15-35': '15€-35€',
        '35-70': '35€-70€',
        '70-150': '70€-150€'
    };
    return labels[range] || range;
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
                <div className="bg-card border-b border-border py-5 sm:py-6">
                    <div className="max-w-[860px] mx-auto px-6 animate-in fade-in slide-in-from-bottom duration-700">
                        <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a la selección
                        </Link>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-muted/5 rounded-full shrink-0 shadow-inner border border-border/50">
                                <span className="text-[40px] sm:text-[48px] leading-none shrink-0 filter drop-shadow-md">{currentGift?.emoji || '🎁'}</span>
                            </div>
                            <div>
                                <h1 className="text-[22px] sm:text-[28px] font-black text-foreground leading-tight mb-1 uppercase tracking-tight">{profileInfo.title}</h1>
                                <div className="h-1.5 w-16 bg-primary mb-3 rounded-full mx-auto sm:mx-0" />
                                <p className="text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed max-w-[600px] font-medium">{profileInfo.public_description}</p>
                                {profileInfo.support_text && (
                                    <p className="text-[13px] sm:text-[14px] text-muted-foreground/75 leading-relaxed max-w-[600px] font-normal mt-2">{profileInfo.support_text}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-grow py-10 sm:py-12 px-4 sm:px-6">
                    <div className="max-w-[860px] mx-auto space-y-12 sm:space-y-14">

                        {/* RECOMENDACIÓN PRINCIPAL */}
                        {currentGift && (
                            <motion.section 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="stagger-1"
                            >
                                <p className="text-[11px] font-black text-muted-foreground/70 uppercase tracking-[0.26em] mb-4 flex items-center justify-center sm:justify-start gap-2">
                                    <Tag size={12} /> Recomendación actual
                                </p>
                                <motion.div 
                                    layout
                                    whileHover={{ y: -4 }}
                                    className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden p-5 sm:p-6 md:p-7 transition-all hover:shadow-xl group/card relative"
                                >
                                    {currentGift.image && (
                                        <div className="mb-6 flex justify-center bg-muted/5 rounded-xl p-4 border border-border/50 shadow-inner group-hover/card:bg-muted/10 transition-colors duration-500 overflow-hidden">
                                            <motion.img
                                                layoutId={`gift-image-${currentGift.id}`}
                                                src={getImageUrl(currentGift.image)}
                                                alt={currentGift.product_name}
                                                className="max-h-[220px] sm:max-h-[240px] w-full object-contain"
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
                                    <h2 className="text-[22px] sm:text-[28px] font-black text-foreground mb-2 leading-tight text-center sm:text-left">{currentGift.product_name}</h2>
                                    <p className="text-[12px] font-bold text-primary uppercase tracking-[0.14em] mb-5 text-center sm:text-left bg-primary/10 inline-block px-3 py-1 rounded-full">Presupuesto: {getPriceLabel(currentGift.price_range)}</p>
                                    <blockquote className="border-l-4 border-primary pl-4 mb-6 py-2 bg-primary/5 rounded-r-xl">
                                        <p className="text-[15px] sm:text-[17px] italic text-foreground font-medium leading-relaxed">&ldquo;{currentGift.justification}&rdquo;</p>
                                    </blockquote>
                                    <div className="bg-muted/5 rounded-xl p-4 sm:p-5 mb-6 border border-border/50">
                                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Por qué funciona</p>
                                        <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed font-medium">{currentGift.why_it_works}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <motion.a 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={currentGift.affiliate_url_format} target="_blank" rel="noopener noreferrer sponsored"
                                            className="flex-1 flex items-center justify-center gap-3 bg-[#FF9900] hover:bg-[#FF8C00] text-white py-2.5 px-5 rounded-full transition-all shadow-md shadow-orange-500/10 text-[1.08rem]"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <AmazonIcon />
                                            <span style={{fontSize: '1.13em', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: 'Montserrat, Arial, sans-serif', textDecoration: 'none', textTransform: 'none', display: 'inline-block', marginLeft: 2 }}>Ver en Amazon</span>
                                        </motion.a>
                                        <motion.button 
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleShare}
                                            className={`flex-1 flex items-center justify-center gap-4 font-bold py-2.5 px-5 rounded-full border transition-all text-[1.08rem] ${copied ? 'bg-white border-green-400 text-green-600' : 'bg-white text-muted-foreground border-[#C8E63A] hover:border-[#A8C420]'}`}
                                            style={{ justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            {copied
                                              ? (<><Check size={24} style={{ marginRight: 10, verticalAlign: 'middle' }} /> <span style={{fontSize: '1.18em', fontWeight: 800, verticalAlign: 'middle'}}>¡Copiado!</span></>)
                                              : (<><Share2 size={24} style={{ marginRight: 10, verticalAlign: 'middle' }} /> <span style={{fontSize: '1.18em', fontWeight: 800, verticalAlign: 'middle'}}>Compartir</span></>)}
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
                                            <p className="text-[14px] text-muted-foreground italic mb-6 line-clamp-3 font-medium opacity-80 leading-relaxed">&ldquo;{item.ai_description}&rdquo;</p>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                                                <span className="text-[16px] font-black text-[#008000] uppercase tracking-tight">{item.price}</span>
                                                <Link
                                                    to={`/perfil/${profileId}?id=${item.id}`}
                                                    onClick={() => window.scrollTo(0, 0)}
                                                    className="text-[14px] font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                                    style={{ color: '#1B4332' }}
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

