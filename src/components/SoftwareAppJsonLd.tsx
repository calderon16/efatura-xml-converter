import React from 'react';
import { safeJsonLdString } from '../utils/safeJsonLd';

interface SoftwareAppJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export const SoftwareAppJsonLd: React.FC<SoftwareAppJsonLdProps> = ({
  name,
  description,
  url,
}) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdString(schemaData) }}
    />
  );
};
