export type ImageOutputFormat = 'png' | 'jpeg' | 'webp';

export interface ImageFormatOption {
  value: ImageOutputFormat;
  label: string;
  ext: string;
  mime: string;
}

export const IMAGE_OUTPUT_FORMATS: ImageFormatOption[] = [
  { value: 'png', label: 'PNG', ext: 'png', mime: 'image/png' },
  { value: 'jpeg', label: 'JPG', ext: 'jpg', mime: 'image/jpeg' },
  { value: 'webp', label: 'WebP', ext: 'webp', mime: 'image/webp' },
];

export interface ConvertedImageResult {
  blob: Blob;
  width: number;
  height: number;
}
