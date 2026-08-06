import type { ConvertedImageResult, ImageOutputFormat } from '../types/image';

// Rasterizes any browser-loadable image (PNG/JPG/WebP/SVG) onto a canvas and re-encodes it to the
// target format. Pure Canvas API — no dependency, nothing leaves the browser. JPEG has no alpha
// channel, so we fill a white background first (matches standard converter behavior; otherwise
// transparent pixels turn black in most encoders).
export function convertImage(
  file: File,
  targetFormat: ImageOutputFormat,
  quality = 0.92
): Promise<ConvertedImageResult> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      // Some SVGs report 0 for naturalWidth/Height when they have no explicit width/height
      // attribute (only a viewBox) — fall back to a reasonable default rather than producing an
      // empty canvas.
      const width = img.naturalWidth || 800;
      const height = img.naturalHeight || 600;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error('Image encoding failed'));
            return;
          }
          resolve({ blob, width, height });
        },
        `image/${targetFormat}`,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth || 0, height: img.naturalHeight || 0 });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}
