const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildRealisticAssets() {
  const f1 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792047569998_0d26c46a.jpg'; // or original f1
  const origF1 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792046321783_9b31a037.jpg';
  const origF2 = 'C:/Users/sk8be/.gemini/antigravity/brain/f9a94c02-25c7-4a67-8cf1-dc6aa6b13a96/.user_uploaded/media_1792046347377_11778fb8.jpg';
  const outDir = path.join(__dirname, '../public/assets/sobre-rosa');

  const f1Raw = await sharp(origF1).raw().toBuffer({ resolveWithObject: true });
  const w1 = f1Raw.info.width, h1 = f1Raw.info.height;
  const envX = 66, envY = 169, envW = 891, envH = 680;

  // 1. REBUILD BOLSILLO-FRONTAL.PNG
  // Continuous smooth V:
  // (0, 310) -> (445, 450) -> (891, 310)
  // Slope = (450 - 310) / 445 = 140 / 445 = 0.3146
  const frontRgba = Buffer.alloc(envW * envH * 4);
  const centerX = 445;
  const centerV = 450;
  const slope = (450 - 310) / 445;

  for (let y = 0; y < envH; y++) {
    for (let x = 0; x < envW; x++) {
      const srcX = envX + x;
      const srcY = envY + y;
      const dstIdx = (y * envW + x) * 4;

      let r = f1Raw.data[(srcY * w1 + srcX) * 3];
      let g = f1Raw.data[(srcY * w1 + srcX) * 3 + 1];
      let b = f1Raw.data[(srcY * w1 + srcX) * 3 + 2];

      const vTop = centerV - Math.abs(x - centerX) * slope;

      const isChecker = (Math.abs(r - g) < 8 && Math.abs(r - b) < 8) && ((r >= 190 && r <= 208) || (r >= 245));
      const inSealShadow = (Math.sqrt(Math.pow(x - 452, 2) + Math.pow(y - 431, 2)) < 110);

      // Smooth anti-aliased edge along vTop
      const distToV = y - vTop;

      if (isChecker || distToV < -1) {
        frontRgba[dstIdx+3] = 0;
      } else {
        if (inSealShadow) {
          const sX = 320 + ((x * 7 + y * 3) % 40);
          const sY = 700 + ((y * 11 + x * 5) % 40);
          r = f1Raw.data[(sY * w1 + sX) * 3];
          g = f1Raw.data[(sY * w1 + sX) * 3 + 1];
          b = f1Raw.data[(sY * w1 + sX) * 3 + 2];
        }

        let alpha = 255;
        if (distToV >= -1 && distToV < 1) {
          alpha = Math.round((distToV + 1) / 2 * 255);
        }

        frontRgba[dstIdx] = r;
        frontRgba[dstIdx+1] = g;
        frontRgba[dstIdx+2] = b;
        frontRgba[dstIdx+3] = alpha;
      }
    }
  }

  await sharp(frontRgba, { raw: { width: envW, height: envH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'bolsillo-frontal.png'));
  console.log('Saved bolsillo-frontal.png');

  // 2. BUILD SOLAPA-INTERIOR.PNG
  // From origF2: We get the exact flap silhouette, but fill it with plain pink paper texture
  // and an inner shadow along the edges (matching the 3D render in reference image!)
  const f2Raw = await sharp(origF2).raw().toBuffer({ resolveWithObject: true });
  const w2 = f2Raw.info.width, h2 = f2Raw.info.height;
  const flapX = 76, flapY = 262, flapW = 945 - 76, flapH = 898 - 262;

  const interiorRgba = Buffer.alloc(flapW * flapH * 4);

  for (let y = 0; y < flapH; y++) {
    for (let x = 0; x < flapW; x++) {
      const srcIdx = ((flapY + y) * w2 + (flapX + x)) * 3;
      const dstIdx = (y * flapW + x) * 4;
      const rOrig = f2Raw.data[srcIdx], gOrig = f2Raw.data[srcIdx+1], bOrig = f2Raw.data[srcIdx+2];

      const brightness = (rOrig + gOrig + bOrig) / 3;
      let alpha = 1;
      if (brightness > 248 && Math.abs(rOrig-gOrig) < 8 && Math.abs(rOrig-bOrig) < 8) {
        alpha = 0;
      } else if (brightness > 210 && Math.abs(rOrig-gOrig) < 12 && Math.abs(rOrig-bOrig) < 12) {
        alpha = Math.max(0, Math.min(1, (250 - brightness) / 38));
      }

      if (alpha === 0) {
        interiorRgba[dstIdx+3] = 0;
      } else {
        // Plain pink textured paper sampled from clean region
        const sX = 320 + ((x * 11 + y * 7) % 40);
        const sY = 700 + ((y * 13 + x * 5) % 40);
        let r = f1Raw.data[(sY * w1 + sX) * 3];
        let g = f1Raw.data[(sY * w1 + sX) * 3 + 1];
        let b = f1Raw.data[(sY * w1 + sX) * 3 + 2];

        // Add subtle 3D inner fold shadow:
        // Triangle center is flapW / 2 = 434.5.
        // Left diagonal: from (0, 0) to (434.5, flapH)
        // Right diagonal: from (flapW, 0) to (434.5, flapH)
        // Distance to diagonal edges:
        const distFromCenter = Math.abs(x - flapW / 2);
        const expectedY = (distFromCenter / (flapW / 2)) * flapH;
        // Edge bevel shadow (near the diagonal borders)
        const edgeDist = Math.abs(y - (flapH - expectedY));
        let shadow = 1.0;
        if (edgeDist < 35) {
          shadow = 0.88 + 0.12 * (edgeDist / 35);
        }
        // Base fold shadow near top hinge (y < 40)
        if (y < 40) {
          shadow *= (0.85 + 0.15 * (y / 40));
        }

        interiorRgba[dstIdx] = Math.round(r * shadow);
        interiorRgba[dstIdx+1] = Math.round(g * shadow);
        interiorRgba[dstIdx+2] = Math.round(b * shadow);
        interiorRgba[dstIdx+3] = Math.round(alpha * 255);
      }
    }
  }

  await sharp(interiorRgba, { raw: { width: flapW, height: flapH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'solapa-interior.png'));
  console.log('Saved solapa-interior.png');
}

buildRealisticAssets().catch(console.error);
