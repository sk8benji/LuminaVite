/**
 * Quince Rosado Template - Asset Mappings (Canva Replica)
 * Local fallback: /assets/template-quince-rosado/
 * S3 base: https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/quince-rosado/
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/quince-rosado";
const LOCAL_BASE = "/assets/template-quince-rosado";

export const QUINCE_ROSADO_ASSETS = {
  // 1. Intro Envelope Assets
  introEnvelope: `${LOCAL_BASE}/e4ca0a2673c1cf699b20f3467d5369de.png`,
  introRosesBed: `${LOCAL_BASE}/6f1fc511434da9e33fa300257bae0c07.png`,
  introBowRibbon: `${LOCAL_BASE}/7f5113e7055a7531a52e2fdd85c934c1.png`,
  introSeal: `${LOCAL_BASE}/84e4ce995c7a55bfdbc4ea0e0af5e9f4.png`,
  introPolaroidMay: `${LOCAL_BASE}/083dc0c793669d4a4d4a782851e93f65.png`,
  introPolaroidSat: `${LOCAL_BASE}/c0ec302539da1389b4c6b7d0b122ddd7.png`,
  introRoseFlower: `${LOCAL_BASE}/rosa.png`,
  introGlitter: `${LOCAL_BASE}/654465affdf79bbde844dc6643b43181.png`,

  // 2. Hero & Portrait Assets
  heroCloudsBg: `${LOCAL_BASE}/90043c428c5ec72c7adb26dce69dedd2.png`,
  heroGardenBg: `${LOCAL_BASE}/d0a18f8a869419b00c0c5185dc620397.png`,
  heroHorseCutout: `${LOCAL_BASE}/da616fa36a10f18a133b2dc0383a07d0.png`,
  heroHorseArch: `${LOCAL_BASE}/d0a18f8a869419b00c0c5185dc620397.png`,
  heroDateBadge: `${LOCAL_BASE}/39dd6766b16bcd2bafc00b680bd8e5b6.png`,
  heroRoseAccent: `${LOCAL_BASE}/13bac4f00679cd99d51ed2f3d7422432.png`,

  // 3. Dedication & Polaroids
  dedicationGlitter: `${LOCAL_BASE}/654465affdf79bbde844dc6643b43181.png`,
  polaroidDeNina: `${LOCAL_BASE}/083dc0c793669d4a4d4a782851e93f65.png`,
  polaroidASenorita: `${LOCAL_BASE}/c0ec302539da1389b4c6b7d0b122ddd7.png`,

  // 4. RSVP, Dress Code & Regalos
  archCouplePhoto: `${LOCAL_BASE}/4046b1a7e943f6186c4bd79419897578.png`,
  roseDivider: `${LOCAL_BASE}/c6dc4951c49d847e74e0b26dd30c9d2b.png`,
  ornamentBow: `${LOCAL_BASE}/crazonlazo.png`,

  // 5. Timeline / Itinerario Icons
  timelineChurch: `${LOCAL_BASE}/alzado.svg`,
  timelineDinner: `${LOCAL_BASE}/plato.svg`,
  timelineCrown: `${LOCAL_BASE}/corona.png`,
  timelineRose: `${LOCAL_BASE}/13bac4f00679cd99d51ed2f3d7422432.png`,

  // 6. Court of Honor
  courtGroupPhoto: `${LOCAL_BASE}/2ee930ccdb3ae2305fe0c5a6278bfc0d.png`,
  courtDama: `${LOCAL_BASE}/dama.png`,
  crownIcon: `${LOCAL_BASE}/corona.png`,

  // 7. Video & Countdown
  youtubeThumb: `${LOCAL_BASE}/sddefault.webp`,
  calendarHeart: `${LOCAL_BASE}/crazonlazo.png`,

  // S3 Fallbacks
  s3: {
    introEnvelope: `${S3_BASE}/e4ca0a2673c1cf699b20f3467d5369de.png`,
    introRosesBed: `${S3_BASE}/6f1fc511434da9e33fa300257bae0c07.png`,
    introBowRibbon: `${S3_BASE}/7f5113e7055a7531a52e2fdd85c934c1.png`,
    introSeal: `${S3_BASE}/84e4ce995c7a55bfdbc4ea0e0af5e9f4.png`,
    introPolaroidMay: `${S3_BASE}/083dc0c793669d4a4d4a782851e93f65.png`,
    introPolaroidSat: `${S3_BASE}/c0ec302539da1389b4c6b7d0b122ddd7.png`,
    introRoseFlower: `${S3_BASE}/rosa.png`,
    introGlitter: `${S3_BASE}/654465affdf79bbde844dc6643b43181.png`,
    heroCloudsBg: `${S3_BASE}/90043c428c5ec72c7adb26dce69dedd2.png`,
    heroGardenBg: `${S3_BASE}/d0a18f8a869419b00c0c5185dc620397.png`,
    heroHorseCutout: `${S3_BASE}/da616fa36a10f18a133b2dc0383a07d0.png`,
    heroHorseArch: `${S3_BASE}/d0a18f8a869419b00c0c5185dc620397.png`,
    heroDateBadge: `${S3_BASE}/39dd6766b16bcd2bafc00b680bd8e5b6.png`,
    heroRoseAccent: `${S3_BASE}/13bac4f00679cd99d51ed2f3d7422432.png`,
    archCouplePhoto: `${S3_BASE}/4046b1a7e943f6186c4bd79419897578.png`,
    courtGroupPhoto: `${S3_BASE}/2ee930ccdb3ae2305fe0c5a6278bfc0d.png`,
    calendarHeart: `${S3_BASE}/crazonlazo.png`,
    crownIcon: `${S3_BASE}/corona.png`,
  },
};
