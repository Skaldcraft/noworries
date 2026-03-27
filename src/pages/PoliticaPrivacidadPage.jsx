import LegalPageLayout from '@/components/LegalPageLayout';

const sections = [
  {
    title: '1. Responsable del tratamiento',
    body: [
      'Identidad del Responsable: {TU NOMBRE O RAZÓN SOCIAL}',
      'Nombre comercial: noworries.gift',
      'NIF/CIF: {TU NIF}',
      'Dirección: {TU DIRECCIÓN FISCAL EN AVILÉS O DONDE CORRESPONDA}',
      'Correo electrónico: {TU EMAIL DE CONTACTO}',
      'Actividad: Recomendación de productos y regalos a través de programas de afiliación.'
    ]
  },
  {
    title: '2. Datos que se recogen',
    body: [
      'La web trata datos de navegación como dirección IP, tipo e identificación del dispositivo, tipo de navegador, dominio de acceso, actividad en el sitio y datos de visualización.',
      'También puede recoger preferencias de búsqueda de forma anónima para mejorar la experiencia.',
      'Esta web no dispone de formularios de contacto ni sistemas de suscripción, por lo que no se recaban nombres, correos electrónicos ni teléfonos de forma directa.'
    ]
  },
  {
    title: '3. Finalidad del tratamiento',
    body: [
      'La información recolectada se usa para analítica y para la gestión de afiliación.',
      'El objetivo es realizar estudios estadísticos sobre las visitas y el comportamiento de los usuarios para mejorar la usabilidad de la web.',
      'También se usa para garantizar el correcto funcionamiento de los enlaces de afiliados de Amazon y el seguimiento de las compras adscritas.'
    ]
  },
  {
    title: '4. Base legal',
    body: [
      'La base legal para el tratamiento de los datos de navegación es el consentimiento del usuario, otorgado al aceptar el uso de cookies en el banner de entrada.'
    ]
  },
  {
    title: '5. Destinatarios',
    body: [
      'Amazon Services Europe: al hacer clic en un enlace de afiliado, Amazon utiliza cookies propias para rastrear la venta y atribuir la comisión correspondiente.',
      'Hosting: {NOMBRE DE TU PROVEEDOR DE HOSTING}, que proporciona el espacio para el funcionamiento de la web.',
      'Herramientas de análisis: {EJ. GOOGLE ANALYTICS O CLOUDFLARE}, que procesan datos de navegación de forma anonimizada.'
    ]
  },
  {
    title: '6. Derechos sobre tus datos',
    body: [
      'Cualquier persona tiene derecho a obtener confirmación sobre si en noworries.gift estamos tratando datos personales que le conciernen.',
      'Puedes solicitar el acceso, rectificación, supresión, limitación u oposición al tratamiento.',
      'Para ejercer estos derechos, escribe a {TU EMAIL DE CONTACTO} adjuntando una fotocopia de tu DNI para acreditar tu identidad.',
      'También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).'
    ]
  },
  {
    title: '7. Secreto y seguridad',
    body: [
      'noworries.gift se compromete al uso y tratamiento de los datos respetando su confidencialidad.',
      'La web incluye un certificado SSL que garantiza que la transmisión de datos entre el servidor y el usuario sea cifrada y segura.'
    ]
  },
  {
    title: '8. Afiliados y terceros',
    body: [
      'La web ofrece contenidos patrocinados y enlaces de afiliados de Amazon.',
      'La información que aparece en esos enlaces es facilitada por los propios anunciantes, por lo que no se asume responsabilidad por posibles inexactitudes.',
      'Toda relación contractual que el usuario formalice con Amazon se entiende realizada única y exclusivamente entre el usuario y Amazon.'
    ]
  }
];

function PoliticaPrivacidadPage() {
  return (
    <LegalPageLayout
      title="Política de privacidad | noworries.gift"
      description="Política de privacidad de noworries.gift sobre datos, finalidad, base legal, derechos y seguridad."
      intro="Aquí se explica qué datos se recogen, para qué se usan y cómo puedes ejercer tus derechos."
      sections={[
        ...sections,
        {
          title: '9. Última actualización',
          body: ['27 de marzo de 2026.']
        }
      ]}
    />
  );
}

export default PoliticaPrivacidadPage;
