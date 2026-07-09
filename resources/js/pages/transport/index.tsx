import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FilterBar } from "@/components/filter-bar";
import { Bus, MapPin, ClipboardList, Car, Users, FileText, BarChart3, ArrowRight } from "lucide-react";
import { TRANSPORT_BREADCRUMBS, TRANSPORT_GUIDELINES, TRANSPORT_TIP } from "@/constants/page/admin/transport";
import Each from "@/components/Each";
import { useQuery } from "@tanstack/react-query";
import transportApi from "@/lib/api/transportApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TRANSPORT_OVERVIEW_GUIDE } from "@/constants/guides/transport";
import React, { useEffect, useMemo, useState } from "react";

type TransportLink = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type StopManifest = {
  sequence: number;
  stop: { id: number; name: string; code?: string };
  arrival_time?: string | null;
  departure_time?: string | null;
  students: { user_id: number; name: string; email?: string | null }[];
};

type VehicleOccupancy = {
  id: number;
  registration_number: string;
  capacity: number | null;
  route: { id: number; name: string; code?: string } | null;
  assigned_count: number;
  occupancy_pct: number;
};

const defaultDate = () => new Date().toISOString().slice(0, 10);

const setupLinks: TransportLink[] = [
  { title: "Stops", href: "/transport/stops", icon: MapPin, description: "Define pickup and drop points. Create these first, then add them to routes." },
  { title: "Routes", href: "/transport/routes", icon: ClipboardList, description: "Build routes with ordered stops and optional arrival/departure times." },
  { title: "Vehicles", href: "/transport/vehicles", icon: Car, description: "Register buses and vans. Assign a route and driver to each vehicle." },
  { title: "Drivers", href: "/transport/drivers", icon: Users, description: "Manage driver details, licenses, and contact information." },
];

const assignmentLinks: TransportLink[] = [
  { title: "Assignments", href: "/transport/assignments", icon: FileText, description: "Assign students to a route and stop. One active assignment per student." },
];

const TransportIndex = () => {
useRegisterGuide(TRANSPORT_OVERVIEW_GUIDE);

  const [manifestRouteId, setManifestRouteId] = useState<string>("");
  const [manifestDate, setManifestDate] = useState<string>(defaultDate);
  const [occupancyDate, setOccupancyDate] = useState<string>(defaultDate);

  const { data: routesData } = useQuery({
    queryKey: ["transport-routes-list"],
    queryFn: () => transportApi.routes.index({ per_page: 500 }),
  });

  const routeOptions = (routesData?.data ?? []) as { id: number; name: string; code?: string }[];
  const manifestFilter = { route_id: manifestRouteId, date: manifestDate };
  const occupancyFilter = { date: occupancyDate };

  const routeSelectOptions = useMemo(
    () =>
      routeOptions.map((r) => ({
        value: String(r.id),
        label: `${r.name}${r.code ? ` (${r.code})` : ""}`,
      })),
    [routeOptions]
  );

  // Default to first route so manifest shows recent data on load
  useEffect(() => {
    const options = (routesData?.data ?? []) as { id: number }[];
    if (options.length > 0 && !manifestRouteId) {
      setManifestRouteId(String(options[0].id));
    }
  }, [routesData, manifestRouteId]);

  const { data: manifestData, isLoading: manifestLoading } = useQuery({
    queryKey: ["transport-manifest", manifestRouteId, manifestDate],
    queryFn: () => transportApi.reports.manifest({ route_id: Number(manifestRouteId), date: manifestDate }),
    enabled: !!manifestRouteId,
  });

  const { data: occupancyData, isLoading: occupancyLoading } = useQuery({
    queryKey: ["transport-occupancy", occupancyDate],
    queryFn: () => transportApi.reports.occupancy({ date: occupancyDate }),
  });

  const manifestPayload = manifestData?.data ?? manifestData;
  const manifestRoute = manifestPayload?.route as { id: number; name: string; code?: string } | undefined;
  const manifestStops = (manifestPayload?.stops ?? []) as StopManifest[];

  const occupancyPayload = occupancyData?.data ?? occupancyData;
  const occupancyVehicles = (occupancyPayload?.vehicles ?? []) as VehicleOccupancy[];

  return (
    <>
      <Head title="Transport" />
      <div className="space-y-8">
        <MainPageHeader
          id="transport-header"
          breadcrumbs={TRANSPORT_BREADCRUMBS}
          icon={Bus}
          guidance={TRANSPORT_GUIDELINES}
          tip={TRANSPORT_TIP}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Setup</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Each
              of={setupLinks}
              keyExtractor={(item) => item.href}
              render={({ title, href, icon: Icon, description }) => (
                <Link href={href} className="block h-full group">
                  <Card className="h-full border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10">
                          <Icon className="size-5" />
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" aria-hidden />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground leading-snug">{description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Assignments</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Each
              of={assignmentLinks}
              keyExtractor={(item) => item.href}
              render={({ title, href, icon: Icon, description }) => (
                <Link href={href} className="block h-full group">
                  <Card className="h-full border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10">
                          <Icon className="size-5" />
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" aria-hidden />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground leading-snug">{description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Reports</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border/60">
              <CardHeader className="pb-3">
                <FilterBar
                  values={manifestFilter}
                  onChange={(u) => {
                    if (u.route_id !== undefined) setManifestRouteId(String(u.route_id ?? ""));
                    if (u.date !== undefined) setManifestDate(u.date ?? defaultDate());
                  }}
                >
                  <FilterBar.Renderer config={{ filters: [{ name: "route_id", type: "select", label: "Manifest — Route", placeholder: "Select route", tooltip: "Select a route to view the list of stops and assigned students for the chosen date.", options: routeSelectOptions }, { name: "date", type: "date", label: "Date", tooltip: "Date for which to show the manifest. Assignments effective on this date are included." }] }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0">
                {!manifestRouteId && <p className="text-muted-foreground text-sm">Select a route to view the manifest.</p>}
                {manifestRouteId && manifestLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
                {manifestRouteId && !manifestLoading && manifestRoute && (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    <p className="font-medium text-sm">
                      {manifestRoute.name}
                      {manifestRoute.code ? ` (${manifestRoute.code})` : ""} — {manifestPayload?.date}
                    </p>
                    <Each
                      of={manifestStops}
                      keyExtractor={(s: StopManifest) => String(s.stop?.id ?? s.sequence)}
                      nodatafound={<p className="text-muted-foreground text-sm">No stops on this route.</p>}
                      render={(s: StopManifest) => (
                        <div className="rounded-lg border p-3 space-y-1.5">
                          <div className="font-medium text-sm">
                            {s.sequence}. {s.stop?.name ?? "—"}
                            {s.stop?.code ? ` (${s.stop.code})` : ""}
                          </div>
                          {(s.arrival_time || s.departure_time) && (
                            <p className="text-muted-foreground text-xs">
                              {s.arrival_time && `Arrival: ${s.arrival_time}`}
                              {s.arrival_time && s.departure_time && " · "}
                              {s.departure_time && `Departure: ${s.departure_time}`}
                            </p>
                          )}
                          <ul className="list-disc list-inside text-xs text-muted-foreground">
                            <Each
                              of={s.students ?? []}
                              keyExtractor={(st: { user_id: number; name: string; email?: string | null }) => String(st.user_id)}
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

            <Card className="border border-border/60">
              <CardHeader className="pb-3">
                <FilterBar
                  values={occupancyFilter}
                  onChange={(u) => {
                    if (u.date !== undefined) setOccupancyDate(u.date ?? defaultDate());
                  }}
                >
                  <FilterBar.Renderer config={{ filters: [{ name: "date", type: "date", label: "Occupancy — Date", tooltip: "Date for which to show vehicle occupancy. Compares assigned student count per route with vehicle capacity." }] }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0">
                {occupancyLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
                {!occupancyLoading && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    <p className="text-muted-foreground text-sm">As of {occupancyPayload?.date ?? occupancyDate}</p>
                    <Each
                      of={occupancyVehicles}
                      keyExtractor={(v: VehicleOccupancy) => String(v.id)}
                      nodatafound={<p className="text-muted-foreground text-sm">No vehicles assigned to routes.</p>}
                      render={(v: VehicleOccupancy) => (
                        <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <div>
                            <span className="font-medium">{v.registration_number}</span>
                            {v.route && (
                              <span className="text-muted-foreground ml-1">
                                — {v.route.name}
                                {v.route.code ? ` (${v.route.code})` : ""}
                              </span>
                            )}
                          </div>
                          <div className="text-right text-muted-foreground">
                            <span className="font-medium text-foreground">{v.assigned_count ?? 0}</span>
                            <span> / {v.capacity ?? "—"} · </span>
                            <span className="font-medium text-foreground">{v.occupancy_pct ?? 0}%</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default TransportIndex;
