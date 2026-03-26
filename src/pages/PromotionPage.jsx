import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ExternalLink } from 'lucide-react';

const AmazonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}>
        <path d="M6.5 8c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5zm10 0c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5zM12 3C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3zm3.5 13c0 1.93-1.57 3.5-3.5 3.5S8.5 17.93 8.5 16 10.07 12.5 12 12.5s3.5 1.57 3.5 3.5z" fill="currentColor"/>
    </svg>
);

const pills = [
    { emoji: '👨', text: 'Para Papá' },
    { emoji: '👩', text: 'Para Mamá' },
    { emoji: '🎅', text: 'Amigo invisible' },
    { emoji: '💕', text: 'Pareja' },
    { emoji: '🎧', text: 'Adolescentes' },
    { emoji: '✈️', text: 'Viajeros' },
    { emoji: '🍳', text: 'Cocinillas' },
    { emoji: '🛠️', text: 'Manitas' },
    { emoji: '🐾', text: 'Mascotas' },
    { emoji: '🕹️', text: 'Gamers / Tecnológicos' },
    { emoji: '📚', text: 'Lectores' },
    { emoji: '✨', text: 'Y muchos más' }
];

function PromotionPage() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-0 py-0 text-[#444] font-['Lato'] selection:bg-primary selection:text-white overflow-x-hidden md:px-3 md:py-3 lg:px-6 lg:py-6 xl:px-8 xl:py-8">
            <div className="min-h-screen bg-white md:rounded-[1.5rem] md:shadow-[0_18px_42px_-34px_rgba(28,25,23,0.1)] lg:rounded-[2.5rem] lg:shadow-[0_24px_64px_-40px_rgba(28,25,23,0.14)]">
                <Helmet>
                    <title>Regalos Sin Estrés | OneClickFix</title>
                    <meta name="description" content="Déjate de búsquedas agobiantes. Selección curada de regalos perfectos por perfiles y presupuestos." />
                </Helmet>

                <header className="container mx-auto px-6 pt-10 pb-4 md:pt-12 md:pb-5 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-['Outfit'] font-black text-3xl tracking-tighter"
                >
                    noworries.gift 🎁
                </motion.div>
                </header>

                <main>
                    <section className="container mx-auto px-6 pt-16 pb-14 text-center md:pt-20 md:pb-14 lg:pt-24 lg:pb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="font-['Playfair Display'] font-bold text-[clamp(2rem,6vw,4.25rem)] leading-[1] mb-6 tracking-tight whitespace-normal sm:whitespace-nowrap text-[#1C1917]"
                    >
                        El{' '}
                        <motion.span
                            className="bg-clip-text text-transparent inline-block"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #FBBF24, #D97706, #FBBF24)',
                                backgroundSize: '180% 180%'
                            }}
                            animate={shouldReduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                            transition={shouldReduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            Regalo
                        </motion.span>{' '}
                        Ideal en dos{' '}
                        <motion.span
                            className="bg-clip-text text-transparent inline-block"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #4ADE80, #15803D, #4ADE80)',
                                backgroundSize: '180% 180%'
                            }}
                            animate={shouldReduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                            transition={shouldReduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                        >
                            Clics
                        </motion.span>
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                        className="font-['Playfair Display'] text-[clamp(1.28rem,3.05vw,2.05rem)] font-bold tracking-tight mt-8 mb-7 text-[#1C1917]"
                    >
                        Deja de buscar. Empieza a encontrar.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35, ease: "circOut" }}
                        className="mx-auto max-w-[44rem] text-[#666] text-[clamp(1rem,2.1vw,1.3rem)] font-normal leading-[1.65] mb-12"
                    >
                        Navegamos por el caos de Amazon por ti. Una selección corta, inteligente y directa para que elijas el regalo perfecto en menos de 2 minutos.
                    </motion.p>

                    <div className="max-w-5xl mx-auto mb-20 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-center">
                        {pills.map((pill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="font-['Lato'] font-medium text-[1.16rem] text-[#444] flex items-center gap-2 justify-center"
                            >
                                <span className="text-[1.7rem] leading-none">{pill.emoji}</span>
                                <span>{pill.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        <a
                            href="https://noworries.gift/"
                            className="inline-flex w-full max-w-[20rem] sm:w-auto sm:max-w-none sm:min-w-[17rem] justify-center items-center bg-[#228B22] text-white px-8 py-4 rounded-full font-semibold text-[1.05rem] tracking-[0.01em] shadow-[0_12px_26px_-12px_rgba(34,139,34,0.7)] hover:bg-[#1f7a1f] hover:-translate-y-1 hover:shadow-[0_16px_30px_-12px_rgba(34,139,34,0.7)] transition-all duration-300 group"
                        >
                            <AmazonIcon />
                            Regalo rápido
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="ml-2"
                            >
                                <ExternalLink size={20} />
                            </motion.span>
                        </a>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                        className="mt-6 text-[#999] italic text-[clamp(0.9rem,2vw,1rem)] font-normal"
                    >
                        Pruébalo, es más rápido que preguntarle a tu grupo de WhatsApp.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.9 }}
                        className="mt-10 mb-4 pt-10 pb-3 px-10 rounded-2xl border border-zinc-200 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.09)] max-w-[56rem] mx-auto text-center"
                    >
                        <h2 className="font-['Playfair Display'] font-bold text-[clamp(1.32rem,3.1vw,2.1rem)] text-center tracking-tight mb-5 text-[#1C1917]">
                            El atajo inteligente entre tú y el regalo ideal
                        </h2>
                        <p className="mx-auto max-w-[40rem] text-[#666] text-[clamp(0.98rem,1.95vw,1.14rem)] font-normal leading-[1.68] text-center">
                            Ni miles de pestañas abiertas ni horas perdidas. Solo los mejores perfiles y presupuestos organizados para que regalar sea, por fin, superfácil.
                        </p>
                    </motion.div>

                </section>

                    <section className="bg-zinc-50 rounded-[5rem_5rem_0_0] pt-20 pb-36 border-t border-black/5 md:rounded-[3.25rem_3.25rem_1.5rem_1.5rem] lg:rounded-[4.5rem_4.5rem_2.5rem_2.5rem] xl:pt-24 xl:pb-40">
                        <div className="container mx-auto px-6">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="block text-center text-[#228B22] font-black tracking-[0.4em] text-sm mb-8 uppercase"
                        >
                            NO MÁS ESTRÉS
                        </motion.span>
                        <h2 className="font-['Playfair Display'] font-bold text-4xl sm:text-6xl text-center mb-10 tracking-tighter text-[#1C1917]">Tan simple como práctico</h2>
                        <h3 className="font-['Playfair Display'] font-bold text-[clamp(1.15rem,2.7vw,1.9rem)] text-center tracking-tight mb-6 text-[#1C1917]">
                            Acierta siempre, incluso con los que «tienen de todo».
                        </h3>
                        <p className="mx-auto max-w-4xl text-center text-[#666] text-[clamp(1rem,2.05vw,1.2rem)] font-normal leading-relaxed mb-16">
                            Filtramos las opciones más originales según su personalidad y tu presupuesto. Menos opciones mediocres, más aciertos memorables. Desde el gran regalo de amor hasta el pequeño detalle de compromiso.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mt-12 mb-24 mx-auto"
                        >
                            <p className="font-['Lato'] text-[#666] text-[clamp(1rem,2.1vw,1.3rem)] font-normal leading-[1.65] text-center mb-6 max-w-[44rem] mx-auto">
                                Un regalo menos del que preocuparte, un momento más para disfrutar
                            </p>
                            <a href="https://noworries.gift/" target="_blank" rel="noopener noreferrer" className="block max-w-2xl mx-auto">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    poster="/images/cabecera.jpg"
                                    preload="metadata"
                                    className="w-full rounded-3xl shadow-xl"
                                >
                                    <source src="/images/no-mas-estres.mp4" type="video/mp4" />
                                    Tu navegador no soporta video HTML5
                                </video>
                            </a>
                            <p className="font-['Lato'] text-[#666] text-[clamp(0.98rem,1.95vw,1.14rem)] leading-[1.68] text-center mt-5 max-w-[40rem] mx-auto font-normal">
                                Clica en el vídeo, respira hondo y piensa solo en la persona,<br />no en el caos de opciones.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
                            {[
                                {
                                    icon: '🎯',
                                    title: 'Define',
                                    lead: 'Define el perfil y tu presupuesto',
                                    desc: 'Dinos para quién buscas y cuánto quieres gastar. Sin cuestionarios eternos, solo lo que importa para empezar.'
                                },
                                {
                                    icon: '✨',
                                    title: 'Filtra',
                                    lead: 'Mira nuestra selección (al grano)',
                                    desc: 'Olvida las 50 pestañas abiertas. Filtramos el caos de Amazon por ti para mostrarte solo 4 o 5 opciones que realmente encajan.'
                                },
                                {
                                    icon: '🎁',
                                    title: 'Acierta',
                                    lead: 'Acierta y olvídate',
                                    desc: 'Elige tu favorito, cómpralo con un clic y disfruta de la tranquilidad de haber encontrado el detalle perfecto sin agobios.'
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-8 rounded-[2.25rem] text-center shadow-[0_10px_32px_-16px_rgba(0,0,0,0.08)] border border-black/5 hover:shadow-2xl transition-all duration-500 h-full min-h-[21.5rem] flex flex-col justify-start"
                                >
                                    <div className="text-5xl mb-6 drop-shadow-lg">{feature.icon}</div>
                                    <h3 className="font-['Playfair Display'] font-bold text-[1.6rem] mb-4 text-[#1C1917]">{feature.title}</h3>
                                    <p className="font-['Lato'] text-[#1C1917] font-semibold leading-snug mb-3 max-w-[30ch] mx-auto text-base">{feature.lead}</p>
                                    <p className="font-['Lato'] text-[#666] font-normal leading-relaxed max-w-[33ch] mx-auto text-[1rem]">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <span className="block text-center text-[#228B22] font-black tracking-[0.4em] text-sm mb-8 uppercase">
                                GARANTÍA NO WORRIES
                            </span>
                            <h2 className="font-['Playfair Display'] font-bold text-4xl sm:text-6xl text-center mb-6 tracking-tighter text-[#1C1917]">
                                Selección manual libre de estrés
                            </h2>
                            <h3 className="font-['Playfair Display'] font-bold text-[clamp(1.15rem,2.7vw,1.9rem)] text-center tracking-tight mb-2 text-[#1C1917]">
                                Con las mejores opciones de Amazon.
                            </h3>
                        </div>

                        <div className="mt-32 text-center">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://noworries.gift/"
                                className="inline-flex w-full max-w-[20rem] sm:w-auto sm:max-w-none sm:min-w-[17rem] justify-center items-center bg-[#228B22] text-white px-8 py-4 rounded-full font-semibold text-[1.05rem] tracking-[0.01em] shadow-[0_12px_26px_-12px_rgba(34,139,34,0.7)] hover:bg-[#1f7a1f] hover:-translate-y-1 hover:shadow-[0_16px_30px_-12px_rgba(34,139,34,0.7)] transition-all duration-300"
                            >
                                <AmazonIcon />
                                ¡Busco un regalo!
                            </motion.a>
                            <p className="mt-6 text-[#999] italic text-[clamp(0.9rem,2vw,1rem)] max-w-2xl mx-auto font-normal">
                                Desde «Mi suegra es difícil» hasta «Mi pareja tiene de todo». Tenemos el perfil exacto.
                            </p>
                        </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#1C1917] py-20 text-center text-white/40 md:rounded-b-[1.5rem] lg:rounded-b-[2.5rem]">
                    <div className="container mx-auto px-6">
                        <div className="font-['Playfair Display'] font-bold text-3xl text-white mb-4 tracking-tighter">noworries.gift</div>
                        <p className="text-white/60 font-bold mb-12">Haz que cada detalle cuente.</p>
                        <p className="text-xs font-medium">© 2026 noworries.gift / Skaldcraft. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default PromotionPage;
