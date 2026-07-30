import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { saveAs } from 'file-saver';

/**
 * Universal file save / share function supporting both Web (Blob download) 
 * and Native Android/iOS (Filesystem write + System Share Sheet).
 */
export async function saveOrShareFile(
  fileData: Blob | string,
  fileName: string,
  _mimeType: string
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      let base64Data: string;

      if (typeof fileData === 'string') {
        base64Data = btoa(unescape(encodeURIComponent(fileData)));
      } else {
        base64Data = await blobToBase64(fileData);
      }

      // Write file to native cache directory
      const fileResult = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Open native Share Sheet
      await Share.share({
        title: fileName,
        text: `${fileName} hazır. Paylaşmak veya kaydetmek için bir uygulama seçin.`,
        url: fileResult.uri,
        dialogTitle: `${fileName} Paylaş`,
      });
    } catch (err) {
      console.error('Native file save/share failed, falling back to web download:', err);
      fallbackWebSave(fileData, fileName);
    }
  } else {
    fallbackWebSave(fileData, fileName);
  }
}

function fallbackWebSave(fileData: Blob | string, fileName: string): void {
  if (typeof fileData === 'string') {
    const blob = new Blob([fileData], { type: 'application/json;charset=utf-8' });
    saveAs(blob, fileName);
  } else {
    saveAs(fileData, fileName);
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}
