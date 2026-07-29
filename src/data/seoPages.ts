export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoPageConfig {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  introText: string;
  targetTool: 'excel' | 'json';
  faqItems: FaqItem[];
}

export const SEO_PAGES: SeoPageConfig[] = [
  {
    slug: 'e-fatura-xml-excel-donusturucu',
    title: 'e-Fatura XML Excel Dönüştürücü — Ücretsiz & Anında (UBL-TR)',
    metaDescription: 'UBL-TR formatındaki e-Fatura XML dosyalarınızı tarayıcı içinde %100 güvenli, ücretsiz ve anında Excel (.xlsx) tablosuna dönüştürün. Sunucusuz & KVKK Uyumlu.',
    h1: 'e-Fatura XML → Excel Dönüştürücü',
    introText: 'Türkiye e-Fatura standardı UBL-TR formatındaki .xml uzantılı dosyalarınızı herhangi bir program kurmadan veya sunucuya yüklemeden anında Excel (.xlsx) formatına dönüştürün. Fatura başlık bilgileri, taraf VKN/TCKN detayları ve kalem satırları otomatik olarak sekmeli Excel tablosuna işlenir.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'e-Fatura XML dosyası Excel\'e dönüştürülürken verilerim güvende mi?',
        answer: 'Evet. İşlemin tamamı %100 kullanıcının tarayıcısında (client-side) gerçekleşir. Dosyalarınız hiçbir sunucuya yüklenmez, KVKK\'ya tamamen uygundur.',
      },
      {
        question: 'Dönüştürülen Excel dosyasında hangi sekmeler bulunur?',
        answer: 'Çıktı dosyası 3 sekmelidir: Bütün ürün/hizmet kalemlerini içeren "Fatura Detayı", fatura başına genel toplamları veren "Özet" ve zorunlu alan raporu içeren "Eksik Alanlar".',
      },
      {
        question: 'Birden fazla XML dosyasını aynı anda yükleyebilir miyim?',
        answer: 'Evet. Sürükle-bırak alanına dilediğiniz kadar e-Fatura veya e-Arşiv XML dosyası bırakarak toplu dönüştürme yapabilirsiniz.',
      },
    ],
  },
  {
    slug: 'e-fatura-excele-nasil-aktarilir',
    title: "e-Fatura Excel'e Nasıl Aktarılır? — Adım Adım Ücretsiz Rehber",
    metaDescription: "GİB portalından veya entegratörden indirilen e-Fatura XML dosyalarını Excel'e aktarmanın en hızlı ve kolay yolu. Program kurmadan 3 adımda yapın.",
    h1: 'e-Fatura XML Dosyaları Excel Tablosuna Nasıl Aktarılır?',
    introText: 'Gelir İdaresi Başkanlığı (GİB) portalından veya özel entegratör yazılımlarından indirilen zip/xml e-Faturaları elle tek tek Excel\'e yazmak ciddi zaman kaybına ve hatalara yol açar. Bu rehber sayesinde XML kod karmaşasıyla uğraşmadan dosyalarınızı tek tıkla Excel\'e aktarabilirsiniz.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'GİB Portalından indirilen ZIP içindeki XML\'leri doğrudan aktarabilir miyim?',
        answer: 'ZIP dosyasından çıkardığınız .xml uzantılı e-Fatura dosyalarını doğrudan dönüştürücüye sürükleyip bırakabilirsiniz.',
      },
      {
        question: 'XML dosyalarını Excel\'de açtığımda neden garip semboller çıkıyor?',
        answer: 'XML dosyaları ham veri yapısındadır. Doğrudan Excel ile açıldığında kodlar karışır. Bu araç XML verisini ayrıştırıp düzgün sütunlara dizer.',
      },
      {
        question: 'Aktarım sırasında tutar hesaplamaları kontrol ediliyor mu?',
        answer: 'Evet. Miktar × Birim Fiyat tutarsızlıkları taranır ve hatalı satırlar Excel\'de sarı renkle işaretlenir.',
      },
    ],
  },
  {
    slug: 'ubl-tr-xml-okuyucu',
    title: 'UBL-TR XML Okuyucu — e-Fatura Şema Ayrıştırıcı ve Görselleştirici',
    metaDescription: 'UBL-TR 2.1 e-Fatura XML şemasını çözümleyen ve teknik kodları anlamlı Excel tablolarına dönüştüren tarayıcı içi şema okuyucu.',
    h1: 'UBL-TR Standartlarına Uygun e-Fatura XML Okuyucu',
    introText: 'UBL-TR (Universal Business Language - Turkey) 2.1 XML şeması karmaşık dizinler ve namespace tanımları içerir. Bu araç, AccountingSupplierParty, AccountingCustomerParty, TaxTotal ve InvoiceLine gibi tüm UBL etiketlerini otomatik olarak okur ve kategorize eder.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'Farklı entegratörlerin (Logo, Netsis, Mikro, Paraşüt) XML şemalarını okur mu?',
        answer: 'Evet. Parser nesnesi getElementsByTagNameNS ve UBL-TR resmi namespace URI\'leri ile çalıştığı için tüm entegratör çıktılarıyla tam uyumludur.',
      },
      {
        question: 'XML içindeki Mali Mühür ve Dijital İmza (ds:Signature) blokları ne olur?',
        answer: 'Dijital imza kodları veriyi etkilemeden sessizce filtrelenir, sadece fatura ve kalem verileri çıkarılır.',
      },
      {
        question: 'UBL-TR şema versiyon uyumsuzluğu yaşanır mı?',
        answer: 'GİB standartlarındaki tüm UBL-TR 2.0 ve 2.1 faturaları desteklenmektedir.',
      },
    ],
  },
  {
    slug: 'e-fatura-toplu-donusturme',
    title: 'Toplu e-Fatura XML Excel Dönüştürme — Yüzlerce Faturayı Tek Tıkla İşleyin',
    metaDescription: 'Aynı anda onlarca veya yüzlerce e-Fatura XML dosyasını topluca Excel\'e aktarın. Muhasebe ve denetim süreçlerinizi hızlandırın.',
    h1: 'Toplu e-Fatura XML → Excel Dönüştürme Aracı',
    introText: 'Ay sonlarında veya dönem kapanışlarında gelen yüzlerce e-Fatura XML dosyasını tek tek işlemek saatler alabilir. Toplu dönüştürme özelliğimiz sayesinde yüzlerce XML dosyasını tek bir hareketle sürükleyip tüm kalemleri tek bir Excel dosyasında birleştirebilirsiniz.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'Toplu dönüştürmede dosya sayısı sınırı var mıdır?',
        answer: 'İşlem tamamen bilgisayarınızın belleğinde yapıldığı için tarayıcınızın kapasitesine bağlı olarak aynı anda yüzlerce dosyayı dönüştürebilirsiniz.',
      },
      {
        question: 'Farklı satıcılardan gelen faturalar tek Excel\'de toplanır mı?',
        answer: 'Evet. Tüm faturalara ait satır kalemleri "Fatura Detayı" sekmesinde sıralanır, satıcı bilgileri her satırda ayrı sütunda gösterilir.',
      },
      {
        question: 'İşlem süresi ne kadardır?',
        answer: 'Tarayıcı içi JS motoru sayesinde 100 adet fatura 2-3 saniye içerisinde taranıp hazır hale gelir.',
      },
    ],
  },
  {
    slug: 'e-arsiv-fatura-excel',
    title: 'e-Arşiv Fatura XML Excel Dönüştürücü — TCKN ve Bireysel Satış Uyumlu',
    metaDescription: 'Bireysel müşterilere kesilen e-Arşiv faturalarının XML dosyalarını Excel\'e dönüştürün. TCKN ve VKN ayrımı otomatik yapılır.',
    h1: 'e-Arşiv Fatura XML → Excel Aktarım Aracı',
    introText: 'e-Arşiv faturaları hem kurumsal şirketlere (VKN) hem de nihai tüketicilere (TCKN) kesilebilir. Bu araç e-Arşiv XML dosyalarındaki schemeID niteliklerini analiz ederek VKN ve TCKN numaralarını otomatik olarak ayırt eder.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'e-Arşiv faturalarındaki TCKN numaraları doğru ayrıştırılır mı?',
        answer: 'Evet. PartyIdentification etiketindeki schemeID="TCKN" niteliği taranarak Excel\'de "TCKN: 12345678901" olarak gösterilir.',
      },
      {
        question: 'PDF formatındaki e-Arşiv faturaları yüklenebilir mi?',
        answer: 'v1 sürümünde sadece saf .xml uzantılı dosyalar desteklenmektedir. PDF içine gömülü XML\'ler için ikaz mesajı gösterilir.',
      },
      {
        question: 'e-Arşiv faturalarında KDV oranları nasıl gösterilir?',
        answer: 'Fatura kalemlerindeki KDV ve diğer vergi oranları ayrı ayrı raporlanır.',
      },
    ],
  },
  {
    slug: 'e-fatura-xml-json-donusturucu',
    title: 'e-Fatura XML JSON Dönüştürücü — UBL-TR Parser & API Entegrasyon',
    metaDescription: 'Yazılımcılar ve otomasyon geliştiricileri için UBL-TR XML faturalarını Yapısal (Nested) veya Düz (Flat Array) JSON formatına çevirin.',
    h1: 'Geliştiriciler İçin e-Fatura XML → JSON Dönüştürücü',
    introText: 'ERP entegrasyonu yapan yazılımcılar, Zapier / Make / n8n otomasyonları kuran ekipler için UBL-TR XML verisini anında JSON nesnelerine dönüştürün. Hem detaylı nested JSON hem de otomasyon uyumlu flat array seçeneği sunulmaktadır.',
    targetTool: 'json',
    faqItems: [
      {
        question: 'Üretilen JSON verisini panoya kopyalayabilir miyim?',
        answer: 'Evet. "Panoya Kopyala" butonu ile anında kopyalayabilir veya .json dosyası olarak indirebilirsiniz.',
      },
      {
        question: 'Zapier veya Make otomasyonlarında hangi JSON formatını kullanmalıyım?',
        answer: '"Sade / Düz Yapı (Flat Array)" seçeneği otomasyon araçlarına aktarım için idealdir.',
      },
      {
        question: 'Hatalı tutar hesaplamaları JSON\'da nasıl gösterilir?',
        answer: 'Tutarsız kalemlerde ilgili nesneye "_warnings": ["Tutarsız hesaplama..."] dizisi eklenir.',
      },
    ],
  },
  {
    slug: 'fatura-xml-veri-cekme',
    title: 'Fatura XML Veri Çekme ve Ayıklama Aracı — Satır Satır Veri Çıkarma',
    metaDescription: 'XML uzantılı fatura dosyalarından stok adı, miktar, birim fiyat, matrah ve vergi verilerini otomatik çekin ve Excel\'e aktarın.',
    h1: 'Fatura XML Dosyalarından Otomatik Veri Ayıklama',
    introText: 'Fatura XML dosyalarından ürün adı, stok miktarları, birim fiyatlar ve vergi detayları gibi kritik verileri elle kopyalamak yerine otomatik olarak çekin. Gelişmiş parser motorumuz verileri saniyeler içinde ayıklar.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'XML verisi çekilirken hangi alanlar ayıklanır?',
        answer: 'Satıcı/Alıcı ünvanları, VKN/TCKN, fatura tarihi, fatura numarası, ürün adları, birim, miktar, birim fiyat, satır tutarı ve vergi detayları çekilir.',
      },
      {
        question: 'Veri çekme esnasında eksik kalan alanlar ne olur?',
        answer: 'Bulunamayan alanlar "Eksik Alanlar" sekmesinde açıklamasıyla raporlanır.',
      },
      {
        question: 'Kodlama bilmeden veri çekebilir miyim?',
        answer: 'Evet. Hiçbir kodlama veya teknik bilgi gerektirmeden sadece dosya sürükleyerek veri çekebilirsiniz.',
      },
    ],
  },
  {
    slug: 'muhasebe-e-fatura-excel-aktarim',
    title: 'Muhasebeciler İçin e-Fatura Excel Aktarım Aracı — Luca, Logo, Netsis Uyumlu',
    metaDescription: 'Mali müşavir ve muhasebeciler için özel olarak geliştirilmiş, e-Fatura ve e-Arşiv XML dosyalarını muhasebe Excel formatına getiren araç.',
    h1: 'Muhasebe Büroları İçin e-Fatura XML Excel Aktarımı',
    introText: 'Müşterilerinizden gelen çuvalla e-Fatura XML dosyasını tek tek muhasebe programlarına işlemek mali müşavirlerin en büyük yüküdür. Bu araç sayesinde tüm faturaları tek Excel\'de toplayıp muhasebe programınızın aktarım şablonuna kolayca hazırlayabilirsiniz.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'Luca, Logo veya Netsis Excel içeri aktarımına uygun mudur?',
        answer: 'Evet. "Fatura Detayı" ve "Özet" sekmelerindeki verileri kopyalayarak muhasebe programınızın Excel aktarım şablonlarına doğrudan yapıştırabilirsiniz.',
      },
      {
        question: 'Vergi matrahı ve KDV ayrı sütunlarda gösterilir mi?',
        answer: 'Evet. Matrah, KDV tutarı ve vergi dahil genel toplamlar ayrı sütunlarda net olarak sunulur.',
      },
      {
        question: 'Muhasebeci çalışanları için kullanım ücreti var mıdır?',
        answer: 'Hayır. Araç %100 ücretsizdir ve sınırsız fatura dönüştürülebilir.',
      },
    ],
  },
  {
    slug: 'ubl-invoice-to-excel',
    title: 'UBL Invoice to Excel Converter — Free Client-Side UBL-TR Parser',
    metaDescription: 'Convert Turkish UBL-TR 2.1 XML invoices to Excel (.xlsx) instantly in your browser. 100% private, free, and no installation required.',
    h1: 'UBL-TR XML Invoice to Excel (.xlsx) Converter',
    introText: 'Convert UBL-TR standard e-Invoice XML files into structured Excel spreadsheets instantly inside your browser. Parse header metadata, accounting party tax IDs (VKN/TCKN), monetary totals, and detailed line items seamlessly.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'Is my XML invoice data uploaded to any external server?',
        answer: 'No. The entire parsing process runs 100% client-side in your web browser using JavaScript. No data ever leaves your computer.',
      },
      {
        question: 'Does it support multiple tax subtotals (VAT + Excise Duty)?',
        answer: 'Yes. Multiple tax categories per invoice line are consolidated into the "Vergi Detayı" column.',
      },
      {
        question: 'Can I batch convert multiple XML invoice files at once?',
        answer: 'Yes. Drag and drop multiple .xml files into the upload box to consolidate them into a single multi-tab Excel file.',
      },
    ],
  },
  {
    slug: 'e-fatura-kdv-detay-raporu',
    title: 'e-Fatura KDV ve Vergi Detay Raporlama Aracı — Oran ve Tutar Denetimi',
    metaDescription: 'Gelen e-Faturalardaki %1, %10, %20 KDV ve ÖTV oranlarını kalem kalem ayırın, vergi tutarsızlıklarını sarı renkle anında tespit edin.',
    h1: 'e-Fatura KDV ve Vergi Detay Raporlama',
    introText: 'Vergi denetimlerinde ve KDV iade raporlarında faturalardaki vergi oranlarının ve tutarlarının doğruluğu hayati önem taşır. Bu araç, e-Faturalardaki tüm KDV ve ek vergi detaylarını kalem bazında raporlar ve hesaplama uyumsuzluklarını otomatik denetler.',
    targetTool: 'excel',
    faqItems: [
      {
        question: 'Farklı KDV oranları (%1, %10, %20) aynı faturada nasıl raporlanır?',
        answer: ' "Vergi Detayı" sütununda her kaleme uygulanan vergi oranları ve tutarları "KDV %20: 300.00 TL | ÖTV %10: 150.00 TL" şeklinde ayrıntılı gösterilir.',
      },
      {
        question: 'Hatalı KDV veya matrah hesaplamaları nasıl fark edilir?',
        answer: 'Miktar × Fiyat ≠ Satır Tutarı olan hatalı kalemler otomatik olarak sarı renk dolgusu ile işaretlenir.',
      },
      {
        question: 'Dönemsel KDV matrah toplamını Excel\'de görebilir miyim?',
        answer: '"Özet" sekmesindeki GENEL TOPLAM satırında toplam matrah ve KDV tutarlarını görebilirsiniz.',
      },
    ],
  },
];
