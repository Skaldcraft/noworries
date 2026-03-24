
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

function SeasonalBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [banner, setBanner] = useState({ text: '', path: '' });

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = sessionStorage.getItem('seasonalBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    let text = '';
    let path = '';

    // Enero
    if (month === 0) {
      if (day <= 5) {
        text = "👑 ¡Que vienen los Reyes Magos! (6 de enero) — Envíos rápidos ⚡";
        path = "/perfil/festividades";
      } else {
        text = "❄️ Rebajas de Enero — Date ese capricho que te mereces";
        path = "/";
      }
    }
    // Febrero
    else if (month === 1) {
      if (day <= 14) {
        text = "💘 San Valentín (14 feb) — Demuéstrale cuánto te importa";
        path = "/perfil/pareja";
      } else {
        text = "🎁 El Día del Padre se acerca (19 de marzo) — Encuentra el regalo perfecto";
        path = "/perfil/papa";
      }
    }
    // Marzo
    else if (month === 2) {
      if (day <= 18) {
        text = "👔 Día del Padre (19 de marzo) — Acierta seguro";
        path = "/perfil/papa";
      } else {
        text = "🌷 ¡Ya es primavera! — Sorpresas para cada ocasión";
        path = "/";
      }
    }
    // Abril
    else if (month === 3) {
      text = "🌸 El Día de la Madre se acerca (1er domingo de mayo) — Compra con antelación";
      path = "/perfil/mama";
    }
    // Mayo
    else if (month === 4) {
      if (day <= 7) {
        text = "🌸 Día de la Madre — ¡No lo dejes para el último minuto!";
        path = "/perfil/mama";
      } else {
        text = "🛍️ Temporada de Bodas y Comuniones — El detalle ideal";
        path = "/perfil/boda";
      }
    }
    // Junio
    else if (month === 5) {
      text = "🎓 Fin de Curso — Un agradecimiento a los profesores por su esfuerzo";
      path = "/perfil/companeros";
    }
    // Julio / Agosto
    else if (month === 6 || month === 7) {
      text = "☀️ Ofertas de Verano — Los imprescindibles para tus vacaciones";
      path = "/perfil/viajeros";
    }
    // Septiembre
    else if (month === 8) {
      text = "🎒 La Vuelta a la Rutina — Empieza ahorrando tiempo y dinero";
      path = "/";
    }
    // Octubre
    else if (month === 9) {
      text = "🎃 Anticipa tus compras para los próximos meses y evita prisas";
      path = "/";
    }
    // Noviembre
    else if (month === 10) {
      if (day < 20) {
        text = "🖤 Empieza a preparar tu lista de regalos para el Black Friday";
        path = "/";
      } else {
        text = "🛍️ ¡Semana Black Friday! Adelanta tus regalos de Navidad a buen precio";
        path = "/perfil/festividades";
      }
    }
    // Diciembre
    else if (month === 11) {
      if (day <= 20) {
        text = "🎄 Regalos de Papá Noel y Navidad — Pídelos ya para que lleguen a tiempo";
        path = "/perfil/festividades";
      } else if (day <= 24) {
        text = "⚡ ¡Última Hora! (Navidad) — Fíjate bien que tengan envío rápido Prime";
        path = "/perfil/festividades";
      } else {
        text = "👑 ¡Se acercan los Reyes Magos! (6 de enero) — Pide la magia anticipada";
        path = "/perfil/festividades";
      }
    }

    setBanner({ text, path });
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('seasonalBannerDismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed || !banner.text) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 bg-[#1C1917] text-white py-2.5 px-6 border-b border-white/10 hover:bg-[#262220] transition-colors">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between relative group">
        <Link
          to={banner.path}
          className="flex-grow flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-bold group-hover:text-amber-400 transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917] rounded"
        >
          <span className="line-clamp-1 sm:line-clamp-none text-center">{banner.text}</span>
          <ArrowRight size={14} className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0" />
        </Link>
        <button
          onClick={handleDismiss}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0 ml-4 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Cerrar banner estacional"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default SeasonalBanner;
