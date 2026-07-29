import React from 'react';
import type { FaqItem } from '../data/seoPages';

interface JsonLdFaqProps {
  faqItems: FaqItem[];
}

export const JsonLdFaq: React.FC<JsonLdFaqProps> = ({ faqItems }) => {
  if (!faqItems || faqItems.length === 0) return null;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
