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

  await sharp(A('logo-source.png'))
    .png()
    .toFile(A('logo.png'));
  console.log('OK logo.png');

  const logo = await sharp(A('logo-source.png'))
    .resize(300, 300, { fit: 'inside' })
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