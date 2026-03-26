
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

const BANNER_SCHEDULE = [
  // Enero
  { month: 0,  from: 1,  to: 6,  text: "👑 Reyes Magos: remata los últimos regalos sin agobios",                                    path: "/perfil/festividades" },
  { month: 0,  from: 7,  to: 10, text: "❄️ Rebajas de enero: buen momento para esos regalos pendientes",                            path: "/perfil/basicos_utiles" },
  { month: 0,  from: 11, to: 17, text: "🏃‍♂️ Un empujón al eterno propósito de ponerse en forma",                                    path: "/perfil/deportistas" },
  { month: 0,  from: 18, to: 24, text: "✨ Este año nos vamos a cuidar un poco más",                                                 path: "/perfil/cuidarse" },
  { month: 0,  from: 25, to: 31, text: "🏡 Detalles para un invierno más a gusto en casa",                                          path: "/perfil/gente_casera" },

  // Febrero
  { month: 1,  from: 1,  to: 14, text: "💘 San Valentín: detalles para tu pareja sin dramas de última hora",                        path: "/perfil/pareja" },
  { month: 1,  from: 15, to: 28, text: "🎁 Día del Padre: ve eligiendo regalo con algo de margen",                                  path: "/perfil/papa" },

  // Marzo
  { month: 2,  from: 1,  to: 18, text: "👔 Día del Padre (19 marzo): aún estás a tiempo de acertar",                               path: "/perfil/papa" },
  { month: 2,  from: 19, to: 31, text: "🌷 Ya es primavera: cualquier excusa es buena para un detalle",                             path: "/perfil/solo_porque_si" },
  { month: 2,  from: 19, to: 31, text: "🌷 Ya es primavera: pequeños detalles sin gran ocasión",                                    path: "/perfil/detalle" },
  { month: 2,  from: 19, to: 31, text: "🌷 Ya es primavera: ideas para quien ya lo tiene todo",                                     path: "/perfil/quien_lo_tiene_todo" },

  // Abril
  { month: 3,  from: 1,  to: 7,  text: "🐣 Pascua: detalles dulces y pequeños regalos para peques",                                path: "/perfil/ninos" },
  { month: 3,  from: 8,  to: 15, text: "🧳 Escapadas de primavera: detalles para viajes y mini escapadas",                         path: "/perfil/viajeros" },
  { month: 3,  from: 16, to: 30, text: "🌸 Día de la Madre: mejor pensar el regalo con calma desde ya",                            path: "/perfil/mama" },

  // Mayo
  { month: 4,  from: 1,  to: 7,  text: "🌸 Día de la Madre: últimos días para encontrar algo especial",                            path: "/perfil/mama" },
  { month: 4,  from: 8,  to: 20, text: "🛍️ Bodas y comuniones: temporada alta de sobres y detallitos",                             path: "/perfil/boda" },
  { month: 4,  from: 21, to: 31, text: "📸 Que las fotos no se queden en el móvil: álbumes y recuerdos",                           path: "/perfil/basicos_utiles" },

  // Junio
  { month: 5,  from: 1,  to: 20, text: "🎓 Fin de curso: detalles para profes y compis que se lo han ganado",                      path: "/perfil/companeros" },
  { month: 5,  from: 21, to: 30, text: "🏖️ Verano a la vista: prepara tus escapadas con algún detallito",                          path: "/perfil/viajeros" },

  // Julio
  { month: 6,  from: 1,  to: 20, text: "☀️ Verano: viajes, piscina y mil excusas para un pequeño regalo",                          path: "/perfil/viajeros" },
  { month: 6,  from: 21, to: 31, text: "😎 Verano tranquilo: libros, juegos y planes para desconectar",                            path: "/perfil/lectores" },

  // Agosto
  { month: 7,  from: 1,  to: 15, text: "🌊 Agosto: pequeños caprichos para playa, montaña o sofá",                                 path: "/perfil/gente_casera" },
  { month: 7,  from: 16, to: 31, text: "🗂️ Vuelta suave: empieza a pensar en organizarte mejor a la vuelta",                       path: "/perfil/basicos_utiles" },

  // Septiembre
  { month: 8,  from: 1,  to: 15, text: "🎒 Vuelta al cole: para prevenir y empezar bien el curso",                                 path: "/perfil/ninos" },
  { month: 8,  from: 16, to: 30, text: "💼 Nuevo curso y oficina: pequeños detalles para compis y jefes",                          path: "/perfil/companeros" },

  // Octubre — grupo rutina (mismo texto, destino rotativo)
  { month: 9,  from: 1,  to: 15, text: "🎃 La vuelta a la rutina y la calma antes de las fiestas",                                 path: "/perfil/detalle" },
  { month: 9,  from: 1,  to: 15, text: "🎃 La vuelta a la rutina y la calma antes de las fiestas",                                 path: "/perfil/gente_casera" },
  { month: 9,  from: 1,  to: 15, text: "🎃 La vuelta a la rutina y la calma antes de las fiestas",                                 path: "/perfil/nuevo_hogar" },
  { month: 9,  from: 16, to: 31, text: "🕯️ Finales de octubre: piensa en regalos ahora y evita prisas luego",                      path: "/perfil/basicos_utiles" },

  // Noviembre
  { month: 10, from: 1,  to: 19, text: "🖤 Black Friday a la vista: decide qué quieres antes de las ofertas",                      path: "/perfil/gente_tecnologica" },
  // grupo black_semana (mismo texto, destino rotativo)
  { month: 10, from: 20, to: 30, text: "🛍️ Semana Black Friday: buen momento para tachar regalos de la lista",                     path: "/perfil/manitas" },
  { month: 10, from: 20, to: 30, text: "🛍️ Semana Black Friday: buen momento para tachar regalos de la lista",                     path: "/perfil/deportistas" },
  { month: 10, from: 20, to: 30, text: "🛍️ Semana Black Friday: buen momento para tachar regalos de la lista",                     path: "/perfil/gente_tecnologica" },

  // Diciembre
  { month: 11, from: 1,  to: 10, text: "🎄 Navidad: si vas con tiempo, regalar deja de ser un marrón",                             path: "/perfil/festividades" },
  { month: 11, from: 11, to: 20, text: "🎄 Navidad se acerca: mejor cerrar los regalos cuanto antes",                              path: "/perfil/festividades" },
  { month: 11, from: 21, to: 24, text: "⚡ Última hora Navidad: ahora sí, toca ir a por lo rápido y seguro",                       path: "/perfil/festividades" },
  { month: 11, from: 25, to: 31, text: "👑 Se acercan los Reyes: último sprint de regalos bien pensados",                          path: "/perfil/festividades" },
];

function selectBanner(month, day) {
  const candidates = BANNER_SCHEDULE.filter(
    e => e.month === month && day >= e.from && day <= e.to
  );
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  // Rotación determinista: mismo resultado todo el día, distinto cada día del periodo
  return candidates[(day - 1) % candidates.length];
}

function SeasonalBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [banner, setBanner] = useState({ text: '', path: '' });

  useEffect(() => {
    if (sessionStorage.getItem('seasonalBannerDismissed') === 'true') {
      setIsDismissed(true);
      return;
    }
    const now = new Date();
    const selected = selectBanner(now.getMonth(), now.getDate());
    if (selected) setBanner({ text: selected.text, path: selected.path });
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('seasonalBannerDismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed || !banner.text) return null;

  return (
    <div
      className="sticky top-0 z-40 bg-black/85 text-[#f5f0e6] py-2.5 px-6 border-b border-black/20 hover:bg-black/75 transition-colors backdrop-blur-sm"
      style={{ fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif" }}
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between relative group">
        <Link
          to={banner.path}
          className="flex-grow flex items-center justify-center gap-2 text-[13px] font-medium leading-[1.4] group-hover:text-white transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e6]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/85 rounded"
        >
          <span className="line-clamp-1 sm:line-clamp-none text-center">{banner.text}</span>
          <ArrowRight size={14} className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0 text-[#f5f0e6]" />
        </Link>
        <button
          onClick={handleDismiss}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0 ml-4 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e6]/40 text-[#f5f0e6]"
          aria-label="Cerrar banner estacional"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default SeasonalBanner;
