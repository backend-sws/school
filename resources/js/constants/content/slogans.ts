/** Education-centric slogans — one shown per day, rotating automatically */
export const ED_SLOGANS = [
    'Empowering Minds, Shaping Futures',
    'Where Learning Meets Excellence',
    'Nurturing Tomorrow\'s Leaders',
    'Education Without Boundaries',
    'Inspiring Curiosity, Igniting Passion',
    'Building Knowledge, Building Character',
    'Learn Today, Lead Tomorrow',
    'Excellence in Every Endeavor',
    'Transforming Lives Through Education',
    'Where Every Student Shines',
    'Innovate. Educate. Elevate.',
    'Roots of Knowledge, Wings of Ambition',
    'Creating Pathways to Success',
    'Shaping Minds, Transforming Futures',
    'Knowledge is the Key to Growth',
    'From Classroom to Career',
    'Dream. Discover. Deliver.',
    'Education is the Foundation of Progress',
    'Prepare. Perform. Prevail.',
    'Cultivating Talent, Inspiring Dreams',
    'Together We Learn, Together We Grow',
    'Unlock Your True Potential',
    'Where Discipline Meets Dedication',
    'Building Tomorrow, One Student at a Time',
    'The Journey of Learning Never Ends',
    'Think. Create. Achieve.',
    'Wisdom Begins with Wonder',
    'Empowering Futures, One Lesson at a Time',
    'Committed to Academic Excellence',
    'Where Passion Meets Purpose',
    'Learn. Evolve. Succeed.',
] as const;

/** Returns a deterministic slogan based on the day of the year */
export function getDailySlogan(): string {
    const now = new Date();
    const dayOfYear = Math.floor(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
    );
    return ED_SLOGANS[dayOfYear % ED_SLOGANS.length];
}
