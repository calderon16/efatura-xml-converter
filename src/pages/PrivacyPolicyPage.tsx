import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Cpu, ServerOff, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface PrivacyPolicyPageProps {
  onNavigateSlug?: (slug: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateSlug }) => {
  const { t, lang } = useTranslation();

  useEffect(() => {
    document.title =
      lang === 'tr' ? 'Gizlilik Politikası — SchemaFlow' : 'Privacy Policy — SchemaFlow';

    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute(
      'content',
      lang === 'tr'
        ? 'SchemaFlow gizlilik politikası. %100 yerel tarayıcı içi işleme, sıfır sunucu kaydı ve KVKK / GDPR tam uyum taahhüdü.'
        : 'SchemaFlow privacy policy. 100% local in-browser processing, zero server logging, and full KVKK / GDPR compliance commitment.'
    );

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://schemaflowapp.com';
    canonicalEl.setAttribute('href', `${origin}/gizlilik-politikasi/`);
  }, [lang]);

  return (
    <article className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Header Back Button */}
      <button
        onClick={() => onNavigateSlug?.('')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-950 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('app.backToHome')}</span>
      </button>

      {/* Hero Badge */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs mb-3 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('privacy.badge')}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t('privacy.heroTitle')}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          {t('privacy.lastUpdated')}
        </p>
      </div>

      {/* Key Core Guarantees Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">{t('privacy.card1Title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{t('privacy.card1Desc')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">{t('privacy.card2Title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{t('privacy.card2Desc')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-start">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">{t('privacy.card3Title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{t('privacy.card3Desc')}</p>
        </div>
      </div>

      {/* Full Content Body */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">{t('privacy.s1Title')}</h2>
          <p>
            {t('privacy.s1Before')} <strong>SchemaFlow</strong> {t('privacy.s1After')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">{t('privacy.s2Title')}</h2>
          <p>
            {t('privacy.s2IntroBefore')} <em>{t('privacy.s2EmPhrase')}</em> {t('privacy.s2IntroAfter')}
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
            <li><strong>{t('privacy.s2Item1Label')}</strong> {t('privacy.s2Item1Body')}</li>
            <li><strong>{t('privacy.s2Item2Label')}</strong> {t('privacy.s2Item2Body')}</li>
            <li><strong>{t('privacy.s2Item3Label')}</strong> {t('privacy.s2Item3Body')}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">{t('privacy.s3Title')}</h2>
          <p>{t('privacy.s3Body')}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">{t('privacy.s4Title')}</h2>
          <p>{t('privacy.s4Body')}</p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="font-heading text-xl font-bold text-slate-900">{t('privacy.s5Title')}</h2>
          <p>{t('privacy.s5Body')}</p>
        </section>
      </div>
    </article>
  );
};
