import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-foreground text-muted-foreground py-6 sm:py-8 border-t border-border/10">
      <div className="max-w-[1100px] mx-auto px-6 text-center space-y-4">
        <p className="text-[13px] leading-relaxed max-w-2xl mx-auto text-[#F4F1E8]/90">
          Los enlaces de esta web van a productos de Amazon y son de afiliado. Si compras a través de ellos, nos llevamos una pequeña comisión, pero tú pagas exactamente lo mismo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-[#F4F1E8]/85">
          <Link to="/aviso-legal" className="text-[#F4F1E8] hover:text-[#C8E63A] transition-colors">
            Aviso legal
          </Link>
          <Link to="/politica-privacidad" className="text-[#F4F1E8] hover:text-[#C8E63A] transition-colors">
            Política de privacidad
          </Link>
          <Link to="/politica-cookies" className="text-[#F4F1E8] hover:text-[#C8E63A] transition-colors">
            Política de cookies
          </Link>
        </div>
        <div className="pt-3 border-t border-muted/20">
          <p className="text-[13px] font-black text-[#F4F1E8] uppercase tracking-widest">
            © 2026 Skaldcraft
          </p>
        </div>
      </div>
    </footer>

  );
}

export default Footer;
