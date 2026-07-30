import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Cpu, ServerOff, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigateSlug?: (slug: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateSlug }) => {
  useEffect(() => {
    document.title = 'Gizlilik Politikası — e-Fatura XML Dönüştürücü';

    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute(
      'content',
      'e-Fatura XML Dönüştürücü gizlilik politikası. %100 yerel tarayıcı içi işleme, sıfır sunucu kaydı ve KVKK / GDPR tam uyum taahhüdü.'
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
        : 'https://efatura-xml-converter.calderon-hs91.workers.dev';
    canonicalEl.setAttribute('href', `${origin}/gizlilik-politikasi/`);
  }, []);

  return (
    <article className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Header Back Button */}
      <button
        onClick={() => onNavigateSlug?.('')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Ana Sayfaya Dön</span>
      </button>

      {/* Hero Badge */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs mb-3 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>KVKK & GDPR %100 Uyumlu Gizlilik Garantisi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Gizlilik Politikası ve Veri Güvenliği
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Son Güncelleme: 30 Temmuz 2026 • e-Fatura XML Dönüştürücü Platformu & Mobil Uygulaması
        </p>
      </div>

      {/* Key Core Guarantees Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">%100 İstemci Tarafı (Client-Side)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tüm XML ayrıştırma ve Excel/JSON dönüştürme işlemleri doğrudan cihazınızın RAM belleğinde gerçekleşir.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Sıfır Sunucu Aktarımı</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Yüklediğiniz hiçbir fatura, XML dosyası, VKN/TCKN veya ticari veri uzak sunuculara iletilmez veya saklanmaz.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-start">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Üyelik ve Kayıt Yok</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uygulamayı veya web platformunu kullanmak için e-posta, hesap oluşturma veya profil kaydı gerekmez.
          </p>
        </div>
      </div>

      {/* Full Content Body */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Amaç ve Kapsam</h2>
          <p>
            İşbu Gizlilik Politikası, <strong>e-Fatura XML Dönüştürücü</strong> web uygulaması ve mobil uygulamalarının (Android & iOS) kullanıcılarının gizlilik haklarını ve veri işleme ilkelerini açıklamak üzere hazırlanmıştır. Platformumuz, kullanıcılarının ticari ve şahsi fatura verilerinin mahremiyetine azami özen göstermektedir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. İşlenen Veriler ve Mimarisi</h2>
          <p>
            Uygulamamız mimari olarak tamamen <em>Sunucusuz (Serverless) & İstemci Tarafı (Client-Side SPA)</em> modelinde tasarlanmıştır:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
            <li><strong>Fatura İçerikleri:</strong> Yüklediğiniz UBL-TR XML faturaları cihazınızın web tarayıcısında (WASM / JavaScript motoru) anında işlenir. Veriler sunucuya gönderilmez.</li>
            <li><strong>Kişisel / Ticari Veriler:</strong> VKN, TCKN, Firma Unvanı, Adres, Tutar ve Kalem detayları hiçbir harici veritabanına kaydedilmez.</li>
            <li><strong>Cihaz ve İzinler:</strong> Uygulama cihazınızın kişisel verilerine, kişilerine veya konumuna erişim talep etmez. Mobil sürümlerde sadece dönüştürülen Excel/JSON dosyalarını kaydetmeniz ve paylaşmanız için yerel dosya depolama izni kullanılır.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Çerezler (Cookies) ve Analitik</h2>
          <p>
            Web sitemizde kullanıcı oturumunu takip eden reklam çerezleri veya üçüncü taraf takip mekanizmaları kullanılmamaktadır. Sadece uygulamanın temel çalışması için gerekli olan tarayıcı yerel hafızası (LocalStorage) geçici tercihleri tutmak amacıyla kullanılabilir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. KVKK ve GDPR Uyum Beyanı</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) kapsamında; tarafımızca kişisel veri toplanmadığı, işlenmediği ve üçüncü şahıslara aktarılmadığı için Veri Sorumlusu sıfatıyla herhangi bir veri işleme faaliyeti yürütülmemektedir.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-xl font-bold text-slate-900">5. İletişim</h2>
          <p>
            Gizlilik Politikamız veya veri güvenliği standartlarımız hakkında sorularınız için resmi GitHub depomuz veya geliştirici iletişim kanallarımız üzerinden bilgi talep edebilirsiniz.
          </p>
        </section>
      </div>
    </article>
  );
};
