import type { LandingMotifKey } from './types';

/**
 * Hero 3D Marquee content — education quotes, Vedic shlokas, and motif tiles
 * Arranged in rows for the alternating-scroll marquee grid
 */

export type MarqueeCardType = 'quote' | 'shloka' | 'motif';

export interface MarqueeCard {
    type: MarqueeCardType;
    /** Motif key for motif-type cards */
    motif?: LandingMotifKey;
    /** Devanagari / Sanskrit text */
    textHi?: string;
    /** English text / translation */
    textEn?: string;
    /** Attribution */
    source?: string;
}

/** Row 1 — Top row scrolling left */
export const MARQUEE_ROW_1: MarqueeCard[] = [
    { type: 'shloka', textHi: 'तमसो मा ज्योतिर्गमय', textEn: 'Lead me from darkness to light', source: 'Brihadaranyaka Upanishad' },
    { type: 'motif', motif: 'shloka' },
    { type: 'quote', textEn: 'Education is the most powerful weapon which you can use to change the world.', source: 'Nelson Mandela' },
    { type: 'motif', motif: 'lotus' },
    { type: 'shloka', textHi: 'विद्या ददाति विनयम्', textEn: 'Knowledge gives humility', source: 'Hitopadesha' },
    { type: 'motif', motif: 'vedic' },
];

/** Row 2 — Middle row scrolling right */
export const MARQUEE_ROW_2: MarqueeCard[] = [
    { type: 'motif', motif: 'mithila' },
    { type: 'quote', textEn: 'The roots of education are bitter, but the fruit is sweet.', source: 'Aristotle' },
    { type: 'shloka', textHi: 'सा विद्या या विमुक्तये', textEn: 'True knowledge is that which liberates', source: 'Vishnu Purana' },
    { type: 'motif', motif: 'ashoka' },
    { type: 'quote', textEn: 'An investment in knowledge pays the best interest.', source: 'Benjamin Franklin' },
    { type: 'motif', motif: 'rangoli' },
];

/** Row 3 — Bottom row scrolling left */
export const MARQUEE_ROW_3: MarqueeCard[] = [
    { type: 'shloka', textHi: 'सर्वे भवन्तु सुखिनः', textEn: 'May all sentient beings be at peace', source: 'Brihadaranyaka Upanishad' },
    { type: 'motif', motif: 'warli' },
    { type: 'quote', textEn: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', source: 'Mahatma Gandhi' },
    { type: 'motif', motif: 'kalamkari' },
    { type: 'shloka', textHi: 'अहिंसा परमो धर्मः', textEn: 'Non-violence is the highest duty', source: 'Mahabharata' },
    { type: 'motif', motif: 'chikankari' },
];

/** Row 4 — Extra row scrolling right */
export const MARQUEE_ROW_4: MarqueeCard[] = [
    { type: 'motif', motif: 'mithila' },
    { type: 'shloka', textHi: 'योगः कर्मसु कौशलम्', textEn: 'Yoga is excellence in action', source: 'Bhagavad Gita 2.50' },
    { type: 'quote', textEn: 'The beautiful thing about learning is nobody can take it away from you.', source: 'B.B. King' },
    { type: 'motif', motif: 'paisley' },
    { type: 'shloka', textHi: 'धर्मो रक्षति रक्षितः', textEn: 'Dharma protects those who protect it', source: 'Manusmriti' },
    { type: 'motif', motif: 'swastik' },
];

export const MARQUEE_ROWS = [MARQUEE_ROW_1, MARQUEE_ROW_2, MARQUEE_ROW_3, MARQUEE_ROW_4];
