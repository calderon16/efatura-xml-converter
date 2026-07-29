import React from 'react';
import { Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>KVKK Uyumlu Güvenlik Bildirimi:</strong> Yüklediğiniz dosyalar hiçbir sunucuya aktarılmaz, tüm işlemler tamamen tarayıcınızda (istemci tarafında) gerçekleştirilir.
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Format Dönüştürücü Araçlar Platformu v1.0</span>
          <span>•</span>
          <span>UBL-TR Standart Uyumlu</span>
        </div>

      </div>
    </footer>
  );
};
