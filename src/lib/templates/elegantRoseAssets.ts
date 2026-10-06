/**
 * Elegant Rose Template - Canva Asset Mappings
 * Uploaded to S3: luminavite-storage/templates/elegant-rose/
 * Local fallback: /assets/template-rose/
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/elegant-rose";
const LOCAL_BASE = "/assets/template-rose";

export const ELEGANT_ROSE_ASSETS = {
  // Intro & Hero
  envelope: `${LOCAL_BASE}/cb257414402ef9963727de1a6d13bd5c.png`,
  heroPhoto: `${LOCAL_BASE}/51d8fb6fdca05936497b8c7f02e14280.png`,
  castlePhoto: `${LOCAL_BASE}/5f24871f73b9424764387ef47bb5723e.png`,
  crown: `${LOCAL_BASE}/ba47feef59edd928b7c840eae54838b3.png`,
  rosesBg: `${LOCAL_BASE}/c8005962c2f1a9e3456d560da50c4ec8.jpg`,
  peachBg: `${LOCAL_BASE}/08c973400ebfcfa800c016bf24608480.jpg`,
  bouquetBg: `${LOCAL_BASE}/9ef042dcf0eb2ae4150fe4aa7209e94d.jpg`,
  petalsBg: `${LOCAL_BASE}/93b6ed5bbc58b2a22d52ae7baa96db41.jpg`,
  frostedBlurStrip: `${LOCAL_BASE}/339872b4722f5715a436439eedbd3ab5.png`,
  polaroidFrame: `${LOCAL_BASE}/7682b88019dfb1b516da808e76e036cf.png`,

  // Childhood photos
  growingBaby: `${LOCAL_BASE}/722d78548334333072ad7200e4f8233e.jpg`,
  growingChild: `${LOCAL_BASE}/94a9fcddf0e62c3f0ffe60a5a769dd9c.jpg`,
  growingPreteen: `${LOCAL_BASE}/97da854ac288883d24133acda9d854ca.jpg`,
  growingCompanion: `${LOCAL_BASE}/39e6d693ec9d82a484d96df04a0cffd3.jpg`,

  // Icons & Graphics
  dressIcon: `${LOCAL_BASE}/bb7e37fcad91b7ee125ccddd0df6dab7.png`,
  churchIcon: `${LOCAL_BASE}/9f363120d7cbdd81131ec2cf9373bd8f.png`,
  ballroomIcon: `${LOCAL_BASE}/7d51cb4f0dc96e48cac1e7be4e83e779.png`,
  waltzIcon: `${LOCAL_BASE}/ed9f319d33dbef42e1b752f9027fb93c.png`,
  giftIcon: `${LOCAL_BASE}/de72738875d848a46a2c4e1a8931d762.png`,
  musicIcon: `${LOCAL_BASE}/a46eef2ee11437351260db2b11329d5f.png`,
  dressIllustration: `${LOCAL_BASE}/4572e5907853f1b57bff933cb6e7a290.png`,
  churchLineArt: `${LOCAL_BASE}/af83d82cab6035b2ee4b0332c859d0c0.svg`,
  goldDividerLine: `${LOCAL_BASE}/2df593bad37a4b39e6c71ec343140580.svg`,
  goldVerticalDivider: `${LOCAL_BASE}/8dac8a2cd89a018b17cba1ecb1e05aa9.svg`,
  mapsPillSvg: `${LOCAL_BASE}/ad98f8c81954215c672fed391be955e7.svg`,
  crownHeader: `${LOCAL_BASE}/94a4c1e3ef77b43e763f0b204204421e.png`,
  coupleIcon: `${LOCAL_BASE}/de72738875d848a46a2c4e1a8931d762.png`,
  sparkleDust: `${LOCAL_BASE}/353f99381a7024374ff5e3aaece4b340.png`,
  heartDivider: `${LOCAL_BASE}/c73a3cffbcfac02ed98b6abb9fd52d59.png`,
  ornamentDivider: `${LOCAL_BASE}/6b9e2419d8ca9275e8034c8a462af1a9.png`,
  pillBadge: `${LOCAL_BASE}/c73a3cffbcfac02ed98b6abb9fd52d59.png`,
  bannerArch: `${LOCAL_BASE}/8363410b9d8456a8daaa432fd01a5df0.png`,

  // Court portraits
  court1: `${LOCAL_BASE}/12f3e43616a6eeda6b9cb61559093fc2.png`,
  court2: `${LOCAL_BASE}/3b991404535b158d8e0cd33552d82cce.png`,
  court3: `${LOCAL_BASE}/67e2e77811d733e09c2082f1e0a154df.png`,
  court4: `${LOCAL_BASE}/6dea3a02873c16e6a3a380baca819523.png`,
  court5: `${LOCAL_BASE}/782f8c059c42c4d3ca4de09daf91f60a.png`,
  court6: `${LOCAL_BASE}/cda76beafb9216f45e4327ca159aa41e.png`,

  // S3 full URLs helper
  s3: {
    envelope: `${S3_BASE}/cb257414402ef9963727de1a6d13bd5c.png`,
    heroPhoto: `${S3_BASE}/51d8fb6fdca05936497b8c7f02e14280.png`,
    castlePhoto: `${S3_BASE}/5f24871f73b9424764387ef47bb5723e.png`,
    crown: `${S3_BASE}/ba47feef59edd928b7c840eae54838b3.png`,
    rosesBg: `${S3_BASE}/c8005962c2f1a9e3456d560da50c4ec8.jpg`,
    polaroidFrame: `${S3_BASE}/7682b88019dfb1b516da808e76e036cf.png`,
    growingBaby: `${S3_BASE}/722d78548334333072ad7200e4f8233e.jpg`,
    growingChild: `${S3_BASE}/94a9fcddf0e62c3f0ffe60a5a769dd9c.jpg`,
    growingPreteen: `${S3_BASE}/97da854ac288883d24133acda9d854ca.jpg`,
    growingCompanion: `${S3_BASE}/39e6d693ec9d82a484d96df04a0cffd3.jpg`,
    dressIcon: `${S3_BASE}/bb7e37fcad91b7ee125ccddd0df6dab7.png`,
    churchIcon: `${S3_BASE}/9f363120d7cbdd81131ec2cf9373bd8f.png`,
    ballroomIcon: `${S3_BASE}/7d51cb4f0dc96e48cac1e7be4e83e779.png`,
    waltzIcon: `${S3_BASE}/ed9f319d33dbef42e1b752f9027fb93c.png`,
    giftIcon: `${S3_BASE}/de72738875d848a46a2c4e1a8931d762.png`,
    musicIcon: `${S3_BASE}/a46eef2ee11437351260db2b11329d5f.png`,
    dressIllustration: `${S3_BASE}/4572e5907853f1b57bff933cb6e7a290.png`,
    churchLineArt: `${S3_BASE}/af83d82cab6035b2ee4b0332c859d0c0.svg`,
    goldDividerLine: `${S3_BASE}/2df593bad37a4b39e6c71ec343140580.svg`,
    goldVerticalDivider: `${S3_BASE}/8dac8a2cd89a018b17cba1ecb1e05aa9.svg`,
    mapsPillSvg: `${S3_BASE}/ad98f8c81954215c672fed391be955e7.svg`,
    crownHeader: `${S3_BASE}/94a4c1e3ef77b43e763f0b204204421e.png`,
    coupleIcon: `${S3_BASE}/de72738875d848a46a2c4e1a8931d762.png`,
    sparkleDust: `${S3_BASE}/353f99381a7024374ff5e3aaece4b340.png`,
    frostedBlurStrip: `${S3_BASE}/339872b4722f5715a436439eedbd3ab5.png`,
  }
};
