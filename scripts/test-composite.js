const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testPerfectAlignment() {
  const f1 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792046321783_9b31a037.jpg';
  const f2 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792046347377_11778fb8.jpg';
  const outDir = path.join(__dirname, '../public/assets/sobre-rosa');

  const f1Raw = await sharp(f1).raw().toBuffer({ resolveWithObject: true });
  const w1 = f1Raw.info.width, h1 = f1Raw.info.height;
  const envX = 66, envY = 169, envW = 891, envH = 680;

  // 1. Defringed & perfectly cropped flap from f2
  const f2Raw = await sharp(f2).raw().toBuffer({ resolveWithObject: true });
  const w2 = f2Raw.info.width, h2 = f2Raw.info.height;
  
  const flapX = 76;
  const flapY = 262;
  const flapW = 945 - 76; // 869
  const flapH = 898 - 262; // 636

  const flapRgba = Buffer.alloc(flapW * flapH * 4);
  for (let y = 0; y < flapH; y++) {
    for (let x = 0; x < flapW; x++) {
      const srcIdx = ((flapY + y) * w2 + (flapX + x)) * 3;
      const dstIdx = (y * flapW + x) * 4;
      let r = f2Raw.data[srcIdx], g = f2Raw.data[srcIdx+1], b = f2Raw.data[srcIdx+2];
      
      const brightness = (r + g + b) / 3;
      // Exact alpha estimation against pure white (255, 255, 255)
      // Pink paper is around rgb(225, 192, 185) => brightness ~ 200
      let alpha = 1;
      if (brightness > 248 && Math.abs(r-g) < 8 && Math.abs(r-b) < 8) {
        alpha = 0;
      } else if (brightness > 210 && Math.abs(r-g) < 12 && Math.abs(r-b) < 12) {
        alpha = Math.max(0, Math.min(1, (250 - brightness) / 38));
        // Defringe color: recover original color by removing white background
        r = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - alpha)) / alpha)));
        g = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - alpha)) / alpha)));
        b = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - alpha)) / alpha)));
      }

      flapRgba[dstIdx] = r;
      flapRgba[dstIdx+1] = g;
      flapRgba[dstIdx+2] = b;
      flapRgba[dstIdx+3] = Math.round(alpha * 255);
    }
  }

  await sharp(flapRgba, { raw: { width: flapW, height: flapH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'solapa.png'));

  // 2. Front pocket with full side borders up to the top!
  const frontRgba = Buffer.alloc(envW * envH * 4);
  const centerX = 445;
  const centerBottomY = 485;

  for (let y = 0; y < envH; y++) {
    for (let x = 0; x < envW; x++) {
      const srcX = envX + x;
      const srcY = envY + y;
      const dstIdx = (y * envW + x) * 4;

      let r = f1Raw.data[(srcY * w1 + srcX) * 3];
      let g = f1Raw.data[(srcY * w1 + srcX) * 3 + 1];
      let b = f1Raw.data[(srcY * w1 + srcX) * 3 + 2];

      const distFromCenter = Math.abs(x - centerX);
      // V-neck cut:
      // At sides (x < 130 or x > envW - 130), pocket stays solid all the way up to y = 60!
      // In between, V cutout goes down to centerBottomY
      const isSideBorder = (x < 140 || x > envW - 140);
      const vTop = centerBottomY - (distFromCenter / (envW / 2)) * 390;

      const isChecker = (Math.abs(r - g) < 8 && Math.abs(r - b) < 8) && ((r >= 190 && r <= 208) || (r >= 245));
      const inSealShadow = (Math.sqrt(Math.pow(x - 452, 2) + Math.pow(y - 431, 2)) < 110);

      const isTransparent = isChecker || (!isSideBorder && y < vTop) || (isSideBorder && y < 40);

      if (isTransparent) {
        frontRgba[dstIdx+3] = 0;
      } else {
        if (inSealShadow) {
          const sX = 320 + ((x * 7 + y * 3) % 40);
          const sY = 700 + ((y * 11 + x * 5) % 40);
          r = f1Raw.data[(sY * w1 + sX) * 3];
          g = f1Raw.data[(sY * w1 + sX) * 3 + 1];
          b = f1Raw.data[(sY * w1 + sX) * 3 + 2];
        }

        frontRgba[dstIdx] = r;
        frontRgba[dstIdx+1] = g;
        frontRgba[dstIdx+2] = b;
        frontRgba[dstIdx+3] = 255;
      }
    }
  }

  await sharp(frontRgba, { raw: { width: envW, height: envH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'bolsillo-frontal.png'));

  // 3. Composite test again
  await sharp(path.join(outDir, 'fondo-interior.png'))
    .composite([
      { input: path.join(outDir, 'bolsillo-frontal.png'), top: 0, left: 0 },
      { input: path.join(outDir, 'solapa.png'), top: 0, left: 11 },
      { input: path.join(outDir, 'sello-azul.png'), top: Math.round(431 - 186/2), left: Math.round(445 - 186/2) }
    ])
    .png()
    .toFile(path.join(__dirname, '../tmp_envelope/composite_closed_v2.png'));

  console.log('composite_closed_v2.png created');
}

testPerfectAlignment().catch(console.error);
