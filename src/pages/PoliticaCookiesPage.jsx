import LegalPageLayout from '@/components/LegalPageLayout';

const sections = [
  {
    title: '1. Qué es una cookie',
    body: [
      'Una cookie es una pequeña cantidad de texto que se almacena en tu navegador cuando navegas por la mayoría de los sitios web.',
      'Las cookies permiten que una web recuerde tu visita y almacene información técnica, estadística o de preferencias personales.'
    ]
  },
  {
    title: '2. Aceptación de cookies',
    body: [
      'Al acceder a noworries.gift por primera vez verás una advertencia informativa donde se solicita el consentimiento para la instalación de cookies.',
      'No se descargará ninguna cookie mientras el usuario no consienta expresamente su instalación.',
      'El usuario puede aceptar, rechazar o configurar las cookies de forma granular.',
      'El simple hecho de seguir navegando no se considera consentimiento válido por sí solo.'
    ]
  },
  {
    title: '3. Tipos de cookies que utiliza esta web',
    body: [
      'noworries.gift utiliza cookies propias y de terceros para asegurar el funcionamiento del programa de afiliados y analizar las visitas.'
    ]
  },
  {
    title: 'A. Cookies técnicas',
    body: [
      'Son las más elementales y permiten tareas básicas como saber cuándo está navegando un humano o una aplicación automatizada, o asegurar el funcionamiento correcto de la web dinámica.',
      'Estas cookies están exentas de consentimiento.'
    ]
  },
  {
    title: 'B. Cookies de afiliación',
    body: [
      'Al ser una web de afiliados, utilizamos cookies de Amazon Services Europe.',
      'Estas cookies se instalan en tu navegador cuando haces clic en un enlace de producto para rastrear si finalmente realizas una compra y así poder atribuirnos la comisión correspondiente.',
      'Finalidad: gestión y seguimiento del programa de afiliados de Amazon.'
    ]
  },
  {
    title: 'C. Cookies de análisis',
    body: [
      'Utilizamos servicios de análisis para entender cómo interactúan los usuarios con el sitio.',
      'Herramienta: {EJ. GOOGLE ANALYTICS / CLOUDFLARE}.',
      'Recogen datos sobre el tipo de navegación, las secciones más utilizadas, productos consultados, idioma, etc. Esta información es estadística y anónima.'
    ]
  },
  {
    title: '4. ¿Se pueden eliminar las cookies?',
    body: [
      <>Sí. No solo eliminar, también bloquear, de forma general o particular para un dominio específico. Para eliminar las cookies de un sitio web, debes ir a la configuración de tu navegador: <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noreferrer noopener" className="text-[#1C1917] underline decoration-[#C8E63A] underline-offset-4 hover:text-[#228B22]">Google Chrome</a>, <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer noopener" className="text-[#1C1917] underline decoration-[#C8E63A] underline-offset-4 hover:text-[#228B22]">Apple Safari</a> o <a href="https://support.mozilla.org/es/kb/Deshabilitar%20cookies%20de%20terceros" target="_blank" rel="noreferrer noopener" className="text-[#1C1917] underline decoration-[#C8E63A] underline-offset-4 hover:text-[#228B22]">Mozilla Firefox</a>.</>,
    ]
  },
  {
    title: '5. Más información',
    body: [
      <>Puedes consultar el reglamento sobre cookies publicado por la Agencia Española de Protección de Datos en su <a href="https://www.aepd.es/guias/guia-cookies.pdf" target="_blank" rel="noreferrer noopener" className="text-[#1C1917] underline decoration-[#C8E63A] underline-offset-4 hover:text-[#228B22]">Guía sobre el uso de las cookies</a>.</>,
      'Última actualización: {FECHA ACTUAL}.'
    ]
  }
];

function PoliticaCookiesPage() {
  return (
    <LegalPageLayout
      title="Política de cookies | noworries.gift"
      description="Política de cookies de noworries.gift con información sobre tipos de cookies, aceptación y eliminación."
      intro="Aquí explicamos qué cookies usamos, para qué sirven y cómo puedes gestionarlas."
      sections={sections}
    />
  );
}

export default PoliticaCookiesPage;
