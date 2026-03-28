/* eslint-disable no-unused-vars */
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ExternalLink, Calendar, ShieldCheck, Truck, Quote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import historyData from '@/data/history.json';
import styleGuide from '@/config/style-guide.json';
import { getImageUrl } from '../utils/getImageUrl';


function ProductDetailPage() {
    const { asin } = useParams();

    const product = historyData.find(item => item.asin === asin);
    const profile = product ? styleGuide.profiles[product.profileId] : null;

    if (!product) {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-6 text-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1C1917] mb-4">Producto no encontrado</h2>
                        <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
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
                <title>{product.title} | OneClickFix</title>
                <meta name="description" content={product.ai_description} />
                <meta property="og:title" content={`${product.title} | Recomendación`} />
                <meta property="og:description" content={product.ai_description} />
                {product.image && <meta property="og:image" content={getImageUrl(product.image)} />}
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <div className="min-h-screen bg-[#F5F5F4] flex flex-col overflow-x-hidden">
                <Header />

                <main className="flex-grow py-12 px-6">
                    <div className="max-w-[1100px] mx-auto">
                        {profile && (
                            <Link
                                to={`/perfil/${product.profileId}`}
                                className="inline-flex items-center gap-2 text-[14px] text-[#78716C] hover:text-[#1C1917] mb-12 transition-colors uppercase tracking-widest font-bold"
                            >
                                <ArrowLeft size={16} /> Volver a {profile.title}
                            </Link>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-start">
                            {/* Product Image Section */}
                            <div className="bg-white rounded-3xl shadow-xl p-12 flex items-center justify-center aspect-square border border-[#E7E5E4] sticky top-[100px]">
                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            {/* Product Info Section */}
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-amber-100 text-amber-700 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Selección Curada
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[12px] text-[#A8A29E] font-medium">
                                            <Calendar size={14} /> {new Date(product.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <h1 className="text-[36px] font-black text-[#1C1917] leading-tight tracking-tight">
                                        {product.title}
                                    </h1>

                                    <div className="flex items-end gap-3 text-[36px] font-black text-[#15803D]">
                                        {product.price}
                                        <span className="text-[14px] text-[#A8A29E] font-semibold mb-2 uppercase italic tracking-widest">
                                            Precio en Amazon
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 rounded-3xl p-10 border border-amber-100 relative shadow-inner">
                                    <Quote className="absolute top-6 left-6 text-amber-200" size={56} />
                                    <div className="relative z-10">
                                        <h3 className="text-[13px] font-black text-amber-900 uppercase tracking-[0.2em] mb-4">
                                            Análisis Exclusive OneClick
                                        </h3>
                                        <p className="text-[20px] text-amber-900 italic leading-relaxed font-serif">
                                            {product.ai_description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-[#F5F5F4] flex items-center justify-center group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                                                <Truck className="text-[#15803D]" size={24} />
                                            </div>
                                            <div className="text-[13px] font-bold text-[#1C1917] uppercase tracking-wider">
                                                Envío Rápido <span className="block text-[11px] text-[#A8A29E] font-medium tracking-normal mt-1 italic">Gestionado por Amazon</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-[#F5F5F4] flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                <ShieldCheck className="text-blue-600" size={24} />
                                            </div>
                                            <div className="text-[13px] font-bold text-[#1C1917] uppercase tracking-wider">
                                                Compra Segura <span className="block text-[11px] text-[#A8A29E] font-medium tracking-normal mt-1 italic">Garantía oficial Amazon</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={product.affiliate_url}
                                        target="_blank"
                                        rel="noopener noreferrer sponsored"
                                        className="flex items-center justify-center gap-3 w-full bg-[#1C1917] hover:bg-[#F59E0B] text-white py-5 rounded-2xl text-[18px] transition-all duration-300 shadow-xl hover:-translate-y-1 transform active:scale-95 group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Ver en Amazon <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                                    </a>
                                </div>

                                {profile && (
                                    <div className="pt-8 border-t border-[#E7E5E4]">
                                        <h4 className="text-[13px] font-bold text-[#78716C] uppercase tracking-widest mb-4 italic">
                                            ¿Por qué encaja con {profile.title}?
                                        </h4>
                                        <p className="text-[14px] text-[#57534E] leading-loose">
                                            Basado en el perfil estratégico de {profile.title}, este producto prioriza {profile.keywords.slice(0, 3).join(', ')} para asegurar un acierto rotundo, evitando lo genérico y buscando la excelencia en lo cotidiano.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}

export default ProductDetailPage;
