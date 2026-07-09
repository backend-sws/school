import { GuideDefinition } from "@/types/guide";

export const NOTICES_GUIDE: GuideDefinition = {
    id: "notices_guide",
    pageTitle: "Notice Management",
    pageSubtitle: "Publish and broadcast official announcements to your community.",
    pageGuidance: [
        "Create digital notices that appear on student portals and public displays.",
        "Schedule notices to go live at specific times for future announcements.",
        "Target notices to specific groups like Teachers, Students, or Parents."
    ],
    settingsTip: "Clear, concise notices with descriptive titles help your community stay informed without feeling overwhelmed.",
    steps: [
        {
            element: "#notices-header",
            title: "Notice Board",
            description: "Manage all official announcements and digital notices from here.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-notice-btn",
            title: "Publish Notice",
            description: "Draft a new announcement, attach files, and set its target audience.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#notices-table",
            title: "Recent Announcements",
            description: "View, edit, or archive notices. Track who has seen them.",
            type: "standard",
            position: "top"
        }
    ]
};

export const SLIDERS_GUIDE: GuideDefinition = {
    id: "sliders_guide",
    pageTitle: "Homepage Sliders",
    pageSubtitle: "Manage visual banners for your public website.",
    pageGuidance: [
        "Update the high-impact banners on your homepage with events and achievements.",
        "Use high-resolution images (recommended 1920x800) for the best visual experience.",
        "Link sliders to specific pages like Admission forms or Event details."
    ],
    settingsTip: "Sliders are the first thing visitors see. Use eye-catching imagery and clear call-to-actions to drive engagement.",
    steps: [
        {
            element: "#sliders-header",
            title: "Slider Manager",
            description: "Configure the rotating banners that appear on your website's home hero section.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#add-slider-btn",
            title: "Upload Banner",
            description: "Add a new image, headline, and call-to-action link.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#sliders-grid",
            title: "Active Banners",
            description: "Reorder or disable sliders to control the visitor experience.",
            type: "standard",
            position: "top"
        }
    ]
};

export const GALLERIES_GUIDE: GuideDefinition = {
    id: "galleries_guide",
    pageTitle: "Media Galleries",
    pageSubtitle: "Showcase institutional life through photo and video albums.",
    pageGuidance: [
        "Create albums for annual functions, sports days, and campus events.",
        "Organize media into meaningful collections for easier browsing.",
        "Embed video links or upload high-quality images directly."
    ],
    settingsTip: "Organize your gallery by year or event type to make it easy for parents and students to find their favorite highlights.",
    steps: [
        {
            element: "#galleries-header",
            title: "Media Library",
            description: "Organize campus highlights into photo and video galleries.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-gallery-btn",
            title: "Create Album",
            description: "Start a new collection for a specific event or facility.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#galleries-grid",
            title: "Album Directory",
            description: "Manage existing albums and update their content.",
            type: "standard",
            position: "top"
        }
    ]
};

export const TICKERS_GUIDE: GuideDefinition = {
    id: "tickers_guide",
    pageTitle: "News Tickers",
    pageSubtitle: "Scrolling announcements for urgent or highlight news.",
    pageGuidance: [
        "Use tickers for high-priority scrolling text on your website homepage.",
        "Ideal for urgent alerts: 'Admission Open', 'Exam Postponed', or 'Holiday Notice'.",
        "Keep ticker text concise for better readability during scrolling."
    ],
    settingsTip: "Keep tickers short and impactful. Too much text on a scrolling bar can be difficult for visitors to read quickly.",
    steps: [
        {
            element: "#tickers-header",
            title: "Ticker Manager",
            description: "Manage the scrolling text alerts on the public dashboard.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#tickers-list",
            title: "Live Alerts",
            description: "Add or toggle scrolling news items currently active on the site.",
            type: "standard",
            position: "top"
        }
    ]
};

export const NEWS_GUIDE: GuideDefinition = {
    id: "news_guide",
    pageTitle: "News & Events",
    pageSubtitle: "Publish detailed articles about institutional updates and events.",
    pageGuidance: [
        "Write rich-text articles with images to showcase detailed event reports.",
        "Categorize news items to help visitors find relevant content.",
        "Feature important news to keep them at the top of the news feed."
    ],
    settingsTip: "News articles are great for building your institution's digital footprint. Regularly publish stories about achievements and events.",
    steps: [
        {
            element: "#news-header",
            title: "Press & News",
            description: "Your institution's digital press room for articles and blog posts.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-news-btn",
            title: "Create Article",
            description: "Launch the editor to write a news story or event summary.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#news-table",
            title: "Article Manager",
            description: "Edit, publish, or schedule your news content.",
            type: "standard",
            position: "top"
        }
    ]
};

export const SEO_GUIDE: GuideDefinition = {
    id: "seo_guide",
    pageTitle: "SEO & Favicon",
    pageSubtitle: "Optimize your institution's search visibility and social media presence",
    pageGuidance: [
        "Set the site favicon and default meta tags for search engines and social sharing.",
        "Consistent meta data improves discoverability and professional presentation in link previews.",
        "These settings apply globally unless specific pages override them."
    ],
    settingsTip: "Favicon appears in browser tabs and bookmarks. Meta title and description improve search visibility significantly.",
    steps: [
        {
            element: "#seo-header",
            title: "Search Optimization",
            description: "Manage global SEO settings and institutional branding favorites (favicons).",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const DIGITAL_PRESENCE_GUIDE: GuideDefinition = {
    id: "digital_presence_guide",
    pageTitle: "Digital Presence",
    pageSubtitle: "Manage social media links and online connectivity across the web",
    pageGuidance: [
        "Configure how your institution appears across social platforms and maps.",
        "Direct stakeholders to your official digital channels for authentic updates.",
        "Social media integration enhances institutional reach and community engagement."
    ],
    settingsTip: "Active social links show a vibrant institutional life. Regularly check that your links point to your latest official profiles.",
    steps: [
        {
            element: "#digital-presence-header",
            title: "Connectivity Hub",
            description: "Control all your institutional social media and digital identifiers from here.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const LANDING_PAGE_CONTENT_GUIDE: GuideDefinition = {
    id: "landing_page_content_guide",
    pageTitle: "Landing Page Content",
    pageSubtitle: "Customize the messaging, narrative, and leadership highlights for your home page",
    pageGuidance: [
        "Update the principal's message, institutional narrative, and core goals.",
        "Highlight your institution's journey and achievements to visitors.",
        "Dynamic sections like Sliders and Galleries are managed separately for better focus."
    ],
    settingsTip: "Your landing page is your digital front door. Use compelling narratives and clear leadership messages to build trust with new visitors.",
    steps: [
        {
            element: "#landing-page-content-header",
            title: "Messaging & Narrative",
            description: "Control the static content and messaging displayed on your public website.",
            type: "standard",
            position: "bottom"
        }
    ]
};
