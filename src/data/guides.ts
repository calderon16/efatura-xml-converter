export interface GuideArticle {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  date: string;
  readTime: string;
  author: string;
  summary: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  ctaTool: 'excel' | 'json' | 'validator';
  ctaText: string;
  faqItems?: { question: string; answer: string }[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'ubl-tr-nedir-e-fatura-xml-standardi-aciklamasi',
    title: 'UBL-TR Nedir? e-Fatura XML Standardı Açıklaması — Rehber',
    metaDescription: 'UBL-TR 2.1 e-Fatura XML standardının ne olduğunu, etiket yapısını, şema kurallarını ve GİB uyumluluğunu adım adım öğrenin.',
    h1: 'UBL-TR Nedir? Türkiye e-Fatura XML Standardı ve Şema Yapısı',
    date: '2026-07-29',
    readTime: '6 dk okuma',
    author: 'e-Fatura Dönüştürücü Teknik Ekibi',
    summary: 'Türkiye Gelir İdaresi Başkanlığı (GİB) tarafından e-Fatura ve e-Arşiv fatura süreçlerinde zorunlu kılınan UBL-TR standardının teknik mimarisi ve XML etiket blokları açıklaması.',
    sections: [
      {
        heading: 'UBL (Universal Business Language) Kavramı ve Türkiye Özelleştirmesi',
        paragraphs: [
          'UBL (Universal Business Language), OASIS konsorsiyumu tarafından geliştirilen ve uluslararası ticarette elektronik belgelerin değişimi için kullanılan küresel bir XML standardıdır. Türkiye Gelir İdaresi Başkanlığı (GİB), bu uluslararası standardı Türk vergi mevzuatına, KDV ve ÖTV uygulamalarına ve VKN/TCKN kimlik doğrulama kurallarına uyarlayarak UBL-TR standardını oluşturmuştur.',
          'UBL-TR 2.1 versiyonu, elektronik faturanın (Invoice) yanı sıra uygulama yanıtı (ApplicationResponse), e-İrsaliye (DespatchAdvice) ve e-Müstahsil makbuzu gibi tüm e-Belge türlerinin teknik veri formatını belirler.',
        ],
      },
      {
        heading: 'UBL-TR XML Yapısında Bulunan Temel Etiket Blokları',
        paragraphs: [
          'Bir e-Fatura XML dosyası metin düzenleyici ile açıldığında karmaşık görünse de aslında disiplinli bir ağaç hiyerarşisine sahiptir. Temel etiket blokları şunlardır:',
          '1. Invoice Header (Fatura Üst Bilgisi): Invoice/cbc:ID (Fatura No), Invoice/cbc:IssueDate (Fatura Tarihi) ve Invoice/cbc:ProfileID (TICARIFATURA, EARSIVFATURA, TEMELFATURA vb.) verilerini içerir.',
          '2. AccountingSupplierParty (Satıcı Bilgileri): Faturayı kesen tarafın ticari ünvanı, vergi dairesi ve PartyIdentification/cbc:ID (VKN veya TCKN) bilgisini barındırır.',
          '3. AccountingCustomerParty (Alıcı Bilgileri): Müşterinin veya alıcı firmanın ünvan ve vergi kimlik numarası detaylarını kapsar.',
          '4. TaxTotal & TaxSubtotal (Vergi Detayları): Faturadaki her bir KDV oranı (%1, %10, %20) ve ek vergilerin (ÖTV, BSMV, Tevkifat) matrah ve hesaplanan vergi tutarlarını gruplar.',
          '5. InvoiceLine (Satır Kalemleri): Satılan ürün veya hizmetin adı (Item/cbc:Name), miktarı (InvoicedQuantity), birimi (unitCode), birim fiyatı (Price/PriceAmount) ve satır tutarını barındıran temel bloktur.',
        ],
      },
      {
        heading: 'Mali Mühür ve Dijital İmza (ds:Signature) Güvenliği',
        paragraphs: [
          'UBL-TR e-Fatura XML dosyalarının en altında <ds:Signature> etiketi yer alır. Bu blok, faturanın değiştirilmediğini garanti eden ve nitelikli elektronik sertifika (NES) veya mali mühür ile üretilen Base64 formatında dijital imzadır. Veri ayrıştırma araçları bu imza bloğunu veri bütünlüğünü bozmadan süzerek fatura içeriğini tablo haline getirir.',
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: 'Elindeki UBL-TR XML faturalarını kod karmaşası olmadan incelemek için anında Excel tablosuna dönüştürün.',
  },
  {
    slug: 'e-fatura-ile-e-arsiv-fatura-arasindaki-fark-nedir',
    title: 'e-Fatura ile e-Arşiv Fatura Arasındaki Fark Nedir? — 2026 Kıyaslama',
    metaDescription: 'e-Fatura ve e-Arşiv fatura arasındaki alıcı tipi, iletim kanalı, iptal süreçleri ve VKN/TCKN farklarını ayrıntılı karşılaştırma rehberi.',
    h1: 'e-Fatura ile e-Arşiv Fatura Arasındaki Temel Farklar',
    date: '2026-07-29',
    readTime: '5 dk okuma',
    author: 'Mali Mevzuat ve Veri Analitiği Ekibi',
    summary: 'İşletmelerin en çok karıştırdığı e-Fatura ve e-Arşiv Fatura kavramlarının hukuki, teknik ve operasyonel farklarının detaylı incelemesi.',
    sections: [
      {
        heading: '1. Alıcı Tipi ve Mükellefiyet Farkı',
        paragraphs: [
          'e-Fatura, sadece e-Fatura sistemine kayıtlı mükelleflerin birbirleri arasında düzenlediği kapalı devre bir elektronik belgedir. Yani hem satıcı hem de alıcı e-Fatura kullanıcısı olmak zorundadır.',
          'e-Arşiv Fatura ise e-Fatura kullanıcısı olan bir işletmenin, e-Fatura kullanıcısı olmayan mükelleflere veya nihai tüketicilere (bireysel müşterilere) kestiği elektronik faturadır.',
        ],
      },
      {
        heading: '2. İletim Kanalı ve GİB Portal Süreçleri',
        paragraphs: [
          'e-Fatura doğrudan Gelir İdaresi Başkanlığı (GİB) merkez sistemi üzerinden alıcının e-Fatura posta kutusuna aktarılır. Faturanın alıcıya ulaşması sistem üzerinden kapalı devredir.',
          'e-Arşiv Fatura ise düzenlendikten sonra alıcıya e-Posta, SMS veya kağıt çıktı olarak iletilir. Satıcı firma düzenlediği e-Arşiv faturalarının raporunu ertesi gün akşamına kadar GİB sistemine raporlar.',
        ],
      },
      {
        heading: '3. Kimlik Numarası (VKN vs. TCKN) Düzenlemesi',
        paragraphs: [
          'e-Fatura işlemleri kural olarak kurumsal firmalar (10 haneli VKN) arasında gerçekleşir.',
          'e-Arşiv faturaları ise nihai tüketicilere kesildiğinde 11 haneli T.C. Kimlik Numarası (TCKN) kullanılır. Şemadaki schemeID niteliği VKN veya TCKN ayrımını belirler.',
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: 'Hem e-Fatura hem de e-Arşiv XML dosyalarınızı TCKN/VKN ayrımlarıyla birlikte Excel ortamında raporlayın.',
  },
  {
    slug: 'e-fatura-zorunlulugu-kimleri-kapsiyor-2026-güncel-sinirlar',
    title: 'e-Fatura Zorunluluğu Kimleri Kapsıyor? 2026 Güncel Sınırlar ve Ciro Limitleri',
    metaDescription: 'GİB 2026 yılı güncel e-Fatura ve e-Arşiv geçiş limitleri, 3 Milyon TL ciro sınırı, e-ticaret 500 BİN TL sınırı ve 12.000 TL fatura kuralı.',
    h1: '2026 Yılı e-Fatura ve e-Arşiv Fatura Geçiş Zorunluluk Sınırları',
    date: '2026-07-29',
    readTime: '7 dk okuma',
    author: 'Mevzuat Takip ve Denetim Masası',
    summary: 'Gelir İdaresi Başkanlığı (GİB) tarafından belirlenen 2025 brüt satış hasılatı ve 2026 faaliyet alanlarına göre e-Fatura zorunluluk şartları.',
    sections: [
      {
        heading: '2026 Yılı Ciro Sınırları ve Geçiş Takvimi',
        paragraphs: [
          '2025 yılı hesap dönemi brüt satış hasılatı 3 Milyon TL ve üzerinde olan tüm mükelleflerin 1 Temmuz 2026 tarihi itibarıyla e-Fatura ve e-Arşiv Fatura uygulamasına geçmeleri zorunludur.',
          'e-Ticaret faaliyeti yürüten, internet üzerinden mal ve hizmet satışı yapan mükellefler için brüt satış hasılatı sınırı 500 Bin TL olarak uygulanmaktadır.',
          'Gayrimenkul ve motorlu taşıt alım-satım veya kiralama işi yapan işletmeler için de 2025 yılı ciro sınırı 500 Bin TL düzeyindedir.',
        ],
      },
      {
        heading: 'Ciro Sınırı Aranmaksızın Zorunlu Olan Sektörler',
        paragraphs: [
          'Aşağıdaki sektörlerde faaliyet gösteren mükellefler brüt satış hasılatı miktarına bakılmaksızın e-Fatura kullanmak zorundadır:',
          '- Konaklama hizmeti veren otel ve işletmeler (Turizm Bakanlığı veya belediye belgeli),',
          '- EPDK lisansına sahip akaryakıt bayileri ve madeni yağ üreticileri,',
          '- Hal kayıt sistemine tabi sebze ve meyve komisyoncuları ve tüccarları.',
        ],
      },
      {
        heading: '2026 Kağıt Fatura Kesme Sınırı (12.000 TL Kuralı)',
        paragraphs: [
          '2026 yılı için belirlenen fatura düzenleme üst sınırı 12.000 TL\'dir. e-Fatura sistemine dahil olmayan mükellefler dahi, vergi mükelleflerine veya nihai tüketicilere KDV dahil 12.000 TL üzerindeki faturaları GİB Portal üzerinden e-Arşiv Fatura olarak düzenlemekle yükümlüdür.',
        ],
      },
    ],
    ctaTool: 'validator',
    ctaText: 'Faturalarınızın mevzuata ve zorunlu UBL-TR şema kurallarına uygunluğunu hemen doğrulayın.',
  },
  {
    slug: 'muhasebede-kullanilan-dosya-formatlari-xml-csv-json-farklari',
    title: 'Muhasebede Kullanılan Dosya Formatları: XML, CSV, JSON Farkları ve Kullanımı',
    metaDescription: 'Muhasebe ve finans süreçlerinde kullanılan XML, CSV ve JSON dosya formatlarının avantajları, dezavantajları ve aktarım senaryoları.',
    h1: 'Muhasebe Sistemlerinde XML, CSV ve JSON Formatlarının Mukayesesi',
    date: '2026-07-29',
    readTime: '5 dk okuma',
    author: 'Yazılım ve Muhasebe Entegrasyon Ekibi',
    summary: 'Mali müşavirlerin ve finans uzmanlarının karşılaştığı veri formatlarının teknik özellikleri, Excel uyumlulukları ve otomatik aktarım kolaylıkları.',
    sections: [
      {
        heading: 'XML (Extensible Markup Language): Resmi Resmi Belge Standardı',
        paragraphs: [
          'XML, veriyi etiketler hiyerarşisi (ağaç yapısı) içinde saklayan zengin bir veri formatıdır. GİB e-Fatura standartlarında XML tercih edilmesinin sebebi veri türlerinin (VKN, KDV, Matrah, Kalem) kesin kurallarla şemalandırılabilmesidir.',
        ],
      },
      {
        heading: 'CSV ve Excel (.xlsx): Muhasebecilerin Çalışma Formatı',
        paragraphs: [
          'CSV (Virgülle Ayrılmış Değerler) ve XLSX dosyaları insan tarafından kolayca okunabilen 2 boyutlu tablo yapısıdır. Luca, Logo, Netsis ve Zirve gibi muhasebe programları toplu evrak aktarımında Excel sütunlarını girdi olarak kabul eder.',
        ],
      },
      {
        heading: 'JSON (JavaScript Object Notation): Otomasyon ve API Dili',
        paragraphs: [
          'JSON, web uygulamaları ve REST API servislerinin kullandığı hafif veri formatıdır. Zapier, Make ve n8n otomasyonları ile e-Fatura verilerini ERP sistemlerine taşırken en çok tercih edilen format JSON yapısıdır.',
        ],
      },
    ],
    ctaTool: 'json',
    ctaText: 'XML fatura verilerinizi anında hem Excel (.xlsx) hem de geliştirici dostu JSON formatına çevirin.',
  },
  {
    slug: 'e-fatura-xml-dosyasi-nasil-okunur-step-by-step',
    title: 'e-Fatura XML Dosyası Nasıl Okunur? Adım Adım Resimli Rehber',
    metaDescription: 'Karışık XML fatura kodlarını kolayca okuma ve anlama rehberi. Kod karmaşası yaşamadan 5 adımda anlamlı verilere dönüştürün.',
    h1: 'e-Fatura XML Dosyası Nasıl Okunur ve Ayrıştırılır?',
    date: '2026-07-29',
    readTime: '4 dk okuma',
    author: 'Kullanıcı Deneyimi Destek Ekibi',
    summary: 'Bilgisayarınıza indirilen .xml uzantılı fatura dosyasını anlamlı ürün adı, tutar, KDV ve firma bilgilerine dönüştürmenin 5 pratik adımı.',
    sections: [
      {
        heading: 'Adım 1: XML Dosyasını Edinme',
        paragraphs: [
          'GİB Portal veya entegratörünüzden indirdiğiniz ZIP arşivini açarak .xml uzantılı e-Fatura dosyasını masaüstünüze çıkarın.',
        ],
      },
      {
        heading: 'Adım 2: Metin Düzenleyici ile İnceleme (İsteğe Bağlı)',
        paragraphs: [
          'Notepad veya Not Defteri ile açtığınızda <cbc:ID> fatura numarasını, <cbc:IssueDate> fatura tarihini, <cac:Item><cbc:Name> ise satılan ürün adını gösterir.',
        ],
      },
      {
        heading: 'Adım 3: Tarayıcı İçi Otomatik Ayrıştırıcı Kullanma',
        paragraphs: [
          'Kodlarla vakit kaybetmemek için dosyanızı web tabanlı sürükle-bırak alanına bırakın.',
        ],
      },
      {
        heading: 'Adım 4: Veri Denetimi ve Tutar Kontrolü',
        paragraphs: [
          'Ayrıştırıcı motor Miktar × Fiyat çarpımını otomatik denetler ve hatalı satırları vurgular.',
        ],
      },
      {
        heading: 'Adım 5: Excel veya JSON Olarak Dışa Aktarma',
        paragraphs: [
          'Oluşturulan düzenli verileri tek tıkla Excel tablosu veya JSON olarak bilgisayarınıza indirin.',
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: 'Hiçbir teknik bilgiye ihtiyaç duymadan XML dosyanızı anında okunabilir Excel tablosuna dönüştürün.',
    faqItems: [
      {
        question: 'XML faturayı Word veya Excel ile direkt açabilir miyim?',
        answer: 'Doğrudan açıldığında XML etiket kodları karışık görünür. Dönüştürücü aracımız verileri süzerek düzenli kolonlara dizer.',
      },
      {
        question: 'Mobil cihazlarda XML fatura okunabilir mi?',
        answer: 'Evet. Web uygulamamız mobil uyumludur, telefonunuzdan XML yükleyip sonuçları görüntüleyebilirsiniz.',
      },
    ],
  },
];
