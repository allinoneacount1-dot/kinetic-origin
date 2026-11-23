export interface PourStage {
  name: string;
  durationSec: number;
  targetRatioPct: number;
  note: string;
}

export interface BrewPreset {
  id: string;
  name: string;
  brewer: string;
  doseG: number;
  ratio: number;
  tempC: number;
  grindMicrons: number;
  description: string;
  stages: PourStage[];
}

export type ProcessType = 'Washed' | 'Honey' | 'Natural' | 'Anaerobic';
export type GrindOption = 'Whole Bean' | 'Pour-Over' | 'Espresso';

export interface MicroLot {
  id: string;
  name: string;
  region: string;
  elevationM: number;
  process: ProcessType;
  varietal: string;
  roastLevel: string;
  roastDate: string;
  cuppingScore: number;
  priceIdr: number;
  weightG: number;
  tastingNotes: string[];
  story: string;
  image: string;
  recommendedPresetId: string;
  sensory: {
    acidity: number;
    sweetness: number;
    body: number;
    clarity: number;
    finish: number;
  };
}

export interface TerroirOrigin {
  id: string;
  name: string;
  coordinates: string;
  elevation: string;
  rainfall: string;
  soil: string;
  varietals: string;
  cuppingAvg: string;
  narrative: string;
  image: string;
}

export interface CuppingSessionType {
  id: string;
  title: string;
  duration: string;
  pricePerGuest: number;
  summary: string;
  includes: string[];
}

export const BREW_PRESETS: BrewPreset[] = [
  {
    id: 'v60-clarity',
    name: 'V60 Clarity',
    brewer: 'Hario V60 02',
    doseG: 15,
    ratio: 16,
    tempC: 92,
    grindMicrons: 620,
    description: 'High-clarity spiral pours highlighting floral bergamot and stone-fruit acidity.',
    stages: [
      { name: 'Bloom', durationSec: 40, targetRatioPct: 0.2, note: 'Gentle center-out saturation, slight swirl.' },
      { name: 'First Pour', durationSec: 45, targetRatioPct: 0.6, note: 'Steady laminar spiral at 5 ml/s.' },
      { name: 'Second Pour', durationSec: 40, targetRatioPct: 1.0, note: 'Center pulse pour to keep bed flat.' },
      { name: 'Drawdown', durationSec: 45, targetRatioPct: 1.0, note: 'One gentle Rao spin; let gravity finish.' },
    ],
  },
  {
    id: 'origami-sweet',
    name: 'Origami Sweet',
    brewer: 'Origami Air + Wave',
    doseG: 16,
    ratio: 15.5,
    tempC: 91,
    grindMicrons: 580,
    description: 'Flat-bottom ribs accentuate syrupy cane sweetness and silky cocoa finish.',
    stages: [
      { name: 'Bloom', durationSec: 45, targetRatioPct: 0.22, note: 'Even saturation across flat filter bed.' },
      { name: 'Sweetness Pulse', durationSec: 45, targetRatioPct: 0.65, note: 'Slow concentric circles from center.' },
      { name: 'Final Structure', durationSec: 35, targetRatioPct: 1.0, note: 'Low-agitation pour near surface.' },
      { name: 'Drawdown', durationSec: 45, targetRatioPct: 1.0, note: 'Clean finish around 2:50 total.' },
    ],
  },
  {
    id: 'kalita-balance',
    name: 'Kalita Balance',
    brewer: 'Kalita Wave 185',
    doseG: 18,
    ratio: 15,
    tempC: 90,
    grindMicrons: 660,
    description: 'Structured body with round caramel sweetness ideal for honey & natural Sumatra lots.',
    stages: [
      { name: 'Bloom', durationSec: 40, targetRatioPct: 0.2, note: 'Wet all grounds evenly without stirring.' },
      { name: 'Body Pour', durationSec: 50, targetRatioPct: 0.62, note: 'Consistent stream maintaining 1cm water head.' },
      { name: 'Balance Pour', durationSec: 45, targetRatioPct: 1.0, note: 'Slow pour along inner rings.' },
      { name: 'Drawdown', durationSec: 50, targetRatioPct: 1.0, note: 'Allow complete thermal settle.' },
    ],
  },
  {
    id: 'iced-flash',
    name: 'Iced Flash',
    brewer: 'Japanese Flash Brew',
    doseG: 18,
    ratio: 14,
    tempC: 93,
    grindMicrons: 520,
    description: '40% crystal ice in server, 60% hot extraction to lock volatile aromatics instantly.',
    stages: [
      { name: 'Hot Bloom', durationSec: 35, targetRatioPct: 0.25, note: 'High-temp bloom over iced carafe.' },
      { name: 'Aromatic Pour', durationSec: 45, targetRatioPct: 0.7, note: 'Brisk circular pour for bright extraction.' },
      { name: 'Flash Finish', durationSec: 35, targetRatioPct: 1.0, note: 'Complete hot fraction before swirl.' },
      { name: 'Chill Swirl', durationSec: 25, targetRatioPct: 1.0, note: 'Swirl carafe 8 seconds to chill.' },
    ],
  },
];

export const TERROIR_ORIGINS: TerroirOrigin[] = [
  {
    id: 'solok',
    name: 'Solok Limau Cirago',
    coordinates: '0°54\'12"S 100°44\'18"E',
    elevation: '1,550 – 1,720 MASL',
    rainfall: '2,400 mm / yr',
    soil: 'Andosol Volcanic Loam',
    varietals: 'Sigarar Utang, Andung Sari',
    cuppingAvg: '87.75 SCA',
    narrative:
      'Grown on the cool northern slopes of Mount Talang. Slow cherry maturation yields crystalline mandarin acidity layered over wildflower honey.',
    image: '/images/highland-terroir.webp',
  },
  {
    id: 'kerinci',
    name: 'Kerinci Kayu Aro',
    coordinates: '1°45\'09"S 101°16\'42"E',
    elevation: '1,600 – 1,800 MASL',
    rainfall: '2,850 mm / yr',
    soil: 'Deep Basaltic Volcanic Ash',
    varietals: 'P88, Sigarar Utang, Bourbon',
    cuppingAvg: '88.50 SCA',
    narrative:
      'Shadowed by Sumatra’s highest volcanic peak. Raised-bed honey lots from Kayu Aro deliver tropical tamarind sparkle and velvety cacao depth.',
    image: '/images/beans-roast.webp',
  },
  {
    id: 'gayo',
    name: 'Gayo Pantan Musara',
    coordinates: '4°36\'15"N 96°50\'24"E',
    elevation: '1,650 – 1,780 MASL',
    rainfall: '2,100 mm / yr',
    soil: 'High-Humus Highland Clay',
    varietals: 'Abyssinia, Tim-Tim, Catimor',
    cuppingAvg: '88.25 SCA',
    narrative:
      'High-altitude smallholder plots around Lake Laut Tawar. Precision anaerobic fermentation unlocks blood orange aromatics with a clean oolong finish.',
    image: '/images/roastery-bar.webp',
  },
];

export const MICRO_LOTS: MicroLot[] = [
  {
    id: 'solok-limau-cirago',
    name: 'Solok Limau Cirago #04',
    region: 'Mount Talang, West Sumatra',
    elevationM: 1650,
    process: 'Washed',
    varietal: 'Sigarar Utang & Andung Sari',
    roastLevel: 'Light-Filter',
    roastDate: 'Roasted 2 days ago',
    cuppingScore: 87.75,
    priceIdr: 145000,
    weightG: 200,
    tastingNotes: ['Kaffir Lime', 'White Peach', 'Cane Sugar'],
    story: 'Double-washed with mountain spring water and dried 16 days on parabolic raised beds for razor-sharp clarity.',
    image: '/images/hero-pourover.webp',
    recommendedPresetId: 'v60-clarity',
    sensory: { acidity: 90, sweetness: 86, body: 70, clarity: 94, finish: 88 },
  },
  {
    id: 'kerinci-p88-honey',
    name: 'Kerinci Solok P88 Reserve',
    region: 'Kayu Aro, Jambi Highland',
    elevationM: 1750,
    process: 'Honey',
    varietal: 'P88 Single Cultivar',
    roastLevel: 'Light-Medium',
    roastDate: 'Roasted yesterday',
    cuppingScore: 88.5,
    priceIdr: 168000,
    weightG: 200,
    tastingNotes: ['Ripe Mango', 'Wild Honey', 'Dark Cocoa'],
    story: 'Yellow-honey mucilage retention under high-altitude mountain mist produces syrupy sweetness without losing vibrancy.',
    image: '/images/beans-roast.webp',
    recommendedPresetId: 'origami-sweet',
    sensory: { acidity: 84, sweetness: 95, body: 85, clarity: 86, finish: 91 },
  },
  {
    id: 'gayo-pantan-anaerobic',
    name: 'Pantan Musara 72H',
    region: 'Takengon, Aceh Gayo',
    elevationM: 1720,
    process: 'Anaerobic',
    varietal: 'Abyssinia Heritage',
    roastLevel: 'Light-Filter',
    roastDate: 'Roasted 3 days ago',
    cuppingScore: 89.25,
    priceIdr: 195000,
    weightG: 200,
    tastingNotes: ['Blood Orange', 'Hibiscus', 'Oolong Tea'],
    story: '72-hour sealed thermal-monitored cherry fermentation at 18°C ambient, delivering sparkling aromatics with zero boozy harshness.',
    image: '/images/highland-terroir.webp',
    recommendedPresetId: 'iced-flash',
    sensory: { acidity: 92, sweetness: 90, body: 78, clarity: 91, finish: 93 },
  },
  {
    id: 'agam-marapi-natural',
    name: 'Bukit Marapi Sun-Dried',
    region: 'Agam, West Sumatra',
    elevationM: 1580,
    process: 'Natural',
    varietal: 'Kartika & Bourbon',
    roastLevel: 'Medium-Light',
    roastDate: 'Roasted yesterday',
    cuppingScore: 87.25,
    priceIdr: 155000,
    weightG: 200,
    tastingNotes: ['Blackberry Jam', 'Toasted Hazelnut', 'Brown Butter'],
    story: 'Whole-cherry slow drying turned every two hours on bamboo tables for lush berry aromatics and round velvety mouthfeel.',
    image: '/images/roastery-bar.webp',
    recommendedPresetId: 'kalita-balance',
    sensory: { acidity: 78, sweetness: 92, body: 91, clarity: 80, finish: 87 },
  },
];

export const CUPPING_SESSIONS: CuppingSessionType[] = [
  {
    id: 'highland-flight',
    title: 'Highland Sensory Flight',
    duration: '60 min',
    pricePerGuest: 120000,
    summary: 'Blind cupping of 4 seasonal Sumatra micro-lots across Washed, Honey, Natural, and Anaerobic.',
    includes: ['4 blind cupping bowls', 'SCA flavor calibration card', '100g sample tin to take home'],
  },
  {
    id: 'dial-in-lab',
    title: 'Precision Pour-Over Lab',
    duration: '90 min',
    pricePerGuest: 185000,
    summary: 'Hands-on refractometer session measuring TDS% and Extraction Yield across V60 and Origami.',
    includes: ['Live refractometer readings', 'Water chemistry tasting', 'Custom recipe card'],
  },
  {
    id: 'roasters-table',
    title: 'Private Roaster’s Table',
    duration: '120 min',
    pricePerGuest: 260000,
    summary: 'Intimate bar seating with our head roaster featuring rare P88 and Abyssinia competition lots.',
    includes: ['3 bespoke filter courses', 'Espresso & milk flight', '200g signed reserve bag'],
  },
];

export function formatIdr(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function computeExtractionMetrics(
  doseG: number,
  ratio: number,
  tempC: number,
  grindMicrons: number
) {
  const totalWaterMl = Math.round(doseG * ratio);
  // Realistic physical approximation for filter brewing
  const ratioFactor = (ratio - 15) * 0.45;
  const tempFactor = (tempC - 92) * 0.28;
  const grindFactor = ((620 - grindMicrons) / 100) * 1.15;
  const ey = Math.max(15.5, Math.min(24.5, Number((20.2 + ratioFactor + tempFactor + grindFactor).toFixed(2))));
  const retainedWater = doseG * 2.0;
  const beverageWeight = Math.max(80, totalWaterMl - retainedWater);
  const tds = Number(((doseG * (ey / 100) / beverageWeight) * 100).toFixed(2));

  let diagnosis: { label: string; tone: 'optimal' | 'bright' | 'heavy'; advice: string };
  if (ey >= 19.0 && ey <= 21.5 && tds >= 1.25 && tds <= 1.55) {
    diagnosis = {
      label: 'Sweet Spot — Balanced',
      tone: 'optimal',
      advice: 'Peak clarity and caramelized sweetness. Ready to pour.',
    };
  } else if (ey < 19.0) {
    diagnosis = {
      label: 'Under-Extracted — Sharp',
      tone: 'bright',
      advice: 'Try grinding finer (-40 μm) or raising water temperature +2°C.',
    };
  } else {
    diagnosis = {
      label: 'Over-Extracted — Heavy',
      tone: 'heavy',
      advice: 'Try coarsening grind (+50 μm) or lowering ratio slightly.',
    };
  }

  return { totalWaterMl, ey, tds, diagnosis };
}
