import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ExternalLink } from 'lucide-react';

const AmazonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}>
        <path d="M6.5 8c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5zm10 0c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5zM12 3C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3zm3.5 13c0 1.93-1.57 3.5-3.5 3.5S8.5 17.93 8.5 16 10.07 12.5 12 12.5s3.5 1.57 3.5 3.5z" fill="currentColor"/>
    </svg>
);

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

function PromotionPage() {
    return (
        <div className="bg-white min-h-screen text-[#1C1917] font-['Inter'] selection:bg-primary selection:text-white overflow-x-hidden">
            <Helmet>
                <title>Regalos Sin Estrés | OneClickFix</title>
                <meta name="description" content="Déjate de búsquedas agobiantes. Selección curada de regalos perfectos por perfiles y presupuestos." />
            </Helmet>

            <header className="container mx-auto px-6 pt-28 pb-12 flex justify-center">
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
                        className="font-['Outfit'] font-black text-[clamp(2rem,6vw,4.25rem)] leading-[1] mb-6 tracking-tight whitespace-nowrap"
                    >
                        El <span className="bg-gradient-to-br from-amber-400 to-orange-600 bg-clip-text text-transparent">Regalo</span> Ideal en dos <span className="bg-gradient-to-br from-emerald-400 to-green-700 bg-clip-text text-transparent">Clics</span>
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                        className="font-['Outfit'] text-[clamp(1.35rem,3.3vw,2.2rem)] font-black tracking-tight mb-4"
                    >
                        Deja de buscar. Empieza a encontrar.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35, ease: "circOut" }}
                        className="mx-auto max-w-3xl text-zinc-600 text-[clamp(1rem,2.1vw,1.3rem)] font-medium leading-relaxed mb-12"
                    >
                        Navegamos por el caos de Amazon por ti. Una selección corta, inteligente y directa para que elijas el regalo perfecto en menos de 2 minutos.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.45, ease: "circOut" }}
                        className="mx-auto max-w-3xl mb-5 text-zinc-700 text-[clamp(0.95rem,1.9vw,1.08rem)] font-medium"
                    >
                        Elige tu configuración y genera tu lista personalizada en la app.
                    </motion.p>

                    <div className="max-w-3xl mx-auto mb-16 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-left">
                        {pills.map((pill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="font-semibold text-[0.95rem] text-zinc-700 flex items-center gap-2"
                            >
                                <span className="text-lg leading-none">{pill.emoji}</span>
                                <span>{pill.text}</span>
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 }}
                            className="font-semibold text-[0.95rem] text-emerald-700 flex items-center gap-2"
                        >
                            <span className="text-lg leading-none">✨</span>
                            <span>Y muchos más</span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        <a
                            href="https://noworries.gift/"
                            className="inline-flex items-center bg-[#00bb2d] text-white px-12 py-6 rounded-2xl font-black text-xl shadow-lg hover:bg-orange-500 hover:-translate-y-2 hover:shadow-orange-500/40 transition-all duration-500 group"
                        >
                            <AmazonIcon />
                            Regalo rápido
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="ml-3"
                            >
                                <ExternalLink size={20} />
                            </motion.span>
                        </a>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                        className="mt-3 text-zinc-500 italic text-[clamp(0.9rem,2vw,1rem)]"
                    >
                        Pruébalo, es más rápido que preguntarle a tu grupo de WhatsApp.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.9 }}
                        className="mt-20 pt-20 border-t border-zinc-200 max-w-3xl mx-auto"
                    >
                        <h2 className="font-['Outfit'] font-black text-[clamp(1.4rem,3.3vw,2.3rem)] text-center tracking-tight mb-6">
                            El atajo inteligente entre tú y el regalo ideal
                        </h2>
                        <p className="text-zinc-600 text-[clamp(1rem,2.05vw,1.2rem)] font-medium leading-relaxed text-center">
                            Ni miles de pestañas abiertas ni horas perdidas. Solo los mejores perfiles y presupuestos organizados para que regalar sea, por fin, superfácil.
                        </p>
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
                        <h3 className="font-['Outfit'] font-black text-[clamp(1.4rem,3.3vw,2.3rem)] text-center tracking-tight mb-4">
                            Acierta siempre, incluso con los que «tienen de todo».
                        </h3>
                        <p className="mx-auto max-w-4xl text-center text-zinc-600 text-[clamp(1rem,2.05vw,1.2rem)] font-medium leading-relaxed mb-16">
                            Filtramos las opciones más originales según su personalidad y tu presupuesto. Menos opciones mediocres, más aciertos memorables. Desde el gran regalo de amor hasta el pequeño detalle de compromiso.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 items-stretch">
                            {[
                                { icon: '🎯', title: 'Define', desc: 'Perfil + presupuesto = regalo en dos clics' },
                                { icon: '✨', title: 'Filtramos', desc: 'Seleccionamos lo más adecuado, acortamos el camino.' },
                                { icon: '🎁', title: 'Acierta', desc: 'Regalo perfecto, estrés cero.' }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-12 rounded-[3.5rem] text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-black/5 hover:shadow-2xl transition-all duration-500 h-full min-h-[24rem] flex flex-col justify-start"
                                >
                                    <div className="text-6xl mb-8 drop-shadow-lg">{feature.icon}</div>
                                    <h3 className="font-['Outfit'] font-black text-2xl mb-4">{feature.title}</h3>
                                    <p className="text-zinc-500 font-medium leading-relaxed max-w-[28ch] mx-auto">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-32 text-center">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://noworries.gift/"
                                className="inline-flex items-center bg-[#00bb2d] text-white px-12 py-6 rounded-2xl font-black text-xl shadow-lg hover:bg-orange-500 hover:-translate-y-2 hover:shadow-orange-500/40 transition-all shadow-green-500/30"
                            >
                                <AmazonIcon />
                                ¡Busco un regalo!
                            </motion.a>
                            <p className="mt-4 text-zinc-500 italic text-[clamp(0.9rem,2vw,1rem)] max-w-2xl mx-auto">
                                Desde «Mi suegra es difícil» hasta «Mi pareja tiene de todo». Tenemos el perfil exacto.
                            </p>
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
}

export default PromotionPage;
