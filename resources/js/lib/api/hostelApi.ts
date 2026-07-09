import api from "./api";

export interface Hostel {
    id: number;
    name: string;
    code: string | null;
    type: "boys" | "girls" | "co-ed" | "staff";
    warden_user_id: number | null;
    warden_name: string | null;
    warden_contact: string | null;
    address: string | null;
    total_capacity: number;
    description: string | null;
    is_active: boolean;
    rooms_count?: number;
    beds_count?: number;
    occupied_beds_count?: number;
    created_at: string;
    updated_at: string;
    floors?: HostelFloor[];
}

export interface HostelFloor {
    id: number;
    hostel_id: number;
    name: string;
    floor_number: number;
    description: string | null;
    rooms_count?: number;
    rooms?: HostelRoom[];
}

export interface HostelRoom {
    id: number;
    hostel_id: number;
    hostel_floor_id: number | null;
    room_number: string;
    type: "single" | "double" | "triple" | "dormitory";
    bed_count: number;
    monthly_fee: number | null;
    amenities: string[] | null;
    is_active: boolean;
    occupied_beds_count?: number;
    hostel?: Partial<Hostel>;
    floor?: Partial<HostelFloor>;
    beds?: HostelBed[];
}

export interface HostelBed {
    id: number;
    hostel_room_id: number;
    bed_label: string;
    status: "vacant" | "occupied" | "maintenance";
    notes: string | null;
    room?: Partial<HostelRoom>;
    active_allocation?: HostelAllocation;
}

export interface HostelAllocation {
    id: number;
    user_id: number;
    hostel_room_id: number;
    hostel_bed_id: number | null;
    check_in_date: string;
    check_out_date: string | null;
    status: "active" | "checked_out" | "cancelled";
    remarks: string | null;
    user?: { id: number; name: string; email: string; student_profile?: any };
    room?: Partial<HostelRoom>;
    bed?: Partial<HostelBed>;
    monthly_amount?: number;
    due_amount?: number;
}

export interface HostelComplaint {
    id: number;
    user_id: number;
    hostel_room_id: number;
    subject: string;
    description: string | null;
    status: "open" | "in_progress" | "resolved" | "closed";
    resolved_at: string | null;
    created_at: string;
    user?: { id: number; name: string; email: string; student_profile?: any };
    room?: Partial<HostelRoom>;
}

export interface HostelMessPlan {
    id: number;
    name: string;
    type: "veg" | "non-veg" | "both";
    monthly_fee: number;
    description: string | null;
    meal_schedule: Record<string, string> | null;
    is_active: boolean;
}

export const hostelApi = {
    hostels: {
        index: (params?: any) => api.get("/hostel/hostels", { params }),
        show: (id: number) => api.get(`/hostel/hostels/${id}`),
        store: (data: Partial<Hostel>) => api.post("/hostel/hostels", data),
        update: (id: number, data: Partial<Hostel>) => api.put(`/hostel/hostels/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/hostels/${id}`),
    },

    floors: {
        index: (hostelId: number) => api.get(`/hostel/hostels/${hostelId}/floors`),
        store: (hostelId: number, data: Partial<HostelFloor>) => api.post(`/hostel/hostels/${hostelId}/floors`, data),
        update: (id: number, data: Partial<HostelFloor>) => api.put(`/hostel/floors/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/floors/${id}`),
    },

    rooms: {
        index: (params?: any) => api.get("/hostel/rooms", { params }),
        show: (id: number) => api.get(`/hostel/rooms/${id}`),
        store: (data: Partial<HostelRoom>) => api.post("/hostel/rooms", data),
        update: (id: number, data: Partial<HostelRoom>) => api.put(`/hostel/rooms/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/rooms/${id}`),
    },

    beds: {
        index: (params?: any) => api.get("/hostel/beds", { params }),
        update: (id: number, data: Partial<HostelBed>) => api.put(`/hostel/beds/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/beds/${id}`),
    },

    allocations: {
        index: (params?: any) => api.get("/hostel/allocations", { params }),
        show: (id: number) => api.get(`/hostel/allocations/${id}`),
        store: (data: Partial<HostelAllocation>) => api.post("/hostel/allocations", data),
        update: (id: number, data: Partial<HostelAllocation>) => api.put(`/hostel/allocations/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/allocations/${id}`),
    },

    complaints: {
        index: (params?: any) => api.get("/hostel/complaints", { params }),
        show: (id: number) => api.get(`/hostel/complaints/${id}`),
        store: (data: Partial<HostelComplaint>) => api.post("/hostel/complaints", data),
        update: (id: number, data: Partial<HostelComplaint>) => api.put(`/hostel/complaints/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/complaints/${id}`),
    },

    messPlans: {
        index: (params?: any) => api.get("/hostel/mess-plans", { params }),
        show: (id: number) => api.get(`/hostel/mess-plans/${id}`),
        store: (data: Partial<HostelMessPlan>) => api.post("/hostel/mess-plans", data),
        update: (id: number, data: Partial<HostelMessPlan>) => api.put(`/hostel/mess-plans/${id}`, data),
        destroy: (id: number) => api.delete(`/hostel/mess-plans/${id}`),
    },

    reports: {
        summary: () => api.get("/hostel/reports/summary"),
        occupancy: () => api.get("/hostel/reports/occupancy"),
    }
};
