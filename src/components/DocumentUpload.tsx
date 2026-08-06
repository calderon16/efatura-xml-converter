import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface DocumentUploadProps {
  /** e.g. ".xlsx,.pdf,.docx" — passed straight to the native file input's accept attribute. */
  accept: string;
  /** Lowercase extensions without the dot, e.g. ['xlsx', 'pdf', 'docx']. */
  acceptedExtensions: string[];
  onFileSelected: (file: File) => void;
  onError: (errorMessage: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  accept,
  acceptedExtensions,
  onFileSelected,
  onError,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (fileList: FileList | File[]) => {
    const file = Array.from(fileList)[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !acceptedExtensions.includes(extension)) {
      onError(t('documentUpload.errorUnsupported', { formats: acceptedExtensions.join(', ') }));
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 md:p-12 text-center flex flex-col items-center justify-center group ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01] shadow-lg shadow-emerald-500/10'
            : 'border-blue-200 bg-white hover:border-emerald-400 hover:bg-slate-50/60 shadow-sm'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
        />

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
            isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-900/10 text-blue-900 group-hover:bg-emerald-50 group-hover:text-emerald-600'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="font-heading text-lg md:text-xl font-bold text-slate-800 mb-2">
          {t('documentUpload.title')}
        </h3>

        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {t('documentUpload.subtitle')} (<code className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">{acceptedExtensions.map((e) => `.${e}`).join(' ')}</code>)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 border-t border-white/20"
          >
            <FileText className="w-4 h-4" />
            <span>{t('documentUpload.selectButton')}</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t('documentUpload.note')}</span>
        </div>
      </div>
    </div>
  );
};
