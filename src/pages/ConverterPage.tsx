import React, { useEffect, useState } from 'react';
import { ModeToggle, type ConverterMode } from '../components/ModeToggle';
import { InvoiceConverter } from './InvoiceConverter';
import { GeneralXmlConverter } from './GeneralXmlConverter';
import { PopularSearches } from '../components/PopularSearches';
import { RelatedTools } from '../components/RelatedTools';

interface ConverterPageProps {
  onNavigateSlug?: (slug: string) => void;
}

export const ConverterPage: React.FC<ConverterPageProps> = ({ onNavigateSlug }) => {
  const [mode, setMode] = useState<ConverterMode>('invoice');

  useEffect(() => {
    document.title =
      mode === 'general'
        ? 'SchemaFlow — Convert Any XML File to Excel, CSV or PDF'
        : 'SchemaFlow — e-Fatura (UBL-TR) XML to Excel Converter';
  }, [mode]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-center mb-2">
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === 'invoice' ? <InvoiceConverter /> : <GeneralXmlConverter />}

      <PopularSearches onNavigateSlug={onNavigateSlug} />
      <RelatedTools onNavigateSlug={onNavigateSlug} />
    </div>
  );
};
