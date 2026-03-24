import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 h-[64px] border-b border-[#E7E5E4] bg-[#F7F6F3]/95 backdrop-blur-sm">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-full flex items-center">
        <h1 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight text-[#1C1917]">
          {t('site.name')}
        </h1>
      </div>
    </header>
  );
}

export default Header;
