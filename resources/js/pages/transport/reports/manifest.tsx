import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Head } from "@inertiajs/react";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import transportApi from "@/lib/api/transportApi";
import {
  TRANSPORT_MANIFEST_BREADCRUMBS,
  TRANSPORT_MANIFEST_GUIDELINES,
} from "@/constants/page/admin/transport";

type StopManifest = {
  sequence: number;
  stop: { id: number; name: string; code?: string };
  arrival_time?: string | null;
  departure_time?: string | null;
  students: { user_id: number; name: string; email?: string | null }[];
};

const TransportReportsManifest = () => {
  const [routeId, setRouteId] = useState<string>("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const { data: routesData } = useQuery({
    queryKey: ["transport-routes-list"],
    queryFn: () => transportApi.routes.index({ per_page: 500 }),
  });

  const { data: manifestData, isLoading } = useQuery({
    queryKey: ["transport-manifest", routeId, date],
    queryFn: () => transportApi.reports.manifest({ route_id: Number(routeId), date }),
    enabled: !!routeId,
  });

  const routeOptions = (routesData?.data ?? []) as { id: number; name: string; code?: string }[];
  const payload = manifestData?.data ?? manifestData;
  const route = payload?.route as { id: number; name: string; code?: string } | undefined;
  const stops = (payload?.stops ?? []) as StopManifest[];

  return (
    <>
      <Head title="Transport Manifest" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={TRANSPORT_MANIFEST_BREADCRUMBS}
          icon={FileText}
          title="MANIFEST"
          subtitle="Students by route and stop for a date"
          guidance={TRANSPORT_MANIFEST_GUIDELINES}
        />
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Route</Label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                >
                  <option value="">Select route</option>
                  <Each
                      of={routeOptions}
                      keyExtractor={(r) => String(r.id)}
                      render={(r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.code ? ` (${r.code})` : ""}
                    </option>
                  )}
                  />
                </select>
              </div>
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
            {!routeId && <p className="text-muted-foreground text-sm">Select a route to view the manifest.</p>}
            {routeId && isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
            {routeId && !isLoading && route && (
              <div className="space-y-6">
                <p className="font-medium">
                  {route.name}
                  {route.code ? ` (${route.code})` : ""} — {payload?.date}
                </p>
                <Each
                  of={stops}
                  keyExtractor={(s: StopManifest) => String(s.stop?.id ?? s.sequence)}
                  nodatafound={<p className="text-muted-foreground text-sm">No stops on this route.</p>}
                  render={(s: StopManifest) => (
                    <div key={s.stop?.id ?? s.sequence} className="rounded-lg border p-4 space-y-2">
                      <div className="font-medium">
                        {s.sequence}. {s.stop?.name ?? "—"}
                        {s.stop?.code ? ` (${s.stop.code})` : ""}
                      </div>
                      {s.arrival_time && <span className="text-muted-foreground text-sm">Arrival: {s.arrival_time}</span>}
                      {s.departure_time && <span className="text-muted-foreground text-sm ml-2">Departure: {s.departure_time}</span>}
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <Each
                          of={s.students ?? []}
                          keyExtractor={(st: { user_id: number }) => String(st.user_id)}
                          nodatafound={<li>No students</li>}
                          render={(st: { user_id: number; name: string; email?: string | null }) => (
                            <li key={st.user_id}>{st.name}{st.email ? ` (${st.email})` : ""}</li>
                          )}
                        />
                      </ul>
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

export default TransportReportsManifest;
