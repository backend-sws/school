import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Head } from "@inertiajs/react";
import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import transportApi from "@/lib/api/transportApi";
import {
  TRANSPORT_OCCUPANCY_BREADCRUMBS,
  TRANSPORT_OCCUPANCY_GUIDELINES,
} from "@/constants/page/admin/transport";

type VehicleOccupancy = {
  id: number;
  registration_number: string;
  capacity: number | null;
  route: { id: number; name: string; code?: string } | null;
  assigned_count: number;
  occupancy_pct: number;
};

const TransportReportsOccupancy = () => {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const { data: occupancyData, isLoading } = useQuery({
    queryKey: ["transport-occupancy", date],
    queryFn: () => transportApi.reports.occupancy({ date }),
  });

  const payload = occupancyData?.data ?? occupancyData;
  const vehicles = (payload?.vehicles ?? []) as VehicleOccupancy[];

  return (
    <>
      <Head title="Transport Occupancy" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={TRANSPORT_OCCUPANCY_BREADCRUMBS}
          icon={BarChart3}
          title="OCCUPANCY"
          subtitle="Vehicle capacity vs assigned students"
          guidance={TRANSPORT_OCCUPANCY_GUIDELINES}
        />
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <input
                  type="date"
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
            {!isLoading && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">As of {payload?.date ?? date}</p>
                <Each
                  of={vehicles}
                  keyExtractor={(v: VehicleOccupancy) => String(v.id)}
                  nodatafound={<p className="text-muted-foreground text-sm">No vehicles assigned to routes.</p>}
                  render={(v: VehicleOccupancy) => (
                    <div key={v.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <span className="font-medium">{v.registration_number}</span>
                        {v.route && (
                          <span className="text-muted-foreground text-sm ml-2">
                            — {v.route.name}
                            {v.route.code ? ` (${v.route.code})` : ""}
                          </span>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <span>{v.assigned_count ?? 0}</span>
                        <span className="text-muted-foreground"> / {v.capacity ?? "—"} seats</span>
                        <span className="ml-2 font-medium">{v.occupancy_pct ?? 0}%</span>
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransportReportsOccupancy;
