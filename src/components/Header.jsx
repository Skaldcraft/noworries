
import React from 'react';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 h-[72px] bg-[#F5F5F4] border-b border-[#E7E5E4]">
      <div className="max-w-[1100px] mx-auto px-6 h-full flex items-center">
        <h1 className="text-[20px] font-bold text-[#1C1917]">
          {t('site.name')}
        </h1>
      </div>
    </header>
  );
}

export default Header;
