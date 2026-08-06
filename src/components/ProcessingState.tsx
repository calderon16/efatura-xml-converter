import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface ProcessingStateProps {
  fileCount: number;
  onComplete: () => void;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ fileCount, onComplete }) => {
  const { t, lang } = useTranslation();
  const [progress, setProgress] = useState(15);
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStage(2);
    }, 700);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStage(3);
    }, 1500);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStage(4);
    }, 2200);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const stageMessage = t(`processingState.stage${stage}` as 'processingState.stage1');

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-6 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-blue-900/10 text-blue-900 mx-auto mb-4 flex items-center justify-center animate-spin">
        <Loader2 className="w-6 h-6" />
      </div>

      <h4 className="font-heading text-lg font-bold text-slate-800 mb-1">
        {t('processingState.title', { count: fileCount })}
      </h4>
      <p className="text-xs text-slate-500 mb-6 font-medium">
        {t('processingState.subtitle')}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3 p-0.5 border border-slate-200">
        <div
          className="bg-gradient-to-r from-blue-900 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-6">
        <span>{stageMessage}</span>
        <span className="text-blue-900">{lang === 'tr' ? `%${progress}` : `${progress}%`}</span>
      </div>

      {/* Mandatory Ad Slot Placeholder */}
      <div
        id="ad-slot"
        className="w-full min-h-[90px] mt-6 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 text-xs gap-1"
      >
        <span className="font-medium">{t('processingState.adSlotLabel')}</span>
        <span className="text-[11px] opacity-75">{t('processingState.adSlotSubtext')}</span>
      </div>
    </div>
  );
};
