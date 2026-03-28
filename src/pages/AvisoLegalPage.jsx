
/* eslint-disable no-unused-vars */
import LegalPageLayout from '@/components/LegalPageLayout';

const sections = [
  {
    title: '1. Identificación del responsable',
    body: [
      'En este espacio encontrarás la información relativa a los términos y condiciones legales que regulan la relación entre los usuarios y la responsable de esta web.',
      'Esta web, https://noworries.gift/, cumple con la LOPDGDD, el RGPD y la LSSI.'
    ]
  },
  {
    title: '2. Datos del titular',
    body: [
      'Denominación social: Ángel González Palenzuela',
      'NIF/CIF: 38078911L',
      'Correo electrónico: skald@skaldcraft.com',
      'Domicilio social: Avenida de los telares, 30, 33401, Avilés, Asturias',
      'Actividad: Recomendación de productos y regalos a través de programas de afiliación.',
    ]
  },
  {
    title: '3. Compromisos y obligaciones',
    body: [
      'El acceso a esta web no supone el inicio de una relación comercial con noworries.gift.',
      'El usuario se compromete a utilizar el sitio, sus servicios y contenidos conforme a la ley, la buena fe y el orden público.',
      'Queda prohibido usar la web con fines ilícitos o que perjudiquen su normal funcionamiento.',
      'También queda prohibida la reproducción, distribución o modificación total o parcial de sus contenidos sin autorización.'
    ]
  },
  {
    title: '4. Afiliación y publicidad',
    body: [
      'Los regalos (artículos) que se muestran en esta web contienen enlaces de afiliado y llevan a Amazon.com, Inc. (www.amazon.es).',
      'Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables según las condiciones establecidas por Amazon.',
      'Si compras a través de nuestros enlaces, recibimos una pequeña comisión, pero tú pagas exactamente lo mismo.',
      'Los pedidos, la atención al cliente y las condiciones de venta de Amazon se rigen por las políticas de dicha plataforma.'
    ]
  },
  {
    title: '5. Seguridad',
    body: [
      'Los datos personales que puedan comunicarse a noworries.gift se tratan de forma segura.',
      'La comunicación entre los usuarios y la web usa un canal seguro mediante HTTPS.'
    ]
  },
  {
    title: '6. Garantías y responsabilidad',
    body: [
      'noworries.gift no ofrece garantías ni se responsabiliza de los daños derivados de la falta de disponibilidad de la web, la presencia de malware, el uso indebido de este aviso legal o los servicios de terceros.'
    ]
  },
  {
    title: '7. Enlaces externos',
    body: [
      'La web puede enlazar a sitios y contenidos de terceros, principalmente Amazon.es.',
      'El objetivo de estos enlaces es facilitar el acceso a productos y no se asume responsabilidad por sus resultados.'
    ]
  },
  {
    title: '8. Resolución de conflictos',
    body: [
      'La Comisión Europea pone a disposición de los usuarios una plataforma de resolución de litigios accesible en http://ec.europa.eu/consumers/odr/.'
    ]
  },
  {
    title: '9. Ley aplicable y jurisdicción',
    body: [
      'Las relaciones entre noworries.gift y los usuarios se someten a la legislación y jurisdicción españolas y a los tribunales de ASTURIAS.'
    ]
  },
  {
    title: '10. Contacto',
    body: [
      'Si tienes cualquier duda sobre este Aviso Legal, escribe a skald@skaldcraft.com.',
      'Última actualización: 27 de marzo de 2026.'
    ]
  }
];

function AvisoLegalPage() {
  return (
    <LegalPageLayout
      title="Aviso legal | noworries.gift"
      description="Aviso legal de noworries.gift con información sobre uso, afiliación, seguridad y contacto."
      intro="Aquí tienes la información esencial sobre el uso de la web, la afiliación y la protección de datos."
      sections={sections}
    />
  );
}

export default AvisoLegalPage;
