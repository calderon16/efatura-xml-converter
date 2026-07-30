import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Generate 1024x1024 App Icon (assets/icon.png)
function createIcon() {
  const size = 1024;
  const png = new PNG({ width: size, height: size });

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Dark Slate/Navy Gradient Background (#0F172A to #1E293B)
      const bgR = 15 + Math.floor((15 * y) / size);
      const bgG = 23 + Math.floor((18 * y) / size);
      const bgB = 42 + Math.floor((17 * y) / size);

      png.data[idx] = bgR;
      png.data[idx + 1] = bgG;
      png.data[idx + 2] = bgB;
      png.data[idx + 3] = 255; // Alpha

      // Rounded Document Sheet Graphics (center box 260..764 x 200..824)
      if (x >= 280 && x <= 744 && y >= 220 && y <= 804) {
        // Folded Top-Right Corner (x > 620 && y < 340)
        if (x > 600 && y < 340 && (x - 600) + (340 - y) > 140) {
          // Darker Fold Shadow
          png.data[idx] = 30;
          png.data[idx + 1] = 41;
          png.data[idx + 2] = 59;
        } else {
          // White Sheet
          png.data[idx] = 255;
          png.data[idx + 1] = 255;
          png.data[idx + 2] = 255;
        }
      }

      // Emerald Green XML Badge (Center 360..664 x 480..620)
      if (x >= 360 && x <= 664 && y >= 480 && y <= 620) {
        png.data[idx] = 16;   // R (#10B981)
        png.data[idx + 1] = 185; // G
        png.data[idx + 2] = 129; // B
      }

      // Blue Header Bar on Sheet (320..580 x 280..340)
      if (x >= 340 && x <= 580 && y >= 280 && y <= 340) {
        png.data[idx] = 37;  // R (#2563EB)
        png.data[idx + 1] = 99;  // G
        png.data[idx + 2] = 235; // B
      }

      // Text Lines on Sheet
      if ((x >= 340 && x <= 680 && y >= 380 && y <= 400) ||
          (x >= 340 && x <= 640 && y >= 420 && y <= 440) ||
          (x >= 340 && x <= 680 && y >= 660 && y <= 680) ||
          (x >= 340 && x <= 580 && y >= 700 && y <= 720)) {
        png.data[idx] = 203; // R (#CBD5E1)
        png.data[idx + 1] = 213;
        png.data[idx + 2] = 225;
      }
    }
  }

  const iconPath = path.join(assetsDir, 'icon.png');
  png.pack().pipe(fs.createWriteStream(iconPath)).on('finish', () => {
    console.log(`✅ Created 1024x1024 app icon at ${iconPath}`);
  });
}

// 2. Generate 2732x2732 Splash Screen (assets/splash.png)
function createSplash() {
  const size = 2732;
  const png = new PNG({ width: size, height: size });

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Dark Navy Background (#0F172A)
      png.data[idx] = 15;
      png.data[idx + 1] = 23;
      png.data[idx + 2] = 42;
      png.data[idx + 3] = 255;

      // Center Icon Emblem (scaled down inside splash screen: center 1066..1666 x 1066..1666)
      if (x >= 1100 && x <= 1632 && y >= 1100 && y <= 1632) {
        // Document Sheet
        if (x >= 1200 && x <= 1532 && y >= 1160 && y <= 1572) {
          png.data[idx] = 255;
          png.data[idx + 1] = 255;
          png.data[idx + 2] = 255;
        }

        // Green XML Badge
        if (x >= 1250 && x <= 1482 && y >= 1340 && y <= 1440) {
          png.data[idx] = 16;
          png.data[idx + 1] = 185;
          png.data[idx + 2] = 129;
        }

        // Blue Bar
        if (x >= 1240 && x <= 1432 && y >= 1200 && y <= 1240) {
          png.data[idx] = 37;
          png.data[idx + 1] = 99;
          png.data[idx + 2] = 235;
        }
      }
    }
  }

  const splashPath = path.join(assetsDir, 'splash.png');
  png.pack().pipe(fs.createWriteStream(splashPath)).on('finish', () => {
    console.log(`✅ Created 2732x2732 splash screen at ${splashPath}`);
  });
}

createIcon();
createSplash();
