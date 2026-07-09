import { GuideDefinition } from "@/types/guide";

export const TRANSPORT_OVERVIEW_GUIDE: GuideDefinition = {
    id: "transport_overview_guide",
    pageTitle: "Transport Overview",
    pageSubtitle: "Summary of routes, vehicle occupancy, and logistics.",
    pageGuidance: [
        "Monitor the efficiency of your institution's transport network.",
        "Identify high-demand routes and optimize vehicle allocation.",
        "Ensure all vehicles and drivers are compliant with safety regulations."
    ],
    settingsTip: "Manage your institution's fleet and student transportation. Define routes, assign vehicles and drivers, and track student pickup/drop-off points efficiently.",
    steps: [
        {
            element: "#transport-header",
            title: "Logistics Dashboard",
            description: "High-level oversight of your fleet and routing operations.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const TRANSPORT_ROUTES_GUIDE: GuideDefinition = {
    id: "transport_routes_guide",
    pageTitle: "Route Management",
    pageSubtitle: "Define and manage transport paths and schedules.",
    pageGuidance: [
        "Create routes connecting various geographical stops to the campus.",
        "Calculate route distances and set transport fees for different zones.",
        "Manage morning and afternoon trip timings for each route."
    ],
    settingsTip: "Design and manage transportation routes with ordered stops. Logical routes ensure timely pickup and drop-off for students while optimizing vehicle usage.",
    steps: [
        {
            element: "#transport-routes-header",
            title: "Routes & Zones",
            description: "Define the geographical paths your fleet covers.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-route-btn",
            title: "Add Route",
            description: "Establish a new transport path for students and staff.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const TRANSPORT_VEHICLES_GUIDE: GuideDefinition = {
    id: "transport_vehicles_guide",
    pageTitle: "Fleet Management",
    pageSubtitle: "Manage vehicle details, maintenance, and insurance records.",
    pageGuidance: [
        "Maintain detailed records for every vehicle including registration and capacity.",
        "Track insurance expiry and service dates to ensure operational safety.",
        "Assign vehicles to specific routes based on passenger requirements."
    ],
    settingsTip: "Maintain a comprehensive roster of your institution's buses and vans. Track vehicle details, route assignments, and driver linkage in one place.",
    steps: [
        {
            element: "#transport-vehicles-header",
            title: "Vehicle Roster",
            description: "Manage your institution's fleet of buses and vans.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#vehicles-table",
            title: "Manage Fleet",
            description: "Update details, monitor compliance, and assign vehicles.",
            type: "standard",
            position: "top"
        }
    ]
};

export const TRANSPORT_STOPS_GUIDE: GuideDefinition = {
    id: "transport_stops_guide",
    pageTitle: "Stop Management",
    pageSubtitle: "Define pick-up and drop-off points for transport routes.",
    pageGuidance: [
        "Identify key landmarks or residential clusters as official stops.",
        "Pinpoint exact locations for drivers to ensure punctuality.",
        "Link stops to routes to build a comprehensive navigation map."
    ],
    settingsTip: "Define pickup and drop-off points for your transportation network. These stops are the building blocks for creating efficient routes.",
    steps: [
        {
            element: "#transport-stops-header",
            title: "Route Stops",
            description: "Manage the list of boarding points across your service area.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-stop-btn",
            title: "Mark Stop",
            description: "Create a new pick-up or drop-off location.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const TRANSPORT_DRIVERS_GUIDE: GuideDefinition = {
    id: "transport_drivers_guide",
    pageTitle: "Driver Directory",
    pageSubtitle: "Maintain records of transport staff and licenses.",
    pageGuidance: [
        "Store driver license details and expiry dates for compliance.",
        "Maintain emergency contact information for every transport professional.",
        "Assign drivers to specific vehicles and routes to ensure accountability."
    ],
    settingsTip: "Manage your team of dedicated transport professionals. Maintain driver profiles, licensing information, and contact details for safe and accountable transit.",
    steps: [
        {
            element: "#transport-drivers-header",
            title: "Driver Registry",
            description: "Manage the professionals behind your institution's fleet.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-driver-btn",
            title: "Register Driver",
            description: "Add a new staff member to the transport team.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const TRANSPORT_ASSIGNMENTS_GUIDE: GuideDefinition = {
    id: "transport_assignments_guide",
    pageTitle: "Transport Assignments",
    pageSubtitle: "Link passengers to routes, vehicles, and stops.",
    pageGuidance: [
        "Manage the allocation of students and staff to specific transport services.",
        "Track occupancy levels to prevent overcrowding and ensure comfort.",
        "Generate route-wise passenger lists for drivers and supervisors."
    ],
    settingsTip: "Manage the allocation of students and staff to specific transport services. Track occupancy levels, effective dates, and stop assignments to ensure a well-organized transit experience.",
    steps: [
        {
            element: "#transport-assignments-header",
            title: "Passenger Allocation",
            description: "Oversee the distribution of passengers across your fleet.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-assignment-btn",
            title: "Assign Passenger",
            description: "Link a student or staff member to a transport route.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#assignments-table",
            title: "Assignment Logs",
            description: "Filter and manage passenger lists for different routes and vehicles.",
            type: "standard",
            position: "top"
        }
    ]
};
