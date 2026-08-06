import type { LocalizedString } from '../types/i18nContent';

export interface GuideSection {
  heading: LocalizedString;
  paragraphs: LocalizedString[];
}

export interface GuideFaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface GuideArticle {
  slug: string;
  title: LocalizedString;
  metaDescription: LocalizedString;
  h1: LocalizedString;
  date: string;
  readTime: LocalizedString;
  author: LocalizedString;
  summary: LocalizedString;
  sections: GuideSection[];
  ctaTool: 'excel' | 'validator' | 'image' | 'document';
  ctaText: LocalizedString;
  faqItems?: GuideFaqItem[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'ubl-tr-nedir-e-fatura-xml-standardi-aciklamasi',
    title: {
      en: 'What Is UBL-TR? e-Fatura XML Standard Explained — Guide',
      tr: 'UBL-TR Nedir? e-Fatura XML Standardı Açıklaması — Rehber',
    },
    metaDescription: {
      en: 'Learn step by step what the UBL-TR 2.1 e-Fatura XML standard is, its tag structure, schema rules, and GİB compliance.',
      tr: 'UBL-TR 2.1 e-Fatura XML standardının ne olduğunu, etiket yapısını, şema kurallarını ve GİB uyumluluğunu adım adım öğrenin.',
    },
    h1: {
      en: "What Is UBL-TR? Turkey's e-Fatura XML Standard and Schema Structure",
      tr: 'UBL-TR Nedir? Türkiye e-Fatura XML Standardı ve Şema Yapısı',
    },
    date: '2026-07-29',
    readTime: { en: '6 min read', tr: '6 dk okuma' },
    author: { en: 'SchemaFlow Technical Team', tr: 'e-Fatura Dönüştürücü Teknik Ekibi' },
    summary: {
      en: "A technical-architecture explanation of the UBL-TR standard mandated by Turkey's Revenue Administration (GİB) for e-Fatura and e-Arşiv invoice processes, and its XML tag blocks.",
      tr: 'Türkiye Gelir İdaresi Başkanlığı (GİB) tarafından e-Fatura ve e-Arşiv fatura süreçlerinde zorunlu kılınan UBL-TR standardının teknik mimarisi ve XML etiket blokları açıklaması.',
    },
    sections: [
      {
        heading: {
          en: "The UBL (Universal Business Language) Concept and Turkey's Customization",
          tr: 'UBL (Universal Business Language) Kavramı ve Türkiye Özelleştirmesi',
        },
        paragraphs: [
          {
            en: "UBL (Universal Business Language) is a global XML standard developed by the OASIS consortium for exchanging electronic documents in international trade. Turkey's Revenue Administration (GİB) created the UBL-TR standard by adapting this international standard to Turkish tax legislation, VAT and excise-duty (ÖTV) practices, and VKN/TCKN identity-verification rules.",
            tr: 'UBL (Universal Business Language), OASIS konsorsiyumu tarafından geliştirilen ve uluslararası ticarette elektronik belgelerin değişimi için kullanılan küresel bir XML standardıdır. Türkiye Gelir İdaresi Başkanlığı (GİB), bu uluslararası standardı Türk vergi mevzuatına, KDV ve ÖTV uygulamalarına ve VKN/TCKN kimlik doğrulama kurallarına uyarlayarak UBL-TR standardını oluşturmuştur.',
          },
          {
            en: 'The UBL-TR 2.1 version defines the technical data format for all e-document types, including the electronic invoice (Invoice) as well as the application response (ApplicationResponse), e-Waybill (DespatchAdvice), and e-Producer receipt.',
            tr: 'UBL-TR 2.1 versiyonu, elektronik faturanın (Invoice) yanı sıra uygulama yanıtı (ApplicationResponse), e-İrsaliye (DespatchAdvice) ve e-Müstahsil makbuzu gibi tüm e-Belge türlerinin teknik veri formatını belirler.',
          },
        ],
      },
      {
        heading: {
          en: 'Core Tag Blocks Found in the UBL-TR XML Structure',
          tr: 'UBL-TR XML Yapısında Bulunan Temel Etiket Blokları',
        },
        paragraphs: [
          {
            en: 'An e-Fatura XML file may look complex when opened in a text editor, but it actually has a disciplined tree hierarchy. The core tag blocks are:',
            tr: 'Bir e-Fatura XML dosyası metin düzenleyici ile açıldığında karmaşık görünse de aslında disiplinli bir ağaç hiyerarşisine sahiptir. Temel etiket blokları şunlardır:',
          },
          {
            en: '1. Invoice Header: contains Invoice/cbc:ID (invoice number), Invoice/cbc:IssueDate (invoice date), and Invoice/cbc:ProfileID (TICARIFATURA, EARSIVFATURA, TEMELFATURA, etc.).',
            tr: '1. Invoice Header (Fatura Üst Bilgisi): Invoice/cbc:ID (Fatura No), Invoice/cbc:IssueDate (Fatura Tarihi) ve Invoice/cbc:ProfileID (TICARIFATURA, EARSIVFATURA, TEMELFATURA vb.) verilerini içerir.',
          },
          {
            en: "2. AccountingSupplierParty (Supplier Info): holds the issuing party's trade name, tax office, and PartyIdentification/cbc:ID (VKN or TCKN).",
            tr: '2. AccountingSupplierParty (Satıcı Bilgileri): Faturayı kesen tarafın ticari ünvanı, vergi dairesi ve PartyIdentification/cbc:ID (VKN veya TCKN) bilgisini barındırır.',
          },
          {
            en: "3. AccountingCustomerParty (Customer Info): covers the buyer's/customer company's name and tax ID details.",
            tr: '3. AccountingCustomerParty (Alıcı Bilgileri): Müşterinin veya alıcı firmanın ünvan ve vergi kimlik numarası detaylarını kapsar.',
          },
          {
            en: '4. TaxTotal & TaxSubtotal (Tax Details): groups the tax base and calculated tax amount for every VAT rate (1%, 10%, 20%) and additional tax (excise duty, banking tax, withholding) on the invoice.',
            tr: '4. TaxTotal & TaxSubtotal (Vergi Detayları): Faturadaki her bir KDV oranı (%1, %10, %20) ve ek vergilerin (ÖTV, BSMV, Tevkifat) matrah ve hesaplanan vergi tutarlarını gruplar.',
          },
          {
            en: '5. InvoiceLine (Line Items): the core block holding the name of the product or service sold (Item/cbc:Name), quantity (InvoicedQuantity), unit (unitCode), unit price (Price/PriceAmount), and line amount.',
            tr: '5. InvoiceLine (Satır Kalemleri): Satılan ürün veya hizmetin adı (Item/cbc:Name), miktarı (InvoicedQuantity), birimi (unitCode), birim fiyatı (Price/PriceAmount) ve satır tutarını barındıran temel bloktur.',
          },
        ],
      },
      {
        heading: {
          en: 'Fiscal Seal and Digital Signature (ds:Signature) Security',
          tr: 'Mali Mühür ve Dijital İmza (ds:Signature) Güvenliği',
        },
        paragraphs: [
          {
            en: "At the bottom of a UBL-TR e-Fatura XML file sits the <ds:Signature> tag. This block is a Base64-encoded digital signature produced with a qualified electronic certificate (NES) or fiscal seal that guarantees the invoice hasn't been altered. Data-parsing tools filter out this signature block without breaking data integrity and turn the invoice content into a table.",
            tr: 'UBL-TR e-Fatura XML dosyalarının en altında <ds:Signature> etiketi yer alır. Bu blok, faturanın değiştirilmediğini garanti eden ve nitelikli elektronik sertifika (NES) veya mali mühür ile üretilen Base64 formatında dijital imzadır. Veri ayrıştırma araçları bu imza bloğunu veri bütünlüğünü bozmadan süzerek fatura içeriğini tablo haline getirir.',
          },
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: {
      en: 'Convert the UBL-TR XML invoices you have into an Excel table instantly, with no code to wrestle with.',
      tr: 'Elindeki UBL-TR XML faturalarını kod karmaşası olmadan incelemek için anında Excel tablosuna dönüştürün.',
    },
  },
  {
    slug: 'e-fatura-ile-e-arsiv-fatura-arasindaki-fark-nedir',
    title: {
      en: "What's the Difference Between e-Fatura and e-Arşiv Invoice? — 2026 Comparison",
      tr: 'e-Fatura ile e-Arşiv Fatura Arasındaki Fark Nedir? — 2026 Kıyaslama',
    },
    metaDescription: {
      en: 'A detailed comparison guide to the recipient type, delivery channel, cancellation process, and VKN/TCKN differences between e-Fatura and e-Arşiv invoices.',
      tr: 'e-Fatura ve e-Arşiv fatura arasındaki alıcı tipi, iletim kanalı, iptal süreçleri ve VKN/TCKN farklarını ayrıntılı karşılaştırma rehberi.',
    },
    h1: {
      en: 'Key Differences Between e-Fatura and e-Arşiv Invoices',
      tr: 'e-Fatura ile e-Arşiv Fatura Arasındaki Temel Farklar',
    },
    date: '2026-07-29',
    readTime: { en: '5 min read', tr: '5 dk okuma' },
    author: { en: 'Tax Compliance & Data Analytics Team', tr: 'Mali Mevzuat ve Veri Analitiği Ekibi' },
    summary: {
      en: 'A detailed look at the legal, technical, and operational differences between e-Fatura and e-Arşiv Invoice, the two concepts businesses confuse most.',
      tr: 'İşletmelerin en çok karıştırdığı e-Fatura ve e-Arşiv Fatura kavramlarının hukuki, teknik ve operasyonel farklarının detaylı incelemesi.',
    },
    sections: [
      {
        heading: {
          en: '1. Recipient Type and Taxpayer-Status Difference',
          tr: '1. Alıcı Tipi ve Mükellefiyet Farkı',
        },
        paragraphs: [
          {
            en: 'e-Fatura is a closed-circuit electronic document issued only between taxpayers registered in the e-Fatura system with each other. In other words, both the seller and the buyer must be e-Fatura users.',
            tr: 'e-Fatura, sadece e-Fatura sistemine kayıtlı mükelleflerin birbirleri arasında düzenlediği kapalı devre bir elektronik belgedir. Yani hem satıcı hem de alıcı e-Fatura kullanıcısı olmak zorundadır.',
          },
          {
            en: 'An e-Arşiv Invoice, on the other hand, is an electronic invoice issued by a business that IS an e-Fatura user to taxpayers who are NOT e-Fatura users, or to end consumers (individual customers).',
            tr: 'e-Arşiv Fatura ise e-Fatura kullanıcısı olan bir işletmenin, e-Fatura kullanıcısı olmayan mükelleflere veya nihai tüketicilere (bireysel müşterilere) kestiği elektronik faturadır.',
          },
        ],
      },
      {
        heading: {
          en: '2. Delivery Channel and GİB Portal Processes',
          tr: '2. İletim Kanalı ve GİB Portal Süreçleri',
        },
        paragraphs: [
          {
            en: "e-Fatura is delivered directly to the recipient's e-Fatura mailbox through the Revenue Administration's (GİB) central system. The invoice reaching the recipient is entirely closed-circuit via the system.",
            tr: 'e-Fatura doğrudan Gelir İdaresi Başkanlığı (GİB) merkez sistemi üzerinden alıcının e-Fatura posta kutusuna aktarılır. Faturanın alıcıya ulaşması sistem üzerinden kapalı devredir.',
          },
          {
            en: 'An e-Arşiv Invoice, once issued, is delivered to the recipient by email, SMS, or printed paper. The issuing company reports its issued e-Arşiv invoices to the GİB system by the evening of the following day.',
            tr: 'e-Arşiv Fatura ise düzenlendikten sonra alıcıya e-Posta, SMS veya kağıt çıktı olarak iletilir. Satıcı firma düzenlediği e-Arşiv faturalarının raporunu ertesi gün akşamına kadar GİB sistemine raporlar.',
          },
        ],
      },
      {
        heading: {
          en: '3. Identity Number (VKN vs. TCKN) Convention',
          tr: '3. Kimlik Numarası (VKN vs. TCKN) Düzenlemesi',
        },
        paragraphs: [
          {
            en: 'e-Fatura transactions, as a rule, take place between corporate companies (10-digit VKN).',
            tr: 'e-Fatura işlemleri kural olarak kurumsal firmalar (10 haneli VKN) arasında gerçekleşir.',
          },
          {
            en: 'e-Arşiv invoices, when issued to end consumers, use the 11-digit national ID number (TCKN). The schemeID attribute in the schema determines the VKN or TCKN distinction.',
            tr: 'e-Arşiv faturaları ise nihai tüketicilere kesildiğinde 11 haneli T.C. Kimlik Numarası (TCKN) kullanılır. Şemadaki schemeID niteliği VKN veya TCKN ayrımını belirler.',
          },
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: {
      en: 'Report both your e-Fatura and e-Arşiv XML files in Excel, complete with the TCKN/VKN distinction.',
      tr: 'Hem e-Fatura hem de e-Arşiv XML dosyalarınızı TCKN/VKN ayrımlarıyla birlikte Excel ortamında raporlayın.',
    },
  },
  {
    slug: 'e-fatura-zorunlulugu-kimleri-kapsiyor-2026-guncel-sinirlar',
    title: {
      en: 'Who Does the e-Fatura Mandate Cover? 2026 Current Thresholds and Revenue Limits',
      tr: 'e-Fatura Zorunluluğu Kimleri Kapsıyor? 2026 Güncel Sınırlar ve Ciro Limitleri',
    },
    metaDescription: {
      en: "GİB's current 2026 e-Fatura and e-Arşiv transition thresholds: the 3 million TL revenue limit, the 500,000 TL e-commerce limit, and paper-invoice exceptions.",
      tr: 'GİB 2026 yılı güncel e-Fatura ve e-Arşiv geçiş limitleri, 3 Milyon TL ciro sınırı, e-ticaret 500 BİN TL sınırı ve Kağıt Fatura Düzenleme İstisnaları.',
    },
    h1: {
      en: '2026 e-Fatura and e-Arşiv Invoice Transition Mandate Thresholds',
      tr: '2026 Yılı e-Fatura ve e-Arşiv Fatura Geçiş Zorunluluk Sınırları',
    },
    date: '2026-07-29',
    readTime: { en: '7 min read', tr: '7 dk okuma' },
    author: { en: 'Regulatory Monitoring & Audit Desk', tr: 'Mevzuat Takip ve Denetim Masası' },
    summary: {
      en: 'e-Fatura mandate conditions set by the Revenue Administration (GİB) based on 2025 gross sales revenue and 2026 lines of business.',
      tr: 'Gelir İdaresi Başkanlığı (GİB) tarafından belirlenen 2025 brüt satış hasılatı ve 2026 faaliyet alanlarına göre e-Fatura zorunluluk şartları.',
    },
    sections: [
      {
        heading: {
          en: '2026 Revenue Thresholds and Transition Calendar',
          tr: '2026 Yılı Ciro Sınırları ve Geçiş Takvimi',
        },
        paragraphs: [
          {
            en: 'All taxpayers whose 2025 fiscal-year gross sales revenue is 3 million TL or more are required to switch to e-Fatura and e-Arşiv Invoice as of July 1, 2026.',
            tr: '2025 yılı hesap dönemi brüt satış hasılatı 3 Milyon TL ve üzerinde olan tüm mükelleflerin 1 Temmuz 2026 tarihi itibarıyla e-Fatura ve e-Arşiv Fatura uygulamasına geçmeleri zorunludur.',
          },
          {
            en: 'For taxpayers engaged in e-commerce activity, selling goods and services over the internet, the gross sales revenue threshold is 500,000 TL.',
            tr: 'e-Ticaret faaliyeti yürüten, internet üzerinden mal ve hizmet satışı yapan mükellefler için brüt satış hasılatı sınırı 500 Bin TL olarak uygulanmaktadır.',
          },
          {
            en: 'For businesses trading or leasing real estate and motor vehicles, the 2025 revenue threshold is likewise 500,000 TL.',
            tr: 'Gayrimenkul ve motorlu taşıt alım-satım veya kiralama işi yapan işletmeler için de 2025 yılı ciro sınırı 500 Bin TL düzeyindedir.',
          },
        ],
      },
      {
        heading: {
          en: 'Sectors Mandated Regardless of Revenue Threshold',
          tr: 'Ciro Sınırı Aranmaksızın Zorunlu Olan Sektörler',
        },
        paragraphs: [
          {
            en: 'Taxpayers operating in the sectors below must use e-Fatura regardless of their gross sales revenue:',
            tr: 'Aşağıdaki sektörlerde faaliyet gösteren mükellefler brüt satış hasılatı miktarına bakılmaksızın e-Fatura kullanmak zorundadır:',
          },
          {
            en: '- Hotels and accommodation businesses (licensed by the Ministry of Tourism or a municipality),',
            tr: '- Konaklama hizmeti veren otel ve işletmeler (Turizm Bakanlığı veya belediye belgeli),',
          },
          {
            en: '- Fuel distributors and mineral-oil producers licensed by EPDK (Energy Market Regulatory Authority),',
            tr: '- EPDK lisansına sahip akaryakıt bayileri ve madeni yağ üreticileri,',
          },
          {
            en: '- Fruit and vegetable commission agents and traders subject to the wholesale-market registry system.',
            tr: '- Hal kayıt sistemine tabi sebze ve meyve komisyoncuları ve tüccarları.',
          },
        ],
      },
      {
        heading: {
          en: 'Paper-Invoice Exception and Paper-Invoice Limits',
          tr: 'Kağıt Fatura Düzenleme İstisnası ve Kağıt Fatura Sınırları',
        },
        paragraphs: [
          {
            en: "Under the Tax Procedure Law's general communiqués, the limit for issuing paper invoices for taxpayers who haven't yet transitioned to the e-document system is restricted to exceptional cases.",
            tr: 'Vergi Usul Kanunu genel tebliğleri uyarınca e-Belge sistemine henüz geçmemiş olan mükellefler için kağıt fatura düzenleyebilme sınırı istisnai durumlarla sınırlandırılmıştır.',
          },
          {
            en: 'In particular, for taxpayers taxed under the simplified method and keeping books on a cash basis, the paper-invoice exception limit is 3,000 TL (valid through December 31, 2026). This is not a general invoice limit — it is only the upper limit for issuing paper documents for small businesses subject to specific bookkeeping methods.',
            tr: 'Özellikle basit usulde vergilendirilen ve işletme hesabı esasına göre defter tutan mükellefler için kağıt fatura düzenleyebilme istisna sınırı 3.000 TL olarak uygulanmaktadır (31 Aralık 2026 tarihine kadar geçerlidir). Bu sınır genel bir fatura sınırı olmayıp, yalnızca belirli defter tutma esaslarına tabi küçük işletmeler için kağıt evrak kesebilme üst limitidir.',
          },
        ],
      },
      {
        heading: {
          en: 'Important Notice and Regulatory Disclaimer',
          tr: 'Önemli Uyarı ve Mevzuat Notu',
        },
        paragraphs: [
          {
            en: "The revenue and threshold figures in this guide are compiled from Official Gazette communiqués published by the Revenue Administration (GİB). These figures may be updated by GİB communiqués. It is strongly recommended that you confirm the exact information for your situation with your financial adviser or GİB's current communiqués.",
            tr: 'Bu rehberde yer alan ciro ve limit rakamları Gelir İdaresi Başkanlığı (GİB) tarafından yayımlanan Resmi Gazete tebliğleri doğrultusunda derlenmiştir. Bu rakamlar GİB tebliğleriyle güncellenebilir. Kendi durumunuz için kesin bilgiyi mali müşavirinizden veya GİB\'in güncel tebliğlerinden teyit etmeniz önemle tavsiye olunur.',
          },
        ],
      },
    ],
    ctaTool: 'validator',
    ctaText: {
      en: 'Instantly validate your invoices against regulatory requirements and the mandatory UBL-TR schema rules.',
      tr: 'Faturalarınızın mevzuata ve zorunlu UBL-TR şema kurallarına uygunluğunu hemen doğrulayın.',
    },
  },
  {
    slug: 'muhasebede-kullanilan-dosya-formatlari-xml-csv-json-farklari',
    title: {
      en: 'File Formats Used in Accounting: Differences Between XML, CSV, and JSON',
      tr: 'Muhasebede Kullanılan Dosya Formatları: XML, CSV, JSON Farkları ve Kullanımı',
    },
    metaDescription: {
      en: 'The advantages, disadvantages, and import scenarios of the XML, CSV, and JSON file formats used in accounting and finance processes.',
      tr: 'Muhasebe ve finans süreçlerinde kullanılan XML, CSV ve JSON dosya formatlarının avantajları, dezavantajları ve aktarım senaryoları.',
    },
    h1: {
      en: 'Comparing XML, CSV, and JSON Formats in Accounting Systems',
      tr: 'Muhasebe Sistemlerinde XML, CSV ve JSON Formatlarının Mukayesesi',
    },
    date: '2026-07-29',
    readTime: { en: '5 min read', tr: '5 dk okuma' },
    author: { en: 'Software & Accounting Integration Team', tr: 'Yazılım ve Muhasebe Entegrasyon Ekibi' },
    summary: {
      en: 'The technical characteristics, Excel compatibility, and ease of automated import of the data formats financial advisers and finance professionals encounter.',
      tr: 'Mali müşavirlerin ve finans uzmanlarının karşılaştığı veri formatlarının teknik özellikleri, Excel uyumlulukları ve otomatik aktarım kolaylıkları.',
    },
    sections: [
      {
        heading: {
          en: 'XML (Extensible Markup Language): The Official Document Standard',
          tr: 'XML (Extensible Markup Language): Resmi Belge Standardı',
        },
        paragraphs: [
          {
            en: 'XML is a rich data format that stores data in a hierarchy of tags (a tree structure). The reason XML was chosen for GİB e-Fatura standards is that data types (VKN, VAT, tax base, line item) can be schematized with strict rules.',
            tr: 'XML, veriyi etiketler hiyerarşisi (ağaç yapısı) içinde saklayan zengin bir veri formatıdır. GİB e-Fatura standartlarında XML tercih edilmesinin sebebi veri türlerinin (VKN, KDV, Matrah, Kalem) kesin kurallarla şemalandırılabilmesidir.',
          },
        ],
      },
      {
        heading: {
          en: "CSV and Excel (.xlsx): The Accountant's Working Format",
          tr: 'CSV ve Excel (.xlsx): Muhasebecilerin Çalışma Formatı',
        },
        paragraphs: [
          {
            en: 'CSV (Comma-Separated Values) and XLSX files are easily human-readable two-dimensional table structures. Accounting programs like Luca, Logo, Netsis, and Zirve accept Excel columns as input for bulk document import.',
            tr: 'CSV (Virgülle Ayrılmış Değerler) ve XLSX dosyaları insan tarafından kolayca okunabilen 2 boyutlu tablo yapısıdır. Luca, Logo, Netsis ve Zirve gibi muhasebe programları toplu evrak aktarımında Excel sütunlarını girdi olarak kabul eder.',
          },
        ],
      },
      {
        heading: {
          en: 'JSON (JavaScript Object Notation): The Language of Automation and APIs',
          tr: 'JSON (JavaScript Object Notation): Otomasyon ve API Dili',
        },
        paragraphs: [
          {
            en: "JSON is a lightweight data format used by web applications and REST API services. It's the most popular choice for moving e-Fatura data into ERP systems via Zapier, Make, and n8n automations.",
            tr: 'JSON, web uygulamaları ve REST API servislerinin kullandığı hafif veri formatıdır. Zapier, Make ve n8n otomasyonları ile e-Fatura verilerini ERP sistemlerine taşırken en meşhur tercih JSON yapısıdır.',
          },
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: {
      en: 'Convert your XML invoice data instantly to Excel (.xlsx), CSV, or PDF format.',
      tr: 'XML fatura verilerinizi anında Excel (.xlsx), CSV veya PDF formatına çevirin.',
    },
  },
  {
    slug: 'e-fatura-xml-dosyasi-nasil-okunur-step-by-step',
    title: {
      en: 'How to Read an e-Fatura XML File? Step-by-Step Illustrated Guide',
      tr: 'e-Fatura XML Dosyası Nasıl Okunur? Adım Adım Resimli Rehber',
    },
    metaDescription: {
      en: 'A guide to easily reading and understanding confusing XML invoice code. Turn it into meaningful data in 5 steps, with no code wrangling.',
      tr: 'Karışık XML fatura kodlarını kolayca okuma ve anlama rehberi. Kod karmaşası yaşamadan 5 adımda anlamlı verilere dönüştürün.',
    },
    h1: {
      en: 'How to Read and Parse an e-Fatura XML File',
      tr: 'e-Fatura XML Dosyası Nasıl Okunur ve Ayrıştırılır?',
    },
    date: '2026-07-29',
    readTime: { en: '4 min read', tr: '4 dk okuma' },
    author: { en: 'User Experience Support Team', tr: 'Kullanıcı Deneyimi Destek Ekibi' },
    summary: {
      en: '5 practical steps for turning the .xml invoice file downloaded to your computer into meaningful product names, amounts, VAT, and company info.',
      tr: 'Bilgisayarınıza indirilen .xml uzantılı fatura dosyasını anlamlı ürün adı, tutar, KDV ve firma bilgilerine dönüştürmenin 5 pratik adımı.',
    },
    sections: [
      {
        heading: { en: 'Step 1: Obtain the XML File', tr: 'Adım 1: XML Dosyasını Edinme' },
        paragraphs: [
          {
            en: 'Open the ZIP archive downloaded from the GİB Portal or your integrator and extract the .xml e-Fatura file to your desktop.',
            tr: 'GİB Portal veya entegratörünüzden indirdiğiniz ZIP arşivini açarak .xml uzantılı e-Fatura dosyasını masaüstünüze çıkarın.',
          },
        ],
      },
      {
        heading: {
          en: 'Step 2: Inspect with a Text Editor (Optional)',
          tr: 'Adım 2: Metin Düzenleyici ile İnceleme (İsteğe Bağlı)',
        },
        paragraphs: [
          {
            en: 'Opened with Notepad, <cbc:ID> shows the invoice number, <cbc:IssueDate> shows the invoice date, and <cac:Item><cbc:Name> shows the name of the product sold.',
            tr: 'Notepad veya Not Defteri ile açtığınızda <cbc:ID> fatura numarasını, <cbc:IssueDate> fatura tarihini, <cac:Item><cbc:Name> ise satılan ürün adını gösterir.',
          },
        ],
      },
      {
        heading: {
          en: 'Step 3: Use an In-Browser Automatic Parser',
          tr: 'Adım 3: Tarayıcı İçi Otomatik Ayrıştırıcı Kullanma',
        },
        paragraphs: [
          {
            en: 'To avoid wasting time on code, drop your file into the web-based drag-and-drop area.',
            tr: 'Kodlarla vakit kaybetmemek için dosyanızı web tabanlı sürükle-bırak alanına bırakın.',
          },
        ],
      },
      {
        heading: {
          en: 'Step 4: Data Audit and Amount Check',
          tr: 'Adım 4: Veri Denetimi ve Tutar Kontrolü',
        },
        paragraphs: [
          {
            en: 'The parser engine automatically audits the Quantity × Price multiplication and highlights faulty rows.',
            tr: 'Ayrıştırıcı motor Miktar × Fiyat çarpımını otomatik denetler ve hatalı satırları vurgular.',
          },
        ],
      },
      {
        heading: {
          en: 'Step 5: Export as Excel, CSV, or PDF',
          tr: 'Adım 5: Excel, CSV veya PDF Olarak Dışa Aktarma',
        },
        paragraphs: [
          {
            en: 'Download the resulting clean data to your computer as an Excel table, CSV, or PDF with a single click.',
            tr: 'Oluşturulan düzenli verileri tek tıkla Excel tablosu, CSV veya PDF olarak bilgisayarınıza indirin.',
          },
        ],
      },
    ],
    ctaTool: 'excel',
    ctaText: {
      en: 'Convert your XML file into a readable Excel table instantly, with no technical knowledge required.',
      tr: 'Hiçbir teknik bilgiye ihtiyaç duymadan XML dosyanızı anında okunabilir Excel tablosuna dönüştürün.',
    },
    faqItems: [
      {
        question: {
          en: 'Can I open an XML invoice directly with Word or Excel?',
          tr: 'XML faturayı Word veya Excel ile direkt açabilir miyim?',
        },
        answer: {
          en: 'When opened directly, XML tag code looks jumbled. Our converter tool filters the data and arranges it into clean columns.',
          tr: 'Doğrudan açıldığında XML etiket kodları karışık görünür. Dönüştürücü aracımız verileri süzerek düzenli kolonlara dizer.',
        },
      },
      {
        question: {
          en: 'Can an XML invoice be read on mobile devices?',
          tr: 'Mobil cihazlarda XML fatura okunabilir mi?',
        },
        answer: {
          en: 'Yes. Our web app is mobile-friendly — you can upload an XML from your phone and view the results.',
          tr: 'Evet. Web uygulamamız mobil uyumludur, telefonunuzdan XML yükleyip sonuçları görüntüleyebilirsiniz.',
        },
      },
    ],
  },
  {
    slug: 'png-jpg-webp-farki-hangi-format-ne-zaman-kullanilmali',
    title: {
      en: "PNG vs JPG vs WebP: What's the Difference? Which Format Should You Use?",
      tr: 'PNG, JPG ve WebP Arasındaki Fark Nedir? Hangi Format Ne Zaman Kullanılmalı?',
    },
    metaDescription: {
      en: 'A practical comparison of PNG, JPG, and WebP image formats — compression, transparency, file size, and browser support — so you pick the right one every time.',
      tr: 'PNG, JPG ve WebP görsel formatlarının sıkıştırma, saydamlık, dosya boyutu ve tarayıcı desteği açısından pratik karşılaştırması — her seferinde doğru formatı seçin.',
    },
    h1: {
      en: 'PNG vs JPG vs WebP: Choosing the Right Image Format',
      tr: 'PNG, JPG ve WebP: Doğru Görsel Formatını Seçmek',
    },
    date: '2026-08-06',
    readTime: { en: '5 min read', tr: '5 dk okuma' },
    author: { en: 'Product & Design Team', tr: 'Ürün ve Tasarım Ekibi' },
    summary: {
      en: 'A side-by-side look at how PNG, JPG, and WebP actually differ under the hood, and simple rules of thumb for which one to reach for depending on your image.',
      tr: 'PNG, JPG ve WebP formatlarının arka planda gerçekte nasıl farklılaştığına dair karşılaştırmalı bir bakış ve görselinize göre hangisini seçmeniz gerektiğine dair basit kurallar.',
    },
    sections: [
      {
        heading: {
          en: 'PNG: Lossless Quality, Best for Graphics and Transparency',
          tr: 'PNG: Kayıpsız Kalite, Grafik ve Saydamlık için En İyisi',
        },
        paragraphs: [
          {
            en: "PNG (Portable Network Graphics) uses lossless compression, meaning no image data is discarded when the file is saved — every pixel stays exactly as it was. This makes PNG the right choice for logos, icons, screenshots, and any graphic with sharp edges or text, where JPG's compression artifacts would blur fine details.",
            tr: 'PNG (Portable Network Graphics), kayıpsız sıkıştırma kullanır; yani dosya kaydedilirken hiçbir görsel veri atılmaz — her piksel olduğu gibi kalır. Bu, PNG\'yi logo, ikon, ekran görüntüsü ve keskin kenarlı veya metin içeren her türlü grafik için doğru seçim yapar; bu tür görsellerde JPG\'nin sıkıştırma bozulmaları ince detayları bulanıklaştırır.',
          },
          {
            en: "The trade-off is file size: because nothing is thrown away, PNG files are typically much larger than a JPG of the same photo. PNG also supports a full alpha channel, so it's the only one of the three that gives you true transparent backgrounds.",
            tr: 'Bunun bedeli dosya boyutudur: hiçbir şey atılmadığı için PNG dosyaları, aynı fotoğrafın JPG haline göre genelde çok daha büyüktür. PNG ayrıca tam bir alfa kanalını destekler, yani üçü arasında gerçek saydam arka plan sunan tek formattır.',
          },
        ],
      },
      {
        heading: {
          en: 'JPG: Small File Sizes for Photos, No Transparency',
          tr: 'JPG: Fotoğraflar için Küçük Dosya Boyutu, Saydamlık Yok',
        },
        paragraphs: [
          {
            en: 'JPG (or JPEG) uses lossy compression — it selectively discards image data that the human eye is least likely to notice, which is why it achieves much smaller file sizes than PNG. This makes it the standard choice for photographs, where gradual color gradients hide the compression well.',
            tr: 'JPG (veya JPEG), kayıplı sıkıştırma kullanır — insan gözünün fark etme ihtimali en düşük olan görsel verileri seçici olarak atar, bu yüzden PNG\'ye göre çok daha küçük dosya boyutlarına ulaşır. Bu da onu, kademeli renk geçişlerinin sıkıştırmayı iyi gizlediği fotoğraflar için standart seçim yapar.',
          },
          {
            en: "The downside: JPG doesn't support transparency at all (a transparent area is filled with white or black), and re-saving the same JPG multiple times gradually degrades quality due to repeated lossy compression — known as generation loss.",
            tr: 'Dezavantajı: JPG saydamlığı hiç desteklemez (saydam alan beyaz veya siyahla doldurulur) ve aynı JPG dosyasını tekrar tekrar kaydetmek, tekrarlanan kayıplı sıkıştırma nedeniyle kaliteyi kademeli olarak düşürür — buna "nesil kaybı" denir.',
          },
        ],
      },
      {
        heading: {
          en: 'WebP: The Modern Format That Does Both',
          tr: 'WebP: Her İkisini de Yapan Modern Format',
        },
        paragraphs: [
          {
            en: 'WebP is a newer format developed by Google that supports both lossy and lossless compression in a single container — plus full transparency, like PNG. In practice, WebP files are typically 25-35% smaller than a comparable JPG and significantly smaller than an equivalent PNG, at a similar visual quality.',
            tr: 'WebP, Google tarafından geliştirilen daha yeni bir formattır ve tek bir dosya biçiminde hem kayıplı hem kayıpsız sıkıştırmayı destekler — üstelik PNG gibi tam saydamlığa da sahiptir. Pratikte WebP dosyaları, benzer görsel kalitede, karşılaştırılabilir bir JPG\'ye göre genelde %25-35 daha küçük, eşdeğer bir PNG\'ye göre ise belirgin şekilde daha küçüktür.',
          },
          {
            en: "Browser support is now near-universal (all modern browsers), which is why it's become the default recommendation for web images — smaller files mean faster page loads. The main reason to still keep a PNG or JPG around is compatibility with older software or specific print/design workflows that don't yet accept WebP.",
            tr: 'Tarayıcı desteği artık neredeyse evrensel (tüm modern tarayıcılar), bu yüzden web görselleri için varsayılan öneri haline geldi — daha küçük dosyalar daha hızlı sayfa yüklemesi demek. PNG veya JPG\'yi hâlâ elde tutmanın temel sebebi, henüz WebP kabul etmeyen eski yazılımlar veya belirli baskı/tasarım iş akışlarıyla uyumluluktur.',
          },
        ],
      },
      {
        heading: {
          en: 'Quick Decision Guide: Which Format Should You Pick?',
          tr: 'Hızlı Karar Rehberi: Hangi Formatı Seçmelisiniz?',
        },
        paragraphs: [
          {
            en: 'Logo, icon, or screenshot with text → PNG (needs transparency or sharp edges). Photograph for a website or social media → WebP if the platform supports it, otherwise JPG. Photo you\'ll print or open in older desktop software → JPG. Any image with a transparent background → PNG or WebP, never JPG.',
            tr: 'Logo, ikon veya metin içeren ekran görüntüsü → PNG (saydamlık veya keskin kenar gerekiyor). Web sitesi veya sosyal medya için fotoğraf → platform destekliyorsa WebP, desteklemiyorsa JPG. Baskı alacağınız veya eski masaüstü yazılımında açacağınız fotoğraf → JPG. Saydam arka planlı herhangi bir görsel → PNG veya WebP, asla JPG değil.',
          },
        ],
      },
    ],
    ctaTool: 'image',
    ctaText: {
      en: 'Convert between PNG, JPG, and WebP instantly in your browser — no upload, no quality loss from a third-party server.',
      tr: 'PNG, JPG ve WebP arasında tarayıcınızda anında dönüştürün — yükleme yok, üçüncü taraf sunucu kaynaklı kalite kaybı yok.',
    },
    faqItems: [
      {
        question: {
          en: 'Does converting an image to a different format reduce its quality?',
          tr: 'Bir görseli farklı bir formata dönüştürmek kalitesini düşürür mü?',
        },
        answer: {
          en: 'Converting to a lossless format (PNG or lossless WebP) keeps quality intact. Converting to a lossy format (JPG or lossy WebP) discards some data, so quality only drops if you convert from an already-lossy source or lower the quality setting — converting a PNG to a high-quality WebP is generally safe.',
          tr: 'Kayıpsız bir formata (PNG veya kayıpsız WebP) dönüştürmek kaliteyi korur. Kayıplı bir formata (JPG veya kayıplı WebP) dönüştürmek bir miktar veri attığı için kalite yalnızca zaten kayıplı bir kaynaktan dönüştürüyorsanız veya kalite ayarını düşürüyorsanız düşer — bir PNG\'yi yüksek kaliteli bir WebP\'ye dönüştürmek genelde güvenlidir.',
        },
      },
      {
        question: {
          en: "Why doesn't my WebP image open in some programs?",
          tr: 'WebP görselim neden bazı programlarda açılmıyor?',
        },
        answer: {
          en: "WebP is newer than PNG and JPG, so a handful of older image viewers and design tools don't support it yet. If you run into this, converting the WebP back to PNG or JPG restores full compatibility.",
          tr: 'WebP, PNG ve JPG\'den daha yeni bir format olduğu için birkaç eski görsel görüntüleyici ve tasarım aracı henüz onu desteklemiyor. Bununla karşılaşırsanız, WebP\'yi tekrar PNG veya JPG\'ye dönüştürmek tam uyumluluğu geri getirir.',
        },
      },
    ],
  },
];
