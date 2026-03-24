
import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-muted-foreground py-10 sm:py-16 border-t border-border/10">
      <div className="max-w-[1100px] mx-auto px-6 text-center space-y-6">
        <p className="text-[14px] leading-relaxed max-w-2xl mx-auto opacity-80">
          {t('footer.affiliate')}
        </p>
        <div className="pt-4 border-t border-muted/10">
          <p className="text-[14px] font-black text-background uppercase tracking-widest">
            © 2026 Skaldcraft
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground/60 leading-relaxed max-w-3xl mx-auto italic">
          {t('footer.price_disclaimer')}
        </p>
      </div>
    </footer>

  );
}

export default Footer;
