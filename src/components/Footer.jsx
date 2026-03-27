import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-muted-foreground py-6 sm:py-8 border-t border-border/10">
      <div className="max-w-[1100px] mx-auto px-6 text-center space-y-4">
        <p className="text-[13px] leading-relaxed max-w-2xl mx-auto opacity-80">
          Ofrecemos información de precios aproximados clasificados por rangos. Los precios pueden variar de rango por unos euros.<br />
          El precio final es el de la web oficial de Amazon, verifica siempre antes de comprar.
        </p>
        <p className="text-[13px] opacity-60">
          Como Afiliado de Amazon obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.
        </p>
        <div className="pt-3 border-t border-muted/20">
          <p className="text-[13px] font-black text-background uppercase tracking-widest">
            © 2026 Skaldcraft
          </p>
        </div>
      </div>
    </footer>

  );
}

export default Footer;
