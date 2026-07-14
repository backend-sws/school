import {
    LayoutGrid,
    UserPlus,
    DoorOpen,
    UserCheck,
    MessageSquare,
    Utensils,
    Book,
    BarChart3,
    GraduationCap,
    Users,
    Calendar,
    CalendarDays,
    Building2,
    Building,
    Layers,
    FileText,
    Ticket,
    Settings,
    TicketCheck,
    File,
    SlidersHorizontal,
    User,
    FileBadge,
    Image,
    Newspaper,
    Images,
    Globe,
    Search,
    IndianRupee,
    Megaphone,

    Briefcase,
    FileSignature as FileSignatureIcon,
    ClipboardList,
    Receipt,
    Award,
    ShieldAlert,
    History,
    ShieldCheck,
    FolderTree,
    Boxes,
    ArrowLeftRight,
    AlertTriangle,
    ShoppingCart,
    MapPin,
    Car,
    BookOpen,
    LockKeyhole,
    IdCard,
    Paintbrush,
    Banknote,
    Plus,
} from "lucide-react";
import type { SidebarConfig, SidebarNavGroup, SidebarNavItem } from "@/types/navigation";

/**
 * Sidebar and navigation config.
 * - Each item's `permission` must match a key from database/seeders/data/permissions.php (single source of truth).
 * - New menu items under a permission-gated area need that key and the same key in the corresponding group in config/route_permissions.php.
 * - Visibility by role (and school vs college) is documented in docs/school-workflow-sidebar-permissions.md.
 */
/** Main sidebar: minimal, one Dashboard; student items; grouped admin sections. Redirect from /dashboard handles role. */
export const unifiedSidebarConfig: SidebarConfig = {
    homePath: "/",
    mainItems: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
        // { title: "Notifications", href: "/notifications", icon: Bell },
        // Student portal items: All items now grouped in modules (rail)
    ],
    footerItems: [
        { title: "Settings", href: "/settings", icon: Settings },
    ],
    groups: [
        {
            label: "Admission & Registry",
            items: [
                { title: "Candidates", href: "/students/candidate", icon: UserPlus, permission: "view_candidates", feature: "admissions" },
                { title: "Applications", href: "/admission/applications", icon: FileSignatureIcon, permission: "view_applications", feature: "admissions" },
                { title: "Students", href: "/students/manage", icon: Users, permission: "view_students", feature: "core" },
                { title: "My Applications", href: "/student-portal/my-applications", icon: File, permission: "student_portal_applications", feature: "admissions" },
                // --- Temporarily hidden ---
                // { title: "Promotions", href: "/admission/promotions", icon: ArrowUpCircle, permission: "view_promotions", feature: "admissions" },
                //  { title: "Re-Admissions", href: "/admission/readmissions", icon: UserPlus, permission: "view_readmissions", feature: "admissions" },
            ],
        },
        {
            label: "Treasury & Fees",
            items: [
                { title: "Fee Types", href: "/accounts/fee-hub/fee-types", icon: IndianRupee, permission: "view_fee_particulars", feature: "fee_management" },
                { title: "Fee profile", href: "/accounts/fee-hub/profiles", icon: SlidersHorizontal, permission: "view_fee_particulars", feature: "fee_management" },
                { title: "Dues & overdue", href: "/accounts/fee-hub/dues", icon: AlertTriangle, permission: "view_fee_dues", feature: "fee_management" },
                { title: "Ad-Hoc Charges", href: "/accounts/fee-hub/ad-hoc-charges", icon: Banknote, permission: "view_fee_particulars", feature: "fee_management" },
                { title: "Expense Categories", href: "/accounts/expenses/categories", icon: Layers, permission: "view_expense_categories", feature: "fee_management" },
                { title: "Expenses Hub", href: "/accounts/expenses", icon: Banknote, permission: "view_expenses", feature: "fee_management" },
                { title: "Log Expense", href: "/accounts/expenses/records", icon: Plus, permission: "create_expenses", feature: "fee_management" },
                { title: "Fees", href: "/student-portal/fees", icon: Receipt, permission: "student_portal_fees", feature: "fee_management" },
                { title: "Transactions", href: "/student-portal/fees/history", icon: History, permission: "student_portal_fees", feature: "fee_management" },
            ],
        },
        {
            label: "HR & Payroll",
            items: [
                { title: "Staff Attendance", href: "/hr/attendance", icon: CalendarDays, permission: "view_users", feature: "core" },
                { title: "Leave Types", href: "/hr/leave-types", icon: Layers, permission: "view_users", feature: "core" },
                { title: "Leave Requests", href: "/hr/leave-requests", icon: ClipboardList, permission: "view_users", feature: "core" },
                { title: "Payroll Hub", href: "/hr/payroll", icon: Banknote, permission: "view_users", feature: "core" },
                { title: "Components", href: "/hr/payroll/components", icon: SlidersHorizontal, permission: "view_users", feature: "core" },
                { title: "Salary Structures", href: "/hr/payroll/salary-structures", icon: Layers, permission: "view_users", feature: "core" }
            ],
        },
        {
            label: "Academics",
            items: [
                { title: "Sessions", href: "/organization/sessions", icon: Calendar, permission: "view_sessions" },
                { title: "Departments", href: "/organization/departments", icon: Building2, permission: "view_departments" },
                { title: "Levels", href: "/organization/main-streams", icon: Layers, permission: "view_streams", contentKey: "main_streams_title" },
                { title: "Classes", href: "/organization/streams", icon: GraduationCap, permission: "view_streams", feature: "academics", contentKey: "streams_and_programs_title" },
                { title: "Subjects", href: "/organization/subject", icon: Book, permission: "view_subjects", feature: "academics" },
                { title: "Subject Groups", href: "/organization/subject-groups", icon: Layers, permission: "view_subject_groups", feature: "academics" },
                { title: "Classrooms", href: "/lms/classes", icon: Users, permission: "view_lms_classes", feature: "lms" },
                { title: "My Classes", href: "/student-portal/my-classes", icon: BookOpen, permission: "student_portal_classes", feature: "lms" },
            ],
        },
        {
            label: "Examination",
            items: [
                { title: "Exams", href: "/examination/exams", icon: FileBadge, permission: "view_exams", feature: "academics" },
                { title: "Schedules", href: "/examination/schedules", icon: Calendar, permission: "manage_exam_schedules", feature: "academics" },
                { title: "Results", href: "/examination/results", icon: Award, permission: "publish_results", feature: "academics" },
                { title: "Grading Scales", href: "/examination/grading-scales", icon: Layers, permission: "manage_grading_scales", feature: "academics" },
            ],
        },

        // --- Temporarily hidden ---
        // {
        //     label: "Timetable & Scheduling",
        //     items: [
        //         { title: "Overview", href: "/timetable", icon: LayoutGrid, permission: "view_timetables" },
        //         { title: "Templates", href: "/timetable/templates", icon: Calendar, permission: "view_timetables" },
        //         { title: "Rooms", href: "/timetable/rooms", icon: Building2, permission: "view_rooms" },
        //         { title: "Substitutions", href: "/timetable/substitutions", icon: ArrowLeftRight, permission: "view_substitutions" },
        //     ],
        // },
        {
            label: "Certificates",
            items: [
                { title: "Certificate Heads", href: "/certificates/manage-certificate-head", icon: Award, permission: "view_certificates", feature: "certificates" },
                { title: "Applications", href: "/certificates/applications", icon: ClipboardList, permission: "issue_certificates", feature: "certificates" },
                { title: "ID Templates", href: "/certificates/id-cards/templates", icon: IdCard, permission: "create_id_card_templates", feature: "certificates" },
                { title: "Generate ID", href: "/certificates/id-cards", icon: IdCard, permission: "generate_id_cards", feature: "certificates" },
                { title: "Certificates", href: "/student-portal/my-certificates", icon: FileText, permission: "student_portal_certificates", feature: "certificates" },
            ],
        },
        {
            label: "Redressal",
            items: [
                { title: "Grievances", href: "/grievances", icon: ShieldAlert, permission: "view_grievances", feature: "grievances" },
                { title: "Tickets", href: "/grievances/support-ticket", icon: Ticket, permission: "view_all_support_tickets", feature: "grievances" },
                { title: "Feedback", href: "/grievances/feedback", icon: MessageSquare, permission: "view_grievances", feature: "grievances" },
                { title: "Contacts", href: "/grievances/contacts", icon: Search, permission: "view_contacts", feature: "grievances" },
                { title: "Support", href: "/student-portal/tickets", icon: TicketCheck, permission: "student_portal_support", feature: "grievances" },
            ],
        },
        {
            label: "Website & PR",
            items: [
                { title: "Builder", href: "/website/builder", icon: Paintbrush, permission: "update_website", feature: "website_cms" },
                { title: "Notices", href: "/notice-management", icon: Megaphone, permission: "view_notices" },
                { title: "Sliders", href: "/website/sliders", icon: Image, permission: "update_website", feature: "website_cms" },
                { title: "Galleries", href: "/website/galleries", icon: Images, permission: "update_gallery", feature: "website_cms" },
                { title: "Tickers", href: "/website/tickers", icon: Megaphone, permission: "update_news", feature: "website_cms" },
                { title: "News", href: "/website/news", icon: Newspaper, permission: "update_news", feature: "website_cms" },
            ],
        },
        {
            label: "Inventory",
            items: [
                // { title: "Overview", href: "/inventory", icon: Package, permission: "view_inventory_categories", feature: "inventory" },
                { title: "Categories", href: "/inventory/categories", icon: FolderTree, permission: "view_inventory_categories", feature: "inventory" },
                { title: "Locations", href: "/inventory/locations", icon: MapPin, permission: "view_inventory_locations", feature: "inventory" },
                { title: "Items", href: "/inventory/items", icon: Boxes, permission: "view_inventory_items", feature: "inventory" },
                { title: "Movements", href: "/inventory/movements", icon: ArrowLeftRight, permission: "view_inventory_movements", feature: "inventory" },
                { title: "Sales", href: "/inventory/sales", icon: ShoppingCart, permission: "view_inventory_sales", feature: "inventory" },
                { title: "Low Stock", href: "/inventory/reports/low-stock", icon: AlertTriangle, permission: "view_inventory_reports", feature: "inventory" },
            ],
        },
        {
            label: "Transport",
            items: [
                // { title: "Overview", href: "/transport", icon: Bus, permission: "view_transport_routes", feature: "transport" },
                { title: "Stops", href: "/transport/stops", icon: MapPin, permission: "view_transport_stops", feature: "transport" },
                { title: "Routes", href: "/transport/routes", icon: ClipboardList, permission: "view_transport_routes", feature: "transport" },
                { title: "Drivers", href: "/transport/drivers", icon: Users, permission: "view_transport_drivers", feature: "transport" },
                { title: "Vehicles", href: "/transport/vehicles", icon: Car, permission: "view_transport_vehicles", feature: "transport" },
                { title: "Assignments", href: "/transport/assignments", icon: FileText, permission: "view_transport_assignments", feature: "transport" },
            ],
        },
        {
            label: "Hostel",
            items: [
                { title: "Buildings", href: "/hostel/hostels", icon: Building, permission: "view_hostels", feature: "hostel" },
                { title: "Rooms", href: "/hostel/rooms", icon: DoorOpen, permission: "view_hostel_rooms", feature: "hostel" },
                { title: "Allocations", href: "/hostel/allocations", icon: UserCheck, permission: "view_hostel_allocations", feature: "hostel" },
                { title: "Complaints", href: "/hostel/complaints", icon: MessageSquare, permission: "view_hostel_complaints", feature: "hostel" },
                { title: "Mess Plans", href: "/hostel/mess-plans", icon: Utensils, permission: "view_hostel_mess_plans", feature: "hostel" },
            ],
        },
        // --- Temporarily hidden ---
        // {
        //     label: "Library",
        //     items: [
        //         { title: "Books", href: "/library/books", icon: BookOpen, permission: "view_library_books", feature: "library" },
        //         { title: "Copies", href: "/library/copies", icon: BookOpen, permission: "view_library_copies", feature: "library" },
        //         { title: "Issues & Returns", href: "/library/issues", icon: BookOpen, permission: "view_library_issues", feature: "library" },
        //         { title: "Overdue", href: "/library/reports/overdue", icon: AlertTriangle, permission: "view_library_reports", feature: "library" },
        //     ],
        // },
        {
            label: "Analytics",
            items: [
                { title: "Overview", href: "/analytics", icon: BarChart3, permission: "view_all_reports", feature: "advanced_analytics" },
                { title: "Students", href: "/students/analytics", icon: Users, permission: "view_students" },
                { title: "Audit Logs", href: "/admin/audit-logs", icon: History, permission: "view_audit" },
                { title: "Import Logs", href: "/admin/analytics/import-logs", icon: History, permission: "view_data_import" },
            ],
        },
    ],
};

/** Settings sub-menu only. These routes must not appear in unifiedSidebarConfig (main sidebar). */
export const SETTINGS_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "My Account",
        items: [
            { title: "My Profile", href: "/settings/profile", icon: User, permission: "update_profile" },
            { title: "Change Password", href: "/settings/password", icon: LockKeyhole, permission: "update_password" },
        ],
    },
    {
        label: "Institute Identity",
        items: [
            { title: "Institution Profile", href: "/settings/institution", icon: Building2, permission: "update_settings" },
            { title: "Digital Branding", href: "/settings/digital-presence", icon: Globe, permission: "update_settings" },
            { title: "SEO & Favicon", href: "/settings/seo", icon: Search, permission: "update_settings" },
            { title: "Landing Content", href: "/settings/landing-page-content", icon: LayoutGrid, permission: "update_settings" },
            { title: "Institutional Academics", href: "/settings/institutional-academics", icon: BookOpen, permission: "manage_institutional_academics" },
            { title: "Institutional Departments", href: "/settings/institutional-departments", icon: Building2, permission: "manage_institutional_departments" },
            { title: "Institutional Facilities", href: "/settings/institutional-facilities", icon: Building2, permission: "update_settings" },
            { title: "Institutional Placement", href: "/settings/institutional-placement", icon: Briefcase, permission: "update_settings" },
            { title: "Institutional Approvals", href: "/settings/institutional-approvals", icon: FileBadge, permission: "update_settings" },
        ],
    },
    {
        label: "Operational Rules",
        items: [
            { title: "Admission Policy", href: "/settings/admission", icon: SlidersHorizontal, permission: "update_settings" },
            // { title: "Admission Verification", href: "/settings/admission-verification", icon: UserCheck, permission: "manage_admission_verification" },
            // { title: "Student Verification", href: "/settings/student-verification", icon: User, permission: "manage_student_verification" },
            { title: "Collection settings", href: "/accounts/fee-hub/collection-settings", icon: Settings, permission: "view_fee_collection_settings" },
            { title: "Academic Calendar", href: "/settings/academic-calendar", icon: Calendar, permission: "view_academic_calendar_settings" },
        ],
    },
    {
        label: "System Console",
        items: [
            { title: "Staff Directory", href: "/settings/staff-directory", icon: Users, permission: "view_users" },
            { title: "Security Roles", href: "/admin/roles", icon: ShieldCheck, permission: "view_roles" },
            { title: "Data Import", href: "/admin/data-import", icon: ArrowLeftRight, permission: "view_data_import" },
        ],
    },
];

/** Redressal module internal navigation. */
export const REDRESSAL_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Redressal Desk",
        items: [
            { title: "Grievance Board", href: "/grievances", icon: ShieldAlert, permission: "view_grievances" },
            { title: "Support Tickets", href: "/grievances/support-ticket", icon: Ticket, permission: "view_all_support_tickets" },
            { title: "Stakeholder Feedback", href: "/grievances/feedback", icon: MessageSquare, permission: "view_grievances" },
            { title: "Contact Directory", href: "/grievances/contacts", icon: Search, permission: "view_contacts" },
        ],
    },
];

/** Admission module internal navigation (derived from sidebar group). */
export const ADMISSION_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Admission & Registry",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Admission & Registry")?.items ?? [],
    },
];

/** Academic module internal navigation. */
export const ACADEMIC_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Academics",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Academics")?.items ?? [],
    },
];

/** Treasury & Fees module internal navigation. */
export const ACCOUNTS_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Treasury & Fees",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Treasury & Fees")?.items ?? [],
    },
];

/** Analytics module internal navigation. */
export const ANALYTICS_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Analytics",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Analytics")?.items ?? [],
    },
];

/** Certificate module internal navigation. */
export const CERTIFICATE_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Certificates",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Certificates")?.items ?? [],
    },
];

/** Inventory module internal navigation. */
export const INVENTORY_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Inventory",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Inventory")?.items ?? [],
    },
];

/** Transport module internal navigation. */
export const TRANSPORT_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Transport",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Transport")?.items ?? [],
    },
];

/** Library module internal navigation. */
export const LIBRARY_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Library",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Library")?.items ?? [],
    },
];

/** Website & PR module internal navigation. */
export const WEBSITE_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Website & PR",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Website & PR")?.items ?? [],
    },
];

/** Timetable module internal navigation. */
export const TIMETABLE_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Timetable & Scheduling",
        items: unifiedSidebarConfig.groups.find((g) => g.label === "Timetable & Scheduling")?.items ?? [],
    },
];


/** Portal navigation: student-portal items from mainItems (permission-gated in layout). */
export const PORTAL_NAVIGATION: SidebarNavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    // Include student portal items from mainItems and groups
    ...[
        ...unifiedSidebarConfig.mainItems,
        ...unifiedSidebarConfig.groups.flatMap(g => g.items)
    ].filter(
        (item) => item.href.startsWith("/student-portal/") && item.href !== "/student-portal/dashboard"
    ),
];
export const HOSTEL_NAVIGATION: SidebarNavGroup[] = [
    {
        label: "Hostel",
        items: [
            { title: "Dashboard", href: "/hostel", icon: LayoutGrid, permission: "view_dashboard" },
            { title: "Buildings", href: "/hostel/hostels", icon: Building, permission: "view_hostels" },
            { title: "Rooms", href: "/hostel/rooms", icon: DoorOpen, permission: "view_hostel_rooms" },
            { title: "Allocations", href: "/hostel/allocations", icon: UserCheck, permission: "view_hostel_allocations" },
            { title: "Complaints", href: "/hostel/complaints", icon: MessageSquare, permission: "view_hostel_complaints" },
            { title: "Mess Plans", href: "/hostel/mess-plans", icon: Utensils, permission: "view_hostel_mess_plans" },
        ],
    },
];

