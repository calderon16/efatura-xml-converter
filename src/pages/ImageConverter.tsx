import React, { useState, useEffect } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { convertImage, readImageDimensions } from '../utils/imageConverter';
import { saveOrShareFile } from '../utils/nativeDownload';
import { IMAGE_OUTPUT_FORMATS, type ImageOutputFormat } from '../types/image';
import { useTranslation } from '../i18n/LanguageContext';
import { Sparkles, AlertCircle, RotateCcw, Download, ImageIcon, Loader2 } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const ImageConverter: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageOutputFormat>('png');
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = t('image.metaTitle');
  }, [t]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    readImageDimensions(file)
      .then(setDimensions)
      .catch(() => setDimensions(null));
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileSelected = (selected: File) => {
    setErrorMessage(null);
    setFile(selected);
  };

  const handleReset = () => {
    setFile(null);
    setDimensions(null);
    setErrorMessage(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    setErrorMessage(null);
    try {
      const formatMeta = IMAGE_OUTPUT_FORMATS.find((f) => f.value === targetFormat)!;
      const result = await convertImage(file, targetFormat);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      await saveOrShareFile(result.blob, `${baseName}.${formatMeta.ext}`, formatMeta.mime);
    } catch {
      setErrorMessage(t('image.errorConvertFailed'));
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero */}
      {!file && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-semibold text-xs mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('image.heroBadge')}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('image.heroTitle')} <br className="hidden sm:inline" />
            <span className="gradient-text">{t('image.heroTitleAccent')}</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('image.heroSubtitle')}
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">{t('invoice.errorTitle')}</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!file && (
        <ImageUpload onFileSelected={handleFileSelected} onError={(msg) => setErrorMessage(msg)} />
      )}

      {/* Preview + Convert Panel */}
      {file && (
        <div className="w-full max-w-3xl mx-auto my-6 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
            {previewUrl && (
              <img
                src={previewUrl}
                alt={file.name}
                className="w-32 h-32 object-contain rounded-xl border border-slate-200 bg-slate-50 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="font-heading text-base font-bold text-slate-800 truncate">{file.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {formatBytes(file.size)}
                {dimensions ? ` · ${dimensions.width}×${dimensions.height}px` : ''}
              </p>
            </div>
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('image.newUpload')}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="font-heading text-sm font-bold text-slate-800 mb-3">{t('image.targetFormatLabel')}</h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {IMAGE_OUTPUT_FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTargetFormat(f.value)}
                  type="button"
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all border ${
                    targetFormat === f.value
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-900/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleConvert}
              disabled={isConverting}
              type="button"
              className="w-full px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border-t border-white/20"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('image.converting')}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{t('image.convertAndDownload')}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 px-1">
            <ImageIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t('image.privacyNote')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
