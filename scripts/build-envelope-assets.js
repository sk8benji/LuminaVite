const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildFinalAssets() {
  const f1 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792046321783_9b31a037.jpg';
  const f2 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792046347377_11778fb8.jpg';
  const outDir = path.join(__dirname, 'public/assets/sobre-rosa');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. SOLAPA.PNG
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
      const r = f2Raw.data[srcIdx], g = f2Raw.data[srcIdx+1], b = f2Raw.data[srcIdx+2];
      flapRgba[dstIdx] = r;
      flapRgba[dstIdx+1] = g;
      flapRgba[dstIdx+2] = b;
      
      const brightness = (r + g + b) / 3;
      if (brightness > 248 && Math.abs(r-g) < 10 && Math.abs(r-b) < 10) {
        flapRgba[dstIdx+3] = 0;
      } else if (brightness > 232 && Math.abs(r-g) < 10 && Math.abs(r-b) < 10) {
        flapRgba[dstIdx+3] = Math.max(0, Math.min(255, Math.round((248 - brightness) / 16 * 255)));
      } else {
        flapRgba[dstIdx+3] = 255;
      }
    }
  }

  await sharp(flapRgba, { raw: { width: flapW, height: flapH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'solapa.png'));
  console.log('Saved solapa.png');

  // 2. SELLO-AZUL.PNG
  const f1Raw = await sharp(f1).raw().toBuffer({ resolveWithObject: true });
  const w1 = f1Raw.info.width, h1 = f1Raw.info.height;

  const sealSize = 186;
  const sealStartX = 518 - Math.floor(sealSize / 2);
  const sealStartY = 600 - Math.floor(sealSize / 2);
  const sealRgba = Buffer.alloc(sealSize * sealSize * 4);

  for (let y = 0; y < sealSize; y++) {
    for (let x = 0; x < sealSize; x++) {
      const srcIdx = ((sealStartY + y) * w1 + (sealStartX + x)) * 3;
      const dstIdx = (y * sealSize + x) * 4;
      const r = f1Raw.data[srcIdx], g = f1Raw.data[srcIdx+1], b = f1Raw.data[srcIdx+2];
      
      const dx = x - sealSize / 2;
      const dy = y - sealSize / 2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      sealRgba[dstIdx] = r;
      sealRgba[dstIdx+1] = g;
      sealRgba[dstIdx+2] = b;

      if (dist > 88) {
        sealRgba[dstIdx+3] = 0;
      } else if (dist > 84) {
        sealRgba[dstIdx+3] = Math.round((88 - dist) / 4 * 255);
      } else {
        sealRgba[dstIdx+3] = 255;
      }
    }
  }

  await sharp(sealRgba, { raw: { width: sealSize, height: sealSize, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'sello-azul.png'));
  console.log('Saved sello-azul.png');

  // 3. BOLSILLO-FRONTAL.PNG
  const envX = 66, envY = 169, envW = 891, envH = 680;
  const frontRgba = Buffer.alloc(envW * envH * 4);
  const centerX = 445;
  const centerBottomY = 490;

  for (let y = 0; y < envH; y++) {
    for (let x = 0; x < envW; x++) {
      const srcX = envX + x;
      const srcY = envY + y;
      const dstIdx = (y * envW + x) * 4;

      let r = f1Raw.data[(srcY * w1 + srcX) * 3];
      let g = f1Raw.data[(srcY * w1 + srcX) * 3 + 1];
      let b = f1Raw.data[(srcY * w1 + srcX) * 3 + 2];

      const distFromCenter = Math.abs(x - centerX);
      const vTop = centerBottomY - distFromCenter * 0.635;

      const isChecker = (Math.abs(r - g) < 8 && Math.abs(r - b) < 8) && ((r >= 190 && r <= 208) || (r >= 245));
      const inSealShadow = (Math.sqrt(Math.pow(x - 452, 2) + Math.pow(y - 431, 2)) < 110);

      if (isChecker || y < vTop) {
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
  console.log('Saved bolsillo-frontal.png');

  // 4. FONDO-INTERIOR.PNG
  const backRgba = Buffer.alloc(envW * envH * 4);
  for (let y = 0; y < envH; y++) {
    for (let x = 0; x < envW; x++) {
      const dstIdx = (y * envW + x) * 4;
      const sX = 320 + ((x * 13 + y * 7) % 40);
      const sY = 700 + ((y * 17 + x * 11) % 40);
      let r = f1Raw.data[(sY * w1 + sX) * 3];
      let g = f1Raw.data[(sY * w1 + sX) * 3 + 1];
      let b = f1Raw.data[(sY * w1 + sX) * 3 + 2];

      const vignette = 0.94 - 0.12 * Math.pow((y / envH), 0.5);
      backRgba[dstIdx] = Math.round(r * vignette);
      backRgba[dstIdx+1] = Math.round(g * vignette);
      backRgba[dstIdx+2] = Math.round(b * vignette);
      backRgba[dstIdx+3] = 255;
    }
  }

  await sharp(backRgba, { raw: { width: envW, height: envH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'fondo-interior.png'));
  console.log('Saved fondo-interior.png');
}

buildFinalAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
