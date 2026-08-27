const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assets', 'adaptive-icon-monochrome.png');
const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

const SIZES = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };

(async () => {
  for (const [dpi, size] of Object.entries(SIZES)) {
    const out = path.join(RES, `mipmap-${dpi}`, 'ic_launcher_monochrome.webp');
    await sharp(SRC).resize(size, size).png().toFile(out);
    console.log('OK', dpi, size + 'x' + size);
  }
})();