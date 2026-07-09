import React from "react";
import { MapPin } from "lucide-react";
import Each from "@/components/Each";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDENT_DASHBOARD_LABELS } from "@/constants/page/studentDashboard";

export interface Address {
  address_type: string;
  village_mohalla: string;
  post_office: string;
  police_station: string;
  district: string;
  state: string;
  pincode: string;
}

interface AddressesCardProps {
  addresses: Address[];
  isLoading?: boolean;
}

const AddressLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
    {[1, 2].map((i) => (
      <div key={i} className="px-6 py-4 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);

export function AddressesCard({ addresses, isLoading = false }: AddressesCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <MapPin size={15} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          {STUDENT_DASHBOARD_LABELS.addressesCardTitle}
        </h3>
      </div>

      {isLoading ? (
        <AddressLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          <Each
            of={addresses}
            keyExtractor={(_, idx) => String(idx)}
            nodatafound={
              <div className="px-6 py-8 text-center col-span-2">
                <MapPin size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {STUDENT_DASHBOARD_LABELS.addressesEmptyMessage}
                </p>
              </div>
            }
            render={(addr: Address) => (
              <div className="px-6 py-4">
                <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide mb-2.5">
                  {addr.address_type}
                </span>
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium text-foreground">{addr.village_mohalla}</p>
                  <p className="text-muted-foreground">PO: {addr.post_office}, PS: {addr.police_station}</p>
                  <p className="text-muted-foreground">{addr.district}, {addr.state} — {addr.pincode}</p>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
