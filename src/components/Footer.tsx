import React from 'react';
import { Lock, Shield } from 'lucide-react';

interface FooterProps {
  onNavigateSlug?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSlug }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>KVKK Uyumlu Güvenlik Bildirimi:</strong> Yüklediğiniz dosyalar hiçbir sunucuya aktarılmaz, tüm işlemler tamamen tarayıcınızda (istemci tarafında) gerçekleştirilir.
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <button
            onClick={() => onNavigateSlug?.('gizlilik-politikasi/')}
            className="hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Gizlilik Politikası</span>
          </button>
          <span>•</span>
          <span>Format Dönüştürücü Araçlar Platformu v1.0</span>
          <span>•</span>
          <span>UBL-TR Standart Uyumlu</span>
        </div>

      </div>
    </footer>
  );
};
