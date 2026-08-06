import React from 'react';
import { Lock, Shield } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigateSlug?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSlug }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('footer.privacyNotice')}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <button
            onClick={() => onNavigateSlug?.('gizlilik-politikasi/')}
            className="hover:text-blue-900 font-semibold flex items-center gap-1 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('footer.privacyPolicy')}</span>
          </button>
          <span>•</span>
          <span>{t('footer.platformVersion')}</span>
          <span>•</span>
          <span>{t('footer.standardCompliant')}</span>
        </div>

      </div>
    </footer>
  );
};
