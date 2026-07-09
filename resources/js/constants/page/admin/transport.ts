import type { BreadcrumbItem, AsyncSelectConfig } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import transportApi from "@/lib/api/transportApi";
import StudentApi from "@/lib/api/studentApi";
import { TransportQueryKeys } from "@/lib/querykey/transport";
import { StudentQueryKeys } from "@/lib/querykey/student";

export const TRANSPORT_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Transport", href: "/transport/stops" },
];

export const TRANSPORT_STOPS_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Stops", href: "/transport/stops" },
];

export const TRANSPORT_ROUTES_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Routes", href: "/transport/routes" },
];

export const TRANSPORT_VEHICLES_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Vehicles", href: "/transport/vehicles" },
];

export const TRANSPORT_DRIVERS_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Drivers", href: "/transport/drivers" },
];

export const TRANSPORT_ASSIGNMENTS_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Assignments", href: "/transport/assignments" },
];

export const TRANSPORT_MANIFEST_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Manifest", href: "/transport/reports/manifest" },
];

export const TRANSPORT_OCCUPANCY_BREADCRUMBS: BreadcrumbItem[] = [
  ...TRANSPORT_BREADCRUMBS,
  { title: "Occupancy", href: "/transport/reports/occupancy" },
];

export const TRANSPORT_GUIDELINES = [
  "Manage transport stops, routes, vehicles, drivers, and student assignments.",
  "Define stops first, then build routes with ordered stops and optional timings.",
  "Set up stops and routes, then register vehicles and drivers. Use Assignments to link students to a route and stop. Reports below show today's manifest and occupancy by default.",
];

export const TRANSPORT_TIP = "Generate 'Daily Manifests' every morning to provide drivers with an accurate list of pickups and drop-offs for the day.";

export const TRANSPORT_STOPS_GUIDELINES = [
  "Stops are pickup/drop points. Define them before building routes.",
  "Reuse the same stop across multiple routes.",
];

export const TRANSPORT_ROUTES_GUIDELINES = [
  "Each route has an ordered list of stops with optional arrival/departure times.",
  "Add or reorder stops on the route detail page.",
];

export const TRANSPORT_VEHICLES_GUIDELINES = [
  "Register vehicles and optionally assign a route and driver.",
  "Capacity is used for occupancy reports.",
];

export const TRANSPORT_DRIVERS_GUIDELINES = [
  "Add drivers (external or link to a staff user).",
  "Optionally assign a driver to a vehicle.",
];

export const TRANSPORT_ASSIGNMENTS_GUIDELINES = [
  "Assign students to a route and stop. Only one active assignment per student.",
  "Creating a new assignment auto-ends the previous one.",
];

export const TRANSPORT_MANIFEST_GUIDELINES = [
  "View students by route and stop for a given date.",
];

export const TRANSPORT_OCCUPANCY_GUIDELINES = [
  "View vehicle capacity vs assigned student count per route.",
];

export const TRANSPORT_VEHICLE_TYPE_OPTIONS = [
  { key: "bus", text: "Bus", value: "bus" },
  { key: "van", text: "Van", value: "van" },
  { key: "cab", text: "Cab", value: "cab" },
];

export const TRANSPORT_VEHICLE_STATUS_OPTIONS = [
  { key: "active", text: "Active", value: "active" },
  { key: "maintenance", text: "Maintenance", value: "maintenance" },
  { key: "inactive", text: "Inactive", value: "inactive" },
];

// ─── Stop dialog form (mode-based: create | edit) ───────────────────────────
export const TRANSPORT_STOP_FORM_INITIAL = {
  name: "",
  code: "",
  address: "",
  landmark: "",
  latitude: "" as number | "",
  longitude: "" as number | "",
  is_active: true,
};

export const TRANSPORT_STOP_DIALOG_FORM_LAYOUT = [
  { name: "name", label: "Name", type: FORM_TYPE.TEXT, placeholder: "e.g. Main Gate", required: true, maxLength: 150, tooltip: "Display name for this pickup or drop point. Used in route planning and manifests." },
  { name: "code", label: "Code", type: FORM_TYPE.TEXT, placeholder: "e.g. MG", maxLength: 50, tooltip: "Short unique code for this stop. Auto-generated from name when adding (e.g. 'Main Gate' → MG). You can edit it. Optional; must be unique per institution." },
  { name: "address", label: "Address", type: FORM_TYPE.TEXTAREA, placeholder: "e.g. Main gate, Bailey Road, Patna", rows: 2, maxLength: 255, tooltip: "Full address of the stop location. Helps drivers and parents locate the pickup or drop point." },
  { name: "landmark", label: "Landmark", type: FORM_TYPE.TEXT, placeholder: "e.g. Near City Mall", maxLength: 150, tooltip: "Nearby landmark to help identify the stop (e.g. petrol pump, temple, market)." },
  { name: "latitude", label: "Latitude", type: FORM_TYPE.NUMBER_TEXT, placeholder: "e.g. 25.1234567", tooltip: "Optional GPS latitude for mapping. Use decimal degrees (e.g. 25.1234567)." },
  { name: "longitude", label: "Longitude", type: FORM_TYPE.NUMBER_TEXT, placeholder: "e.g. 85.9876543", tooltip: "Optional GPS longitude for mapping. Use decimal degrees (e.g. 85.9876543)." },
  { name: "is_active", label: "Active", type: FORM_TYPE.SELECT, options: [{ key: "yes", text: "Yes", value: true }, { key: "no", text: "No", value: false }], tooltip: "Inactive stops are hidden from new route assignments but existing routes keep showing them." },
];

// ─── Route dialog form ────────────────────────────────────────────────────
export const TRANSPORT_ROUTE_FORM_INITIAL = {
  name: "",
  code: "",
  description: "",
  is_active: true,
};

export const TRANSPORT_ROUTE_DIALOG_FORM_LAYOUT = [
  { name: "name", label: "Name", type: FORM_TYPE.TEXT, placeholder: "e.g. Route A – North", required: true, maxLength: 150, tooltip: "Display name for this route. Shown in vehicle assignment, manifest, and occupancy reports." },
  { name: "code", label: "Code", type: FORM_TYPE.TEXT, placeholder: "e.g. RTA", maxLength: 50, tooltip: "Short unique code for this route. Auto-generated from name when adding (e.g. 'Route A North' → RAN). You can edit it. Optional; must be unique per institution." },
  { name: "description", label: "Description", type: FORM_TYPE.TEXTAREA, placeholder: "e.g. North sector pickup points", rows: 3, maxLength: 2000, tooltip: "Optional notes about the route (e.g. areas covered, timings, special instructions). Max 2000 characters." },
  { name: "is_active", label: "Active", type: FORM_TYPE.SELECT, options: [{ key: "yes", text: "Yes", value: true }, { key: "no", text: "No", value: false }], tooltip: "Inactive routes are hidden from new vehicle and assignment options; existing data is unchanged." },
];

// ─── Driver dialog form ────────────────────────────────────────────────────
export const TRANSPORT_DRIVER_FORM_INITIAL = {
  name: "",
  license_number: "",
  license_valid_until: "",
  mobile: "",
  email: "",
  is_active: true,
};

export const TRANSPORT_DRIVER_DIALOG_FORM_LAYOUT = [
  { name: "name", label: "Name", type: FORM_TYPE.TEXT, placeholder: "e.g. Ramesh Kumar", required: true, maxLength: 150, tooltip: "Full name of the driver. Shown in vehicle assignment and reports." },
  { name: "license_number", label: "License number", type: FORM_TYPE.TEXT, placeholder: "e.g. DL01-2020-1234567", maxLength: 80, tooltip: "Driving license number as on the license document. Optional but recommended for compliance." },
  { name: "license_valid_until", label: "License valid until", type: FORM_TYPE.DATE, placeholder: "e.g. 31/12/2027", tooltip: "Expiry date of the driving license. Use to track validity and send reminders." },
  { name: "mobile", label: "Mobile", type: FORM_TYPE.PHONE_WITH_CODE, placeholder: "Enter phone number", tooltip: "Driver's contact number for route-day coordination and emergencies." },
  { name: "email", label: "Email", type: FORM_TYPE.EMAIL, placeholder: "e.g. driver@example.com", maxLength: 100, tooltip: "Driver's email address. Optional." },
  { name: "is_active", label: "Active", type: FORM_TYPE.SELECT, options: [{ key: "yes", text: "Yes", value: true }, { key: "no", text: "No", value: false }], tooltip: "Inactive drivers are hidden from new vehicle assignments; existing links remain." },
];

// ─── Vehicle dialog form (options injected in component for route/driver) ─────
export const TRANSPORT_VEHICLE_FORM_INITIAL = {
  registration_number: "",
  vehicle_type: "bus" as "bus" | "van" | "cab",
  capacity: "" as number | "",
  transport_route_id: "" as number | "",
  transport_driver_id: "" as number | "",
  status: "active" as "active" | "maintenance" | "inactive",
  notes: "",
};

export const TRANSPORT_VEHICLE_DIALOG_FORM_LAYOUT = [
  { name: "registration_number", label: "Registration number", type: FORM_TYPE.TEXT, placeholder: "e.g. KA01AB1234", required: true, maxLength: 30, tooltip: "Official vehicle registration number. Must be unique per institution. Used in manifests and occupancy." },
  { name: "vehicle_type", label: "Type", type: FORM_TYPE.SELECT, placeholder: "e.g. Bus", required: true, options: TRANSPORT_VEHICLE_TYPE_OPTIONS, tooltip: "Type of vehicle (Bus, Van, Cab). Affects capacity expectations and reporting." },
  { name: "capacity", label: "Capacity (seats)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "e.g. 40", required: true, tooltip: "Maximum number of seats. Used for occupancy reports (assigned students vs capacity)." },
  { name: "transport_route_id", label: "Route", type: FORM_TYPE.SELECT, searchable: true, placeholder: "e.g. Route A – North", tooltip: "Optional. Assign this vehicle to a route for manifest and occupancy. Can be changed later." },
  { name: "transport_driver_id", label: "Driver", type: FORM_TYPE.SELECT, searchable: true, placeholder: "e.g. Ramesh Kumar", tooltip: "Optional. Assign a driver to this vehicle. Driver must be added under Transport → Drivers first." },
  { name: "status", label: "Status", type: FORM_TYPE.SELECT, placeholder: "e.g. Active", options: TRANSPORT_VEHICLE_STATUS_OPTIONS, tooltip: "Active: in use. Maintenance: temporarily off. Inactive: no longer in fleet." },
  { name: "notes", label: "Notes", type: FORM_TYPE.TEXTAREA, placeholder: "e.g. AC bus, WiFi enabled", rows: 2, maxLength: 500, tooltip: "Optional notes (e.g. features, maintenance history). Max 500 characters." },
];

// ─── Assignment dialog form (options: students, routes, stops per route in component) ─────
export const TRANSPORT_ASSIGNMENT_FORM_INITIAL = {
  user_id: "" as number | "",
  transport_route_id: "" as number | "",
  transport_stop_id: "" as number | "",
  effective_from: "",
  effective_until: "",
  remarks: "",
};

export const TRANSPORT_ASSIGNMENT_DIALOG_FORM_LAYOUT = [
  { name: "user_id", label: "Student", type: FORM_TYPE.SELECT, searchable: true, placeholder: "e.g. Select student", required: true, tooltip: "Student to assign to this route and stop. Only students of this institution appear. One active assignment per student; creating a new one auto-ends the previous." },
  { name: "transport_route_id", label: "Route", type: FORM_TYPE.SELECT, searchable: true, placeholder: "e.g. Route A – North", required: true, tooltip: "Route the student will use. Select this first; the Stop list will show only stops on this route." },
  { name: "transport_stop_id", label: "Stop", type: FORM_TYPE.SELECT, searchable: true, placeholder: "e.g. Select route first", required: true, tooltip: "Pickup or drop stop on the selected route. Options load after you choose a route." },
  { name: "effective_from", label: "Effective from", type: FORM_TYPE.DATE, required: true, placeholder: "e.g. 15/01/2025", tooltip: "Date from which this assignment is valid. Assignments are included in manifest and occupancy from this date." },
  { name: "effective_until", label: "Effective until", type: FORM_TYPE.DATE, placeholder: "e.g. 31/12/2025", tooltip: "Optional. Leave blank for ongoing. Set a date when the student stops using this route (e.g. end of term)." },
  { name: "remarks", label: "Remarks", type: FORM_TYPE.TEXTAREA, placeholder: "e.g. Pickup only, no drop", rows: 2, maxLength: 500, tooltip: "Optional notes (e.g. pickup only, special instructions). Max 500 characters." },
];
