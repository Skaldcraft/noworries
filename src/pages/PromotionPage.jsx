
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Zap, Star, Layout, Tag, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const AmazonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '12px', transform: 'translateY(-1px)' }}>
        <path d="M15.012 19.405c-1.114.721-2.674 1.144-4.321 1.144-2.887 0-5.385-.944-7.076-2.404-.325-.281-.132-.733.266-.643 2.126.471 4.417.721 6.772.721 2.217 0 4.398-.225 6.37-.655.45-.1.68.423.23.702.408-.073.344.028.188.135zm7.394-1.258c-.521.682-1.442 1.391-2.164 1.391-.722 0-1.402-.244-1.964-.606-.088-.057-.101-.179-.028-.276 1.096-1.447 2.564-2.28 4.167-2.207.088.004.156.082.152.171-.035.789-.163 1.527-.163 1.527zm-1.122-4.031c-1.84.053-3.513.911-4.57 2.378-.051.071-.144.088-.22.053-.51-.233-.974-.537-1.373-.895-.067-.06-.073-.158-.016-.225.86-1.02 2.113-1.761 3.513-2.072 1.4-.311 2.871-.24 4.126.24.1.037.147.161.09.25-.42.66-.889 1.257-1.55 2.271z" />
    </svg>
);

const PromotionPage = () => {
    const { t } = useTranslation();

    const pills = [
        { emoji: '👨', text: 'Para Papá' },
        { emoji: '👩', text: 'Para Mamá' },
        { emoji: '💕', text: 'Pareja' },
        { emoji: '🎧', text: 'Adolescentes' },
        { emoji: '✈️', text: 'Viajeros' },
        { emoji: '🍳', text: 'Cocinillas' },
        { emoji: '🛠️', text: 'Manitas' },
        { emoji: '🐾', text: 'Mascotas' },
        { emoji: '🕹️', text: 'Gamers / Tecnológicos' },
        { emoji: '📚', text: 'Lectores' }
    ];

    return (
        <div className="bg-white min-h-screen text-[#1C1917] font-['Inter'] selection:bg-primary selection:text-white overflow-x-hidden">
            <Helmet>
                <title></title>
                <meta name="description" content="Déjate de búsquedas agobiantes. Selección curada de regalos perfectos por perfiles y presupuestos." />
            </Helmet>

            <header className="container mx-auto px-6 py-12 flex justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-['Outfit'] font-black text-3xl tracking-tighter"
                >
                    noworries.gift 🎁
                </motion.div>
            </header>

            <main>
                <section className="container mx-auto px-6 py-24 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="font-['Outfit'] font-black text-[clamp(3.5rem,10vw,6rem)] leading-[0.9] mb-12 tracking-tight"
                    >
                        El Regalo <span className="bg-gradient-to-br from-primary to-orange-600 bg-clip-text text-transparent">Ideal</span> <br />en un Clic
                    </motion.h1>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {pills.map((pill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(245, 158, 11, 0.25)" }}
                                className="bg-white px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-black/5 flex items-center gap-3 cursor-default transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                                <span className="text-lg">{pill.emoji}</span> {pill.text}
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 }}
                            className="px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest border-2 border-primary text-primary bg-primary/5 flex items-center gap-3"
                        >
                            ¡Y MUCHOS MÁS!
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        <a 
                            href="/"
                            className="inline-flex items-center bg-[#1C1917] text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-primary hover:-translate-y-2 hover:shadow-orange-500/30 transition-all duration-500 group"
                        >
                            <AmazonIcon />
                            Empezar a buscar
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="ml-3"
                            >
                                <ExternalLink size={20} />
                            </motion.span>
                        </a>
                    </motion.div>
                </section>

                <section className="bg-zinc-50 rounded-[5rem_5rem_0_0] py-40 border-t border-black/5">
                    <div className="container mx-auto px-6">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="block text-center text-green-600 font-black tracking-[0.4em] text-sm mb-6 uppercase"
                        >
                            NO MÁS ESTRÉS
                        </motion.span>
                        <h2 className="font-['Outfit'] font-black text-5xl sm:text-7xl text-center mb-24 tracking-tighter">Tan simple como práctico</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: '✨', title: 'Selección Estratégica', desc: 'No listamos de todo. Solo aquello que realmente genera emoción basándonos en perfiles psicológicos y de hobby.' },
                                { icon: '💰', title: 'Cruza tu Presupuesto', desc: 'Filtra por lo que quieres gastar. Desde detalles sencillos hasta regalos que recordarán toda la vida.' },
                                { icon: '⚡', title: 'Sin Vueltas Inútiles', desc: 'Encuentra, revisa por qué funciona el regalo, y ve directo a Amazon para terminar tu compra con garantías.' }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-12 rounded-[3.5rem] text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-black/5 hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="text-6xl mb-8 drop-shadow-lg">{feature.icon}</div>
                                    <h3 className="font-['Outfit'] font-black text-2xl mb-4">{feature.title}</h3>
                                    <p className="text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-32 text-center">
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="/"
                                className="inline-flex items-center bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-orange-600 transition-all shadow-orange-500/20"
                            >
                                <AmazonIcon />
                                ¡Busco un regalo!
                            </motion.a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#1C1917] py-20 text-center text-white/40">
                <div className="container mx-auto px-6">
                    <div className="font-['Outfit'] font-black text-3xl text-white mb-4 tracking-tighter">noworries.gift</div>
                    <p className="text-white/60 font-bold mb-12">Haz que cada detalle cuente.</p>
                    <p className="text-xs font-medium">© 2026 noworries.gift / Skaldcraft. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default PromotionPage;
