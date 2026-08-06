import React from 'react';
import type { LocalizedString } from '../types/i18nContent';
import type { Lang } from '../i18n/LanguageContext';
import { safeJsonLdString } from '../utils/safeJsonLd';

interface LocalizedFaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

interface JsonLdFaqProps {
  faqItems: LocalizedFaqItem[];
  lang: Lang;
}

export const JsonLdFaq: React.FC<JsonLdFaqProps> = ({ faqItems, lang }) => {
  if (!faqItems || faqItems.length === 0) return null;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question[lang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer[lang],
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdString(schemaData) }}
    />
  );
};
