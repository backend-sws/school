import type { LandingThemeKey, LandingBannerConfig } from './types';
import NavratriDecoration from '../../pages/Landing/components/shared/NavratriDecoration';
import DiwaliDecoration from '../../pages/Landing/components/shared/DiwaliDecoration';
import HoliDecoration from '../../pages/Landing/components/shared/HoliDecoration';
import RamaNavmiDecoration from '../../pages/Landing/components/shared/RamaNavmiDecoration';
import RepublicDecoration from '../../pages/Landing/components/shared/RepublicDecoration';
import VaisakhiDecoration from '../../pages/Landing/components/shared/VaisakhiDecoration';
import GangaurDecoration from '../../pages/Landing/components/shared/GangaurDecoration';
import ChristmasDecoration from '../../pages/Landing/components/shared/ChristmasDecoration';
import JanmashtamiDecoration from '../../pages/Landing/components/shared/JanmashtamiDecoration';
import GaneshDecoration from '../../pages/Landing/components/shared/GaneshDecoration';
import OnamDecoration from '../../pages/Landing/components/shared/OnamDecoration';
import HanumanDecoration from '../../pages/Landing/components/shared/HanumanDecoration';
import AkshayaDecoration from '../../pages/Landing/components/shared/AkshayaDecoration';
import LohriDecoration from '../../pages/Landing/components/shared/LohriDecoration';

/**
 * BANNER REGISTRY - The "Software Factory" for all landing banners.
 * Each configuration defines the visual identity and content for a specific theme.
 * Visual styles (gradients/colors) are in resources/css/brand-palettes.css
 */
export const BANNER_REGISTRY: Record<LandingThemeKey, LandingBannerConfig> = {
    default: {
        text: '🚀 Powering 500+ institutions across India',
        link: { label: 'See Plans', href: '#pricing' },
        dismissible: true,
    },
    
    // ── Festival Themes ─────────────────────────────────────────
    diwali: {
        text: '🪔 Happy Diwali! Illuminate your institution with 25% off.',
        link: { label: 'Claim Offer', href: '/pricing?coupon=DIWALI25' },
        dismissible: true,
        motif: 'rangoli',
        Decoration: DiwaliDecoration
    },
    navratri: {
        text: '🏮 Get ready to celebrate Navratri!',
        link: { label: 'Explore More', href: '#features' },
        dismissible: true,
        motif: 'navratri',
        Decoration: NavratriDecoration
    },
    holi: {
        text: '🎨 Celebrate the Festival of Colors with PDS Education!',
        link: { label: 'Get Started', href: '#pricing' },
        dismissible: true,
        motif: 'lotus',
        Decoration: HoliDecoration
    },
    raksha_bandhan: {
        text: '🤝 Strengthening the bond of education this Raksha Bandhan.',
        dismissible: true,
        motif: 'paisley'
    },
    janmashtami: {
        text: '🦚 Happy Janmashtami! Wisdom and grace to all learners.',
        dismissible: true,
        motif: 'lotus',
        Decoration: JanmashtamiDecoration
    },
    ganesh_chaturthi: {
        text: '🐘 Wishing you success and wisdom this Ganesh Chaturthi.',
        dismissible: true,
        motif: 'swastik',
        Decoration: GaneshDecoration
    },
    dussehra: {
        text: '🏹 Victory of light over darkness. Happy Dussehra!',
        dismissible: true,
        motif: 'shloka',
        Decoration: RamaNavmiDecoration
    },
    christmas: {
        text: '🎄 Merry Christmas! Spreading joy and learning.',
        dismissible: true,
        motif: 'lotus',
        Decoration: ChristmasDecoration
    },
    new_year: {
        text: '✨ Happy New Year! A fresh chapter for your institution.',
        link: { label: 'New Year Deal', href: '#pricing' },
        dismissible: true,
        motif: 'ashoka'
    },
    ramanavami: {
        text: '🏹 Jai Shri Ram! Celebrating the birth of Lord Rama.',
        link: { label: 'Explore', href: '#features' },
        dismissible: true,
        motif: 'dhanush',
        Decoration: RamaNavmiDecoration
    },
    hanumanjayanti: {
        text: '🙏 Jai Hanuman! Strength and devotion on Hanuman Jayanti.',
        dismissible: true,
        motif: 'gada',
        Decoration: HanumanDecoration
    },
    vaisakhi: {
        text: '🌾 Happy Vaisakhi! Harvesting knowledge, sowing excellence.',
        link: { label: 'Get Started', href: '#pricing' },
        dismissible: true,
        motif: 'wheat',
        Decoration: VaisakhiDecoration
    },
    akshayatritiya: {
        text: '✨ Akshaya Tritiya! An auspicious start for your institution.',
        link: { label: 'Start Free', href: '/register' },
        dismissible: true,
        motif: 'kalash',
        Decoration: AkshayaDecoration
    },
    gangaur: {
        text: '🌺 Happy Gangaur! Celebrating Goddess Gauri\'s blessings.',
        dismissible: true,
        motif: 'sindoor',
        Decoration: GangaurDecoration
    },

    // ── National Days ───────────────────────────────────────────
    republic: {
        text: '🇮🇳 Happy Republic Day! Empowering Digital India.',
        dismissible: true,
        motif: 'ashoka',
        Decoration: RepublicDecoration
    },
    independence: {
        text: '🇮🇳 Celebrating 77 Years of Excellence. Happy Independence Day!',
        dismissible: true,
        motif: 'ashoka',
        Decoration: RepublicDecoration
    },
    gandhi_jayanti: {
        text: '🕊️ Wisdom of Non-Violence. Happy Gandhi Jayanti.',
        dismissible: true,
        motif: 'ashoka'
    },

    // ── Regional Festivals ──────────────────────────────────────
    pongal: {
        text: '🌾 Happy Pongal! Harvesting success for every student.',
        dismissible: true,
        motif: 'mithila'
    },
    onam: {
        text: '🌸 Happy Onam! A season of prosperity and joy.',
        dismissible: true,
        motif: 'rangoli',
        Decoration: OnamDecoration
    },
    bihu: {
        text: '🎺 Rongali Bihu Greetings! Dancing to the rhythm of growth.',
        dismissible: true,
        motif: 'warli'
    },
    baisakhi: {
        text: '🚜 Happy Baisakhi! Celebrating the bounty of knowledge.',
        dismissible: true,
        motif: 'paisley',
        Decoration: VaisakhiDecoration
    },
    ugadi: {
        text: '🎍 Happy Ugadi! New beginnings and sweet successes.',
        dismissible: true,
        motif: 'lotus'
    },
    lohr: {
        text: '🔥 Happy Lohri! Warmth and success to your institution.',
        dismissible: true,
        motif: 'warli',
        Decoration: LohriDecoration
    },
    charaideo: {
        text: '🏰 Celebrating the heritage of Charaideo.',
        dismissible: true,
        motif: 'mithila'
    },

    // ── Academic Events ─────────────────────────────────────────
    admission_open: {
        text: '📝 Admissions Open for 2026-27! Streamline your process.',
        link: { label: 'Get Started', href: '/register' },
        dismissible: true,
        motif: 'mithila'
    },
    early_bird: {
        text: '🐦 Early Bird Offer! Save 15% on institutional onboarding.',
        link: { label: 'Register Now', href: '/register' },
        dismissible: false,
        motif: 'ashoka'
    },
    exam_results: {
        text: '📊 Exam Season? Automate your result management.',
        link: { label: 'Try Now', href: '#features' },
        dismissible: true,
        motif: 'chikankari'
    },
    new_session: {
        text: '🏫 Welcome to the New Academic Session!',
        link: { label: 'Kickstart', href: '/onboarding' },
        dismissible: true,
        motif: 'mithila'
    },
    annual_day: {
        text: '🎭 Celebrating Talent. Wishing you a Great Annual Day!',
        dismissible: true,
        motif: 'kalamkari'
    },
    sports_meet: {
        text: '🏃‍♂️ Faster, Higher, Stronger. Good luck for the Sports Meet!',
        dismissible: true,
        motif: 'warli'
    },
    scholarship: {
        text: '🎓 Scholarship Program Launch! Help students excel.',
        link: { label: 'Learn More', href: '#features' },
        dismissible: true,
        motif: 'shloka'
    },
    webinar: {
        text: '🌐 Join our upcoming webinar on Digital Transformation.',
        link: { label: 'Register', href: '/webinar' },
        dismissible: true,
        motif: 'lotus'
    },
    workshop: {
        text: '🛠️ Hands-on Workshop: Mastering ERP Workflows.',
        link: { label: 'Book Spot', href: '/events' },
        dismissible: true,
        motif: 'vedic'
    },
    maintenance: {
        text: '🔧 Scheduled Maintenance on Sunday, 2 AM - 4 AM IST.',
        dismissible: false,
        motif: 'warli'
    },
    summer_camp: {
        text: '☀️ Enrollment open for Summer Camp 2026!',
        link: { label: 'Enroll', href: '/summer-camp' },
        dismissible: true,
        motif: 'paisley'
    },
    winter_break: {
        text: '❄️ Wishing all students a warm and happy Winter Break.',
        dismissible: true,
        motif: 'lotus'
    },

    // ── Brand Colors ────────────────────────────────────────────
    pdseducation_purple: {
        text: '💜 Experience the elegance of PDS Education Purple.',
        dismissible: true,
        motif: 'lotus'
    },
    pdseducation_gold: {
        text: '✨ The Golden Standard in Education Management.',
        dismissible: true,
        motif: 'swastik'
    },
    pdseducation_ocean: {
        text: '🌊 Calm, Reliable, and Deeply Integrated.',
        dismissible: true,
        motif: 'lotus'
    },
    pdseducation_forest: {
        text: '🌲 Growing Together. The Future of Campus Management.',
        dismissible: true,
        motif: 'shloka'
    }
};
