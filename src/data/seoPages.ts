import type { LocalizedString } from '../types/i18nContent';

export interface FaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface SeoPageConfig {
  slug: string;
  title: LocalizedString;
  metaDescription: LocalizedString;
  h1: LocalizedString;
  introText: LocalizedString;
  faqItems: FaqItem[];
}

export const SEO_PAGES: SeoPageConfig[] = [
  {
    slug: 'e-fatura-xml-excel-donusturucu',
    title: {
      en: 'e-Fatura XML to Excel Converter — Free & Instant (UBL-TR)',
      tr: 'e-Fatura XML Excel Dönüştürücü — Ücretsiz & Anında (UBL-TR)',
    },
    metaDescription: {
      en: 'Convert UBL-TR format e-Fatura XML files to an Excel (.xlsx) spreadsheet, 100% securely in your browser, free and instant. Serverless & KVKK compliant.',
      tr: 'UBL-TR formatındaki e-Fatura XML dosyalarınızı tarayıcı içinde %100 güvenli, ücretsiz ve anında Excel (.xlsx) tablosuna dönüştürün. Sunucusuz & KVKK Uyumlu.',
    },
    h1: {
      en: 'e-Fatura XML → Excel Converter',
      tr: 'e-Fatura XML → Excel Dönüştürücü',
    },
    introText: {
      en: 'Convert your Turkish e-Fatura standard (UBL-TR) .xml files to Excel (.xlsx) format instantly, without installing any program or uploading to a server. Invoice header info, party VKN/TCKN details, and line items are automatically processed into a tabbed Excel spreadsheet.',
      tr: 'Türkiye e-Fatura standardı UBL-TR formatındaki .xml uzantılı dosyalarınızı herhangi bir program kurmadan veya sunucuya yüklemeden anında Excel (.xlsx) formatına dönüştürün. Fatura başlık bilgileri, taraf VKN/TCKN detayları ve kalem satırları otomatik olarak sekmeli Excel tablosuna işlenir.',
    },
    faqItems: [
      {
        question: {
          en: 'Is my data safe when converting an e-Fatura XML file to Excel?',
          tr: "e-Fatura XML dosyası Excel'e dönüştürülürken verilerim güvende mi?",
        },
        answer: {
          en: "Yes. The entire process happens 100% in the user's browser (client-side). Your files are never uploaded to any server, fully compliant with KVKK (Turkey's data protection law).",
          tr: "Evet. İşlemin tamamı %100 kullanıcının tarayıcısında (client-side) gerçekleşir. Dosyalarınız hiçbir sunucuya yüklenmez, KVKK'ya tamamen uygundur.",
        },
      },
      {
        question: {
          en: 'What tabs does the converted Excel file contain?',
          tr: 'Dönüştürülen Excel dosyasında hangi sekmeler bulunur?',
        },
        answer: {
          en: "The output file has 3 tabs: \"Invoice Detail\" with all product/service line items, \"Summary\" with grand totals per invoice, and \"Missing Fields\" with a required-field report.",
          tr: 'Çıktı dosyası 3 sekmelidir: Bütün ürün/hizmet kalemlerini içeren "Fatura Detayı", fatura başına genel toplamları veren "Özet" ve zorunlu alan raporu içeren "Eksik Alanlar".',
        },
      },
      {
        question: {
          en: 'Can I upload multiple XML files at once?',
          tr: 'Birden fazla XML dosyasını aynı anda yükleyebilir miyim?',
        },
        answer: {
          en: 'Yes. Drop as many e-Fatura or e-Arşiv XML files as you like into the drag-and-drop area for batch conversion.',
          tr: 'Evet. Sürükle-bırak alanına dilediğiniz kadar e-Fatura veya e-Arşiv XML dosyası bırakarak toplu dönüştürme yapabilirsiniz.',
        },
      },
    ],
  },
  {
    slug: 'e-fatura-excele-nasil-aktarilir',
    title: {
      en: 'How to Import e-Fatura into Excel? — Free Step-by-Step Guide',
      tr: "e-Fatura Excel'e Nasıl Aktarılır? — Adım Adım Ücretsiz Rehber",
    },
    metaDescription: {
      en: 'The fastest and easiest way to import e-Fatura XML files downloaded from the GİB portal or an integrator into Excel. Do it in 3 steps, no installation.',
      tr: "GİB portalından veya entegratörden indirilen e-Fatura XML dosyalarını Excel'e aktarmanın en hızlı ve kolay yolu. Program kurmadan 3 adımda yapın.",
    },
    h1: {
      en: 'How to Import e-Fatura XML Files into an Excel Spreadsheet?',
      tr: 'e-Fatura XML Dosyaları Excel Tablosuna Nasıl Aktarılır?',
    },
    introText: {
      en: 'Manually typing e-Fatura files downloaded as zip/xml from the Revenue Administration (GİB) portal or private integrator software into Excel one by one wastes serious time and causes errors. This guide lets you import your files into Excel with a single click, without wrestling with XML code.',
      tr: 'Gelir İdaresi Başkanlığı (GİB) portalından veya özel entegratör yazılımlarından indirilen zip/xml e-Faturaları elle tek tek Excel\'e yazmak ciddi zaman kaybına ve hatalara yol açar. Bu rehber sayesinde XML kod karmaşasıyla uğraşmadan dosyalarınızı tek tıkla Excel\'e aktarabilirsiniz.',
    },
    faqItems: [
      {
        question: {
          en: 'Can I directly import the XMLs inside a ZIP downloaded from the GİB Portal?',
          tr: "GİB Portalından indirilen ZIP içindeki XML'leri doğrudan aktarabilir miyim?",
        },
        answer: {
          en: 'Yes, you can drag and drop the .xml e-Fatura files you extracted from the ZIP directly into the converter.',
          tr: 'ZIP dosyasından çıkardığınız .xml uzantılı e-Fatura dosyalarını doğrudan dönüştürücüye sürükleyip bırakabilirsiniz.',
        },
      },
      {
        question: {
          en: 'Why do strange symbols appear when I open XML files in Excel?',
          tr: "XML dosyalarını Excel'de açtığımda neden garip semboller çıkıyor?",
        },
        answer: {
          en: 'XML files are raw data structures. Opening them directly in Excel garbles the code. This tool parses the XML data and arranges it into clean columns.',
          tr: 'XML dosyaları ham veri yapısındadır. Doğrudan Excel ile açıldığında kodlar karışır. Bu araç XML verisini ayrıştırıp düzgün sütunlara dizer.',
        },
      },
      {
        question: {
          en: 'Are amount calculations checked during import?',
          tr: 'Aktarım sırasında tutar hesaplamaları kontrol ediliyor mu?',
        },
        answer: {
          en: "Yes. Quantity × Unit Price inconsistencies are scanned, and faulty rows are highlighted in yellow in Excel.",
          tr: "Evet. Miktar × Birim Fiyat tutarsızlıkları taranır ve hatalı satırlar Excel'de sarı renkle işaretlenir.",
        },
      },
    ],
  },
  {
    slug: 'ubl-tr-xml-okuyucu',
    title: {
      en: 'UBL-TR XML Reader — e-Fatura Schema Parser & Visualizer',
      tr: 'UBL-TR XML Okuyucu — e-Fatura Şema Ayrıştırıcı ve Görselleştirici',
    },
    metaDescription: {
      en: 'An in-browser schema reader that parses the UBL-TR 2.1 e-Fatura XML schema and turns technical tags into meaningful Excel tables.',
      tr: 'UBL-TR 2.1 e-Fatura XML şemasını çözümleyen ve teknik kodları anlamlı Excel tablolarına dönüştüren tarayıcı içi şema okuyucu.',
    },
    h1: {
      en: 'e-Fatura XML Reader Compliant with UBL-TR Standards',
      tr: 'UBL-TR Standartlarına Uygun e-Fatura XML Okuyucu',
    },
    introText: {
      en: 'The UBL-TR (Universal Business Language - Turkey) 2.1 XML schema contains complex hierarchies and namespace definitions. This tool automatically reads and categorizes every UBL tag, such as AccountingSupplierParty, AccountingCustomerParty, TaxTotal, and InvoiceLine.',
      tr: 'UBL-TR (Universal Business Language - Turkey) 2.1 XML şeması karmaşık dizinler ve namespace tanımları içerir. Bu araç, AccountingSupplierParty, AccountingCustomerParty, TaxTotal ve InvoiceLine gibi tüm UBL etiketlerini otomatik olarak okur ve kategorize eder.',
    },
    faqItems: [
      {
        question: {
          en: 'Does it read XML schemas from different integrators (Logo, Netsis, Mikro, Paraşüt)?',
          tr: 'Farklı entegratörlerin (Logo, Netsis, Mikro, Paraşüt) XML şemalarını okur mu?',
        },
        answer: {
          en: "Yes. Because the parser works with getElementsByTagNameNS and the official UBL-TR namespace URIs, it's fully compatible with output from every integrator.",
          tr: "Evet. Parser nesnesi getElementsByTagNameNS ve UBL-TR resmi namespace URI'leri ile çalıştığı için tüm entegratör çıktılarıyla tam uyumludur.",
        },
      },
      {
        question: {
          en: 'What happens to the Fiscal Seal and Digital Signature (ds:Signature) blocks in the XML?',
          tr: 'XML içindeki Mali Mühür ve Dijital İmza (ds:Signature) blokları ne olur?',
        },
        answer: {
          en: 'Digital signature code is silently filtered out without affecting the data — only invoice and line-item data is extracted.',
          tr: 'Dijital imza kodları veriyi etkilemeden sessizce filtrelenir, sadece fatura ve kalem verileri çıkarılır.',
        },
      },
      {
        question: {
          en: 'Are there UBL-TR schema version compatibility issues?',
          tr: 'UBL-TR şema versiyon uyumsuzluğu yaşanır mı?',
        },
        answer: {
          en: 'All UBL-TR 2.0 and 2.1 invoices under GİB standards are supported.',
          tr: 'GİB standartlarındaki tüm UBL-TR 2.0 ve 2.1 faturaları desteklenmektedir.',
        },
      },
    ],
  },
  {
    slug: 'e-fatura-toplu-donusturme',
    title: {
      en: 'Bulk e-Fatura XML to Excel Conversion — Process Hundreds of Invoices in One Click',
      tr: 'Toplu e-Fatura XML Excel Dönüştürme — Yüzlerce Faturayı Tek Tıkla İşleyin',
    },
    metaDescription: {
      en: 'Import dozens or hundreds of e-Fatura XML files into Excel in bulk at once. Speed up your accounting and audit processes.',
      tr: "Aynı anda onlarca veya yüzlerce e-Fatura XML dosyasını topluca Excel'e aktarın. Muhasebe ve denetim süreçlerinizi hızlandırın.",
    },
    h1: {
      en: 'Bulk e-Fatura XML → Excel Conversion Tool',
      tr: 'Toplu e-Fatura XML → Excel Dönüştürme Aracı',
    },
    introText: {
      en: "Processing hundreds of e-Fatura XML files arriving at month-end or period close one by one can take hours. With our bulk conversion feature, you can drag hundreds of XML files in a single motion and merge every line item into one Excel file.",
      tr: 'Ay sonlarında veya dönem kapanışlarında gelen yüzlerce e-Fatura XML dosyasını tek tek işlemek saatler alabilir. Toplu dönüştürme özelliğimiz sayesinde yüzlerce XML dosyasını tek bir hareketle sürükleyip tüm kalemleri tek bir Excel dosyasında birleştirebilirsiniz.',
    },
    faqItems: [
      {
        question: {
          en: 'Is there a file-count limit for bulk conversion?',
          tr: 'Toplu dönüştürmede dosya sayısı sınırı var mıdır?',
        },
        answer: {
          en: "Since the process runs entirely in your computer's memory, you can convert hundreds of files at once, depending on your browser's capacity.",
          tr: 'İşlem tamamen bilgisayarınızın belleğinde yapıldığı için tarayıcınızın kapasitesine bağlı olarak aynı anda yüzlerce dosyayı dönüştürebilirsiniz.',
        },
      },
      {
        question: {
          en: 'Are invoices from different suppliers combined into a single Excel file?',
          tr: "Farklı satıcılardan gelen faturalar tek Excel'de toplanır mı?",
        },
        answer: {
          en: "Yes. Line items from all invoices are listed on the \"Invoice Detail\" tab, with supplier info shown in a separate column on every row.",
          tr: 'Evet. Tüm faturalara ait satır kalemleri "Fatura Detayı" sekmesinde sıralanır, satıcı bilgileri her satırda ayrı sütunda gösterilir.',
        },
      },
      {
        question: {
          en: 'How long does processing take?',
          tr: 'İşlem süresi ne kadardır?',
        },
        answer: {
          en: 'Thanks to the in-browser JS engine, 100 invoices are scanned and ready in 2-3 seconds.',
          tr: 'Tarayıcı içi JS motoru sayesinde 100 adet fatura 2-3 saniye içerisinde taranıp hazır hale gelir.',
        },
      },
    ],
  },
  {
    slug: 'e-arsiv-fatura-excel',
    title: {
      en: 'e-Arşiv Invoice XML to Excel Converter — TCKN & Individual Sales Compatible',
      tr: 'e-Arşiv Fatura XML Excel Dönüştürücü — TCKN ve Bireysel Satış Uyumlu',
    },
    metaDescription: {
      en: 'Convert XML files of e-Arşiv invoices issued to individual customers into Excel. TCKN and VKN are distinguished automatically.',
      tr: "Bireysel müşterilere kesilen e-Arşiv faturalarının XML dosyalarını Excel'e dönüştürün. TCKN ve VKN ayrımı otomatik yapılır.",
    },
    h1: {
      en: 'e-Arşiv Invoice XML → Excel Import Tool',
      tr: 'e-Arşiv Fatura XML → Excel Aktarım Aracı',
    },
    introText: {
      en: 'e-Arşiv invoices can be issued to both corporate companies (VKN) and end consumers (TCKN). This tool automatically distinguishes VKN and TCKN numbers by analyzing the schemeID attributes in e-Arşiv XML files.',
      tr: 'e-Arşiv faturaları hem kurumsal şirketlere (VKN) hem de nihai tüketicilere (TCKN) kesilebilir. Bu araç e-Arşiv XML dosyalarındaki schemeID niteliklerini analiz ederek VKN ve TCKN numaralarını otomatik olarak ayırt eder.',
    },
    faqItems: [
      {
        question: {
          en: 'Are TCKN numbers in e-Arşiv invoices parsed correctly?',
          tr: "e-Arşiv faturalarındaki TCKN numaraları doğru ayrıştırılır mı?",
        },
        answer: {
          en: 'Yes. The schemeID="TCKN" attribute in the PartyIdentification tag is scanned and shown in Excel as "TCKN: 12345678901".',
          tr: 'Evet. PartyIdentification etiketindeki schemeID="TCKN" niteliği taranarak Excel\'de "TCKN: 12345678901" olarak gösterilir.',
        },
      },
      {
        question: {
          en: 'Can e-Arşiv invoices in PDF format be uploaded?',
          tr: 'PDF formatındaki e-Arşiv faturaları yüklenebilir mi?',
        },
        answer: {
          en: 'In v1, only plain .xml files are supported. A warning message is shown for XML embedded inside a PDF.',
          tr: "v1 sürümünde sadece saf .xml uzantılı dosyalar desteklenmektedir. PDF içine gömülü XML'ler için ikaz mesajı gösterilir.",
        },
      },
      {
        question: {
          en: 'How are VAT rates shown for e-Arşiv invoices?',
          tr: "e-Arşiv faturalarında KDV oranları nasıl gösterilir?",
        },
        answer: {
          en: 'VAT and other tax rates in the invoice line items are reported separately for each item.',
          tr: 'Fatura kalemlerindeki KDV ve diğer vergi oranları ayrı ayrı raporlanır.',
        },
      },
    ],
  },
  {
    slug: 'fatura-xml-veri-cekme',
    title: {
      en: 'Invoice XML Data Extraction Tool — Row-by-Row Data Extraction',
      tr: 'Fatura XML Veri Çekme ve Ayıklama Aracı — Satır Satır Veri Çıkarma',
    },
    metaDescription: {
      en: 'Automatically extract stock name, quantity, unit price, tax base, and tax data from XML invoice files and export to Excel.',
      tr: "XML uzantılı fatura dosyalarından stok adı, miktar, birim fiyat, matrah ve vergi verilerini otomatik çekin ve Excel'e aktarın.",
    },
    h1: {
      en: 'Automatic Data Extraction from Invoice XML Files',
      tr: 'Fatura XML Dosyalarından Otomatik Veri Ayıklama',
    },
    introText: {
      en: 'Extract critical data such as product name, stock quantities, unit prices, and tax details from invoice XML files automatically instead of copying by hand. Our advanced parser engine extracts the data in seconds.',
      tr: 'Fatura XML dosyalarından ürün adı, stok miktarları, birim fiyatlar ve vergi detayları gibi kritik verileri elle kopyalamak yerine otomatik olarak çekin. Gelişmiş parser motorumuz verileri saniyeler içinde ayıklar.',
    },
    faqItems: [
      {
        question: {
          en: 'Which fields are extracted during data extraction?',
          tr: 'XML verisi çekilirken hangi alanlar ayıklanır?',
        },
        answer: {
          en: 'Supplier/customer names, VKN/TCKN, invoice date, invoice number, product names, unit, quantity, unit price, line amount, and tax details are extracted.',
          tr: 'Satıcı/Alıcı ünvanları, VKN/TCKN, fatura tarihi, fatura numarası, ürün adları, birim, miktar, birim fiyat, satır tutarı ve vergi detayları çekilir.',
        },
      },
      {
        question: {
          en: "What happens to fields that are missing during extraction?",
          tr: 'Veri çekme esnasında eksik kalan alanlar ne olur?',
        },
        answer: {
          en: 'Fields that can\'t be found are reported with a description on the "Missing Fields" tab.',
          tr: 'Bulunamayan alanlar "Eksik Alanlar" sekmesinde açıklamasıyla raporlanır.',
        },
      },
      {
        question: {
          en: 'Can I extract data without knowing how to code?',
          tr: 'Kodlama bilmeden veri çekebilir miyim?',
        },
        answer: {
          en: 'Yes. You can extract data just by dragging in a file, with no coding or technical knowledge required.',
          tr: 'Evet. Hiçbir kodlama veya teknik bilgi gerektirmeden sadece dosya sürükleyerek veri çekebilirsiniz.',
        },
      },
    ],
  },
  {
    slug: 'muhasebe-e-fatura-excel-aktarim',
    title: {
      en: 'e-Fatura Excel Import Tool for Accountants — Compatible with Luca, Logo, Netsis',
      tr: 'Muhasebeciler İçin e-Fatura Excel Aktarım Aracı — Luca, Logo, Netsis Uyumlu',
    },
    metaDescription: {
      en: 'A tool built specifically for accountants and financial advisers that turns e-Fatura and e-Arşiv XML files into an accounting-ready Excel format.',
      tr: 'Mali müşavir ve muhasebeciler için özel olarak geliştirilmiş, e-Fatura ve e-Arşiv XML dosyalarını muhasebe Excel formatına getiren araç.',
    },
    h1: {
      en: 'e-Fatura XML to Excel Import for Accounting Firms',
      tr: 'Muhasebe Büroları İçin e-Fatura XML Excel Aktarımı',
    },
    introText: {
      en: "Processing a sackful of e-Fatura XML files from your clients one by one into accounting software is the biggest burden for financial advisers. With this tool, you can gather every invoice into a single Excel file and easily prepare it for your accounting software's import template.",
      tr: 'Müşterilerinizden gelen çuvalla e-Fatura XML dosyasını tek tek muhasebe programlarına işlemek mali müşavirlerin en büyük yüküdür. Bu araç sayesinde tüm faturaları tek Excel\'de toplayıp muhasebe programınızın aktarım şablonuna kolayca hazırlayabilirsiniz.',
    },
    faqItems: [
      {
        question: {
          en: 'Is it compatible with Luca, Logo, or Netsis Excel import?',
          tr: 'Luca, Logo veya Netsis Excel içeri aktarımına uygun mudur?',
        },
        answer: {
          en: "Yes. You can copy the data from the \"Invoice Detail\" and \"Summary\" tabs and paste it directly into your accounting software's Excel import templates.",
          tr: 'Evet. "Fatura Detayı" ve "Özet" sekmelerindeki verileri kopyalayarak muhasebe programınızın Excel aktarım şablonlarına doğrudan yapıştırabilirsiniz.',
        },
      },
      {
        question: {
          en: 'Are the tax base and VAT shown in separate columns?',
          tr: 'Vergi matrahı ve KDV ayrı sütunlarda gösterilir mi?',
        },
        answer: {
          en: 'Yes. The tax base, VAT amount, and tax-inclusive grand totals are presented clearly in separate columns.',
          tr: 'Evet. Matrah, KDV tutarı ve vergi dahil genel toplamlar ayrı sütunlarda net olarak sunulur.',
        },
      },
      {
        question: {
          en: 'Is there a usage fee for accounting staff?',
          tr: 'Muhasebeci çalışanları için kullanım ücreti var mıdır?',
        },
        answer: {
          en: 'No. The tool is 100% free with unlimited invoice conversions.',
          tr: 'Hayır. Araç %100 ücretsizdir ve sınırsız fatura dönüştürülebilir.',
        },
      },
    ],
  },
  {
    slug: 'ubl-invoice-to-excel',
    title: {
      en: 'UBL Invoice to Excel Converter — Free Client-Side UBL-TR Parser',
      tr: 'UBL Fatura Excel Dönüştürücü — Ücretsiz İstemci Taraflı UBL-TR Ayrıştırıcı',
    },
    metaDescription: {
      en: 'Convert Turkish UBL-TR 2.1 XML invoices to Excel (.xlsx) instantly in your browser. 100% private, free, and no installation required.',
      tr: "Türk UBL-TR 2.1 XML faturalarını tarayıcınızda anında Excel'e (.xlsx) dönüştürün. %100 gizli, ücretsiz ve kurulum gerektirmez.",
    },
    h1: {
      en: 'UBL-TR XML Invoice to Excel (.xlsx) Converter',
      tr: 'UBL-TR XML Fatura → Excel (.xlsx) Dönüştürücü',
    },
    introText: {
      en: 'Convert UBL-TR standard e-Invoice XML files into structured Excel spreadsheets instantly inside your browser. Parse header metadata, accounting party tax IDs (VKN/TCKN), monetary totals, and detailed line items seamlessly.',
      tr: 'UBL-TR standardındaki e-Fatura XML dosyalarını tarayıcınız içinde anında yapılandırılmış Excel tablolarına dönüştürün. Başlık bilgilerini, taraf vergi kimliklerini (VKN/TCKN), parasal toplamları ve detaylı kalem satırlarını sorunsuzca ayrıştırın.',
    },
    faqItems: [
      {
        question: {
          en: 'Is my XML invoice data uploaded to any external server?',
          tr: 'XML fatura verilerim herhangi bir harici sunucuya yükleniyor mu?',
        },
        answer: {
          en: 'No. The entire parsing process runs 100% client-side in your web browser using JavaScript. No data ever leaves your computer.',
          tr: 'Hayır. Tüm ayrıştırma işlemi JavaScript kullanılarak web tarayıcınızda %100 istemci tarafında çalışır. Hiçbir veri bilgisayarınızdan çıkmaz.',
        },
      },
      {
        question: {
          en: 'Does it support multiple tax subtotals (VAT + Excise Duty)?',
          tr: 'Birden fazla vergi alt toplamını (KDV + ÖTV) destekliyor mu?',
        },
        answer: {
          en: 'Yes. Multiple tax categories per invoice line are consolidated into the "Tax Detail" column.',
          tr: "Evet. Fatura satırı başına birden fazla vergi kategorisi \"Vergi Detayı\" sütununda birleştirilir.",
        },
      },
      {
        question: {
          en: 'Can I batch convert multiple XML invoice files at once?',
          tr: 'Birden fazla XML fatura dosyasını aynı anda toplu dönüştürebilir miyim?',
        },
        answer: {
          en: 'Yes. Drag and drop multiple .xml files into the upload box to consolidate them into a single multi-tab Excel file.',
          tr: 'Evet. Birden fazla .xml dosyasını yükleme kutusuna sürükleyip bırakarak tek bir çok sekmeli Excel dosyasında birleştirebilirsiniz.',
        },
      },
    ],
  },
  {
    slug: 'e-fatura-kdv-detay-raporu',
    title: {
      en: 'e-Fatura VAT & Tax Detail Reporting Tool — Rate and Amount Audit',
      tr: 'e-Fatura KDV ve Vergi Detay Raporlama Aracı — Oran ve Tutar Denetimi',
    },
    metaDescription: {
      en: 'Break down 1%, 10%, 20% VAT and excise duty rates on incoming e-Fatura invoices line by line, and instantly spot tax inconsistencies highlighted in yellow.',
      tr: 'Gelen e-Faturalardaki %1, %10, %20 KDV ve ÖTV oranlarını kalem kalem ayırın, vergi tutarsızlıklarını sarı renkle anında tespit edin.',
    },
    h1: {
      en: 'e-Fatura VAT and Tax Detail Reporting',
      tr: 'e-Fatura KDV ve Vergi Detay Raporlama',
    },
    introText: {
      en: 'In tax audits and VAT refund reports, the accuracy of tax rates and amounts on invoices is critical. This tool reports every VAT and additional tax detail on e-Fatura invoices line by line and automatically audits calculation inconsistencies.',
      tr: 'Vergi denetimlerinde ve KDV iade raporlarında faturalardaki vergi oranlarının ve tutarlarının doğruluğu hayati önem taşır. Bu araç, e-Faturalardaki tüm KDV ve ek vergi detaylarını kalem bazında raporlar ve hesaplama uyumsuzluklarını otomatik denetler.',
    },
    faqItems: [
      {
        question: {
          en: 'How are different VAT rates (1%, 10%, 20%) on the same invoice reported?',
          tr: 'Farklı KDV oranları (%1, %10, %20) aynı faturada nasıl raporlanır?',
        },
        answer: {
          en: 'The tax rates and amounts applied to each line item are shown in detail in the "Tax Detail" column, e.g. "VAT 20%: 300.00 TL | Excise Duty 10%: 150.00 TL".',
          tr: ' "Vergi Detayı" sütununda her kaleme uygulanan vergi oranları ve tutarları "KDV %20: 300.00 TL | ÖTV %10: 150.00 TL" şeklinde ayrıntılı gösterilir.',
        },
      },
      {
        question: {
          en: 'How are incorrect VAT or tax-base calculations spotted?',
          tr: 'Hatalı KDV veya matrah hesaplamaları nasıl fark edilir?',
        },
        answer: {
          en: 'Line items where Quantity × Price ≠ Line Amount are automatically highlighted in yellow.',
          tr: 'Miktar × Fiyat ≠ Satır Tutarı olan hatalı kalemler otomatik olarak sarı renk dolgusu ile işaretlenir.',
        },
      },
      {
        question: {
          en: "Can I see the period's total VAT base in Excel?",
          tr: "Dönemsel KDV matrah toplamını Excel'de görebilir miyim?",
        },
        answer: {
          en: 'You can see the total tax base and VAT amounts in the GRAND TOTAL row on the "Summary" tab.',
          tr: '"Özet" sekmesindeki GENEL TOPLAM satırında toplam matrah ve KDV tutarlarını görebilirsiniz.',
        },
      },
    ],
  },
];
