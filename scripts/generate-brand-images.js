// Usage: node scripts/generate-brand-images.js
// Requires sharp, which is not a dependency — install without saving:
//   npm install --no-save sharp
const sharp = require('sharp');
const path = require('path');

const A = (f) => path.join(__dirname, '..', 'assets', f);
const BLUE = { r: 47, g: 160, b: 217, alpha: 1 };

async function main() {
  await sharp(A('icon-source.png'))
    .resize(1024, 1024)
    .png()
    .toFile(A('icon.png'));
  console.log('OK icon.png 1024x1024');

  const inner = Math.round(1024 * 0.66);
  const innerBuf = await sharp(A('icon-source.png'))
    .resize(inner, inner)
    .toBuffer();
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BLUE } })
    .png()
    .composite([{ input: innerBuf, gravity: 'centre' }])
    .toFile(A('adaptive-icon-foreground.png'));
  console.log('OK adaptive-icon-foreground.png (safe zone 66%)');

  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BLUE } })
    .png()
    .toFile(A('adaptive-icon-background.png'));
  console.log('OK adaptive-icon-background.png #2FA0D9');

  // Monochrome layer (issue #22): Android 13+ themed icons read only the
  // alpha channel, so the letters must BE the alpha channel — white source
  // pixels -> 255, blue background -> 0. Result: a black "YT" silhouette on
  // a transparent canvas, centred in the same 66% safe zone.
  // 1-band mask: white letters -> 255, blue background -> 0
  const alpha = await sharp(A('icon-source.png'))
    .resize(inner, inner)
    .greyscale()
    .threshold(200)
    .toColourspace('b-w')
    .raw()
    .toBuffer();
  // black pixels, letters carried by the alpha channel
  const glyph = await sharp({
    create: { width: inner, height: inner, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .joinChannel(alpha, { raw: { width: inner, height: inner, channels: 1 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: glyph, gravity: 'centre' }])
    .png()
    .toFile(A('adaptive-icon-monochrome.png'));
  console.log('OK adaptive-icon-monochrome.png (alpha mask, safe zone 66%)');

  await sharp(A('logo-source.png'))
    .png()
    .toFile(A('logo.png'));
  console.log('OK logo.png');

  // Banner logo (issue #21): text-free mark (icon-source.png), masked into a
  // circle so the square corners no longer stick out of the white r=170 circle.
  const size = 300;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
  const logo = await sharp(A('icon-source.png'))
    .resize(size, size, { fit: 'inside' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const svg = Buffer.from(`
<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="500" fill="#2FA0D9"/>
  <circle cx="512" cy="200" r="170" fill="#ffffff"/>
  <text x="512" y="450" font-family="Arial, Helvetica, sans-serif"
        font-size="92" font-weight="bold" fill="#ffffff"
        text-anchor="middle">Ykjam Terjime</text>
</svg>`);
  await sharp(svg)
    .composite([{ input: logo, top: 50, left: 362 }])
    .png()
    .toFile(A('feature-graphic.png'));
  console.log('OK feature-graphic.png 1024x500');

  console.log('All brand images generated!');
}

main().catch((e) => { console.error(e); process.exit(1); });