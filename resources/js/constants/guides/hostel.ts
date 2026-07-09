import { GuideDefinition } from "@/types/guide";

export const HOSTEL_OVERVIEW_GUIDE: GuideDefinition = {
    id: "hostel_overview_guide",
    pageTitle: "Hostel Overview",
    pageSubtitle: "Summary of hostel occupancy, room availability, and student housing.",
    pageGuidance: [
        "Monitor the overall status of your institution's residential facilities.",
        "Track occupancy rates and identify available boarding capacity.",
        "Review upcoming check-ins and check-outs across all hostels."
    ],
    settingsTip: "Hostel management is about comfort and safety. Regularly monitor occupancy levels to ensure all residents are comfortably housed and facilities aren't overstretched.",
    steps: [
        {
            element: "#hostel-header",
            title: "Housing Dashboard",
            description: "A centralized view of your institution's hostel operations.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const HOSTELS_GUIDE: GuideDefinition = {
    id: "hostels_guide",
    pageTitle: "Hostel Management",
    pageSubtitle: "Define and manage residential buildings and facilities.",
    pageGuidance: [
        "Create records for different hostel buildings (e.g., Boys, Girls, Staff).",
        "Specify locations and total capacities for each residential block.",
        "Categorize hostels into types like Standard, Premium, or Supervised."
    ],
    settingsTip: "Diversifying hostel buildings allows for better student grouping. Use clear labels to distinguish between residential blocks and their specific purposes.",
    steps: [
        {
            element: "#hostels-header",
            title: "Hostel Registry",
            description: "List and manage all residential buildings on campus.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-hostel-btn",
            title: "Add Building",
            description: "Register a new hostel facility in the system.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const HOSTEL_ROOMS_GUIDE: GuideDefinition = {
    id: "hostel_rooms_guide",
    pageTitle: "Room Management",
    pageSubtitle: "Configure room types, beds, and individual unit details.",
    pageGuidance: [
        "Define different room configurations (Single, Shared, Dormitory).",
        "Set bed counts and manage specific amenities per room unit.",
        "Link rooms to their respective hostels and floors for clear organization."
    ],
    settingsTip: "Accurate room configuration prevents overbooking. Ensure bed counts are correctly set before starting any student allocations.",
    steps: [
        {
            element: "#hostel-rooms-header",
            title: "Room Inventory",
            description: "Manage the individual living units across your hostels.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-room-btn",
            title: "Add Room",
            description: "Create a new living unit or room type.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#rooms-table",
            title: "Room List",
            description: "Filter and manage rooms by hostel, type, or occupancy status.",
            type: "standard",
            position: "top"
        }
    ]
};

export const HOSTEL_ALLOCATIONS_GUIDE: GuideDefinition = {
    id: "hostel_allocations_guide",
    pageTitle: "Room Allocations",
    pageSubtitle: "Manage student and staff housing assignments.",
    pageGuidance: [
        "Assign residents to specific rooms and beds based on availability.",
        "Track check-in and check-out dates for accurate occupancy logs.",
        "Manage room transfers and cancellations through historical assignment records."
    ],
    settingsTip: "Allocations provide a definitive record of who's on campus. Keep check-in and check-out dates precise for better security and facility management.",
    steps: [
        {
            element: "#hostel-allocations-header",
            title: "Housing Assignments",
            description: "Oversee who is staying where and for how long.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-allocation-btn",
            title: "Assign Resident",
            description: "Link a student or staff member to a hostel room.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#allocations-table",
            title: "Allocation Logs",
            description: "Monitor active residents and manage future check-ins.",
            type: "standard",
            position: "top"
        }
    ]
};
