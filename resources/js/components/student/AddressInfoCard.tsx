import React from "react";
import Each from "@/components/Each";
import { MapPin } from "lucide-react";

interface Address {
    address_type: string;
    village_mohalla: string;
    post_office: string;
    police_station: string;
    district: string;
    state: string;
    pincode: string;
}

interface AddressInfoCardProps {
    addresses: Address[];
}

export const AddressInfoCard = ({ addresses }: AddressInfoCardProps) => {
    return (
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="size-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                    Contact Addresses
                </h3>
            </div>
            <div className="space-y-4">
                {addresses.map((addr, idx) => (
                    <div
                        key={idx}
                        className="p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-border transition-colors cursor-default"
                    >
                        <p className="text-[10px] font-black text-primary uppercase mb-1">
                            {addr.address_type}
                        </p>
                        <p className="text-sm font-medium leading-relaxed">
                            {addr.village_mohalla}, {addr.post_office}, <br />
                            {addr.police_station}, {addr.district}, {addr.state} -{" "}
                            {addr.pincode}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
