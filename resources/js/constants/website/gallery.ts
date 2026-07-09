/**
 * Gallery Section Static Data
 */

export interface GalleryMedia {
    id: string;
    type: 'image' | 'video';
    src: string;
    thumbnail?: string;
    alt: string;
    category: string;
    title: string;
    description?: string;
}

export interface GalleryCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
    {
        id: 'campus',
        name: 'Campus Life',
        description: 'Glimpses of our beautiful and vibrant campus architecture.',
        icon: '🏫',
        color: 'bg-primary/10 text-primary',
    },
    {
        id: 'events',
        name: 'Events & Cultural',
        description: 'Capturing moments from various fests and celebrations.',
        icon: '🎉',
        color: 'bg-info/10 text-info',
    },
    {
        id: 'facilities',
        name: 'Facilities',
        description: 'Explore our moden laboratories, library, and sports areas.',
        icon: '🔬',
        color: 'bg-success/10 text-success',
    },
    {
        id: 'academics',
        name: 'Academics',
        description: 'Classrooms and educational activities.',
        icon: '📚',
        color: 'bg-warning/10 text-warning',
    },
];

export const GALLERY_IMAGES: GalleryMedia[] = [
    {
        id: 'img1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070',
        alt: 'Main Academic Block',
        category: 'campus',
        title: 'Academic Block',
        description: 'The iconic main building of our college.'
    },
    {
        id: 'img2',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1498243639359-2ceece460004?q=80&w=2070',
        alt: 'Central Library',
        category: 'facilities',
        title: 'Central Library',
        description: 'A quiet place for extensive research and reading.'
    },
    {
        id: 'img3',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070',
        alt: 'Cultural Fest 2025',
        category: 'events',
        title: 'Annual Cultural Fest',
        description: 'Students showcasing their talents on stage.'
    },
    {
        id: 'img4',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d57c9e9?q=80&w=2070',
        alt: 'Computer Lab',
        category: 'facilities',
        title: 'Computer Center',
        description: 'Advanced computing facilities for all students.'
    },
    {
        id: 'img5',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2066',
        alt: 'Administrative Block',
        category: 'campus',
        title: 'Admin Office',
        description: 'The hub of college administration.'
    },
    {
        id: 'img6',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070',
        alt: 'Group Discussion',
        category: 'academics',
        title: 'Interactive Learning',
        description: 'Students engaged in collaborative group work.'
    }
];

export const GALLERY_VIDEOS: GalleryMedia[] = [
    {
        id: 'vid1',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070',
        alt: 'Campus Tour',
        category: 'campus',
        title: 'Campus Tour 2024',
        description: 'A virtual walkthrough of our beautiful campus.'
    },
    {
        id: 'vid2',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070',
        alt: 'Convocation Ceremony',
        category: 'events',
        title: 'Graduation Day Highlights',
        description: 'Celebrating the success of our graduates.'
    }
];

export const ALL_GALLERY_MEDIA = {
    campus: [...GALLERY_IMAGES.filter(m => m.category === 'campus'), ...GALLERY_VIDEOS.filter(m => m.category === 'campus')],
    events: [...GALLERY_IMAGES.filter(m => m.category === 'events'), ...GALLERY_VIDEOS.filter(m => m.category === 'events')],
    facilities: [...GALLERY_IMAGES.filter(m => m.category === 'facilities'), ...GALLERY_VIDEOS.filter(m => m.category === 'facilities')],
    academics: [...GALLERY_IMAGES.filter(m => m.category === 'academics'), ...GALLERY_VIDEOS.filter(m => m.category === 'academics')],
} as const;
