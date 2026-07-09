import { PermissionGate } from "@/components/PermissionGate";
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import transportApi from "@/lib/api/transportApi";
import { toast } from "sonner";
import { TRANSPORT_ROUTES_BREADCRUMBS } from "@/constants/page/admin/transport";
import { PageLoader } from "@/components/shared/PageLoader";
import { ClipboardList, Plus, Trash2, Save, ArrowLeft, MapPin, Clock, GripVertical } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type RouteStop = {
  id: number;
  sequence: number;
  arrival_time?: string | null;
  departure_time?: string | null;
  fare?: number | string | null;
  transport_stop?: { id: number; name: string; code?: string };
  transport_stop_id?: number;
};

type RouteData = {
  id: number;
  name: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  route_stops?: RouteStop[];
};

type StopOption = { id: number; name: string; code?: string };

type PageProps = { id: number };

const TransportRoutesShow = ({ id }: PageProps) => {
  const queryClient = useQueryClient();

  // ── Route detail ──
  const { data: routeRes, isLoading } = useQuery({
    queryKey: ["transport-route", id],
    queryFn: () => transportApi.routes.show(id),
  });
  const route = (routeRes?.data ?? routeRes) as RouteData | undefined;

  // ── All stops (for the "add stop" dropdown) ──
  const { data: stopsRes } = useQuery({
    queryKey: ["transport-stops-all"],
    queryFn: () => transportApi.stops.index({ per_page: 500, is_active: true }),
  });
  const allStops = useMemo(() => (stopsRes?.data ?? []) as StopOption[], [stopsRes]);

  // ── Local state for editing stops ──
  const [localStops, setLocalStops] = useState<
    Array<{
      _key: string;
      transport_stop_id: number;
      stopName: string;
      stopCode?: string;
      sequence: number;
      arrival_time: string;
      departure_time: string;
      fare: number;
      routeStopId?: number; // existing pivot id
    }>
  >([]);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<{ _key: string; stopName: string } | null>(null);

  // Sync server data → local state
  useEffect(() => {
    if (route?.route_stops) {
      setLocalStops(
        route.route_stops.map((rs: RouteStop, i: number) => ({
          _key: `existing-${rs.id}`,
          transport_stop_id: rs.transport_stop?.id ?? rs.transport_stop_id ?? 0,
          stopName: rs.transport_stop?.name ?? "—",
          stopCode: rs.transport_stop?.code,
          sequence: rs.sequence ?? i + 1,
          arrival_time: rs.arrival_time ?? "",
          departure_time: rs.departure_time ?? "",
          fare: Number(rs.fare ?? 0),
          routeStopId: rs.id,
        }))
      );
      setIsDirty(false);
    }
  }, [route]);

  // Filter out stops already linked
  const availableStops = useMemo(() => {
    const linked = new Set(localStops.map((s) => s.transport_stop_id));
    return allStops.filter((s) => !linked.has(s.id));
  }, [allStops, localStops]);

  // ── Add stop locally ──
  const handleAddStop = useCallback(() => {
    const stopId = Number(selectedStopId);
    if (!stopId) return;
    const stop = allStops.find((s) => s.id === stopId);
    if (!stop) return;

    setLocalStops((prev) => [
      ...prev,
      {
        _key: `new-${Date.now()}`,
        transport_stop_id: stop.id,
        stopName: stop.name,
        stopCode: stop.code,
        sequence: prev.length + 1,
        arrival_time: "",
        departure_time: "",
        fare: 0,
      },
    ]);
    setSelectedStopId("");
    setIsDirty(true);
  }, [selectedStopId, allStops]);

  // ── Update a field locally ──
  const updateField = useCallback(
    (key: string, field: "arrival_time" | "departure_time" | "sequence" | "fare", value: string | number) => {
      setLocalStops((prev) =>
        prev.map((s) => (s._key === key ? { ...s, [field]: value } : s))
      );
      setIsDirty(true);
    },
    []
  );

  // ── Remove stop locally ──
  const handleRemoveStop = useCallback((key: string) => {
    setLocalStops((prev) => {
      const updated = prev.filter((s) => s._key !== key);
      // Re-sequence
      return updated.map((s, i) => ({ ...s, sequence: i + 1 }));
    });
    setIsDirty(true);
    setDeleteTarget(null);
  }, []);

  // ── Move stop up/down ──
  const moveStop = useCallback((index: number, direction: "up" | "down") => {
    setLocalStops((prev) => {
      const arr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return arr.map((s, i) => ({ ...s, sequence: i + 1 }));
    });
    setIsDirty(true);
  }, []);

  // ── Save (bulk update) ──
  const saveMutation = useMutation({
    mutationFn: () =>
      transportApi.routeStops.updateBulk(
        id,
        localStops.map((s) => ({
          transport_stop_id: s.transport_stop_id,
          sequence: s.sequence,
          arrival_time: s.arrival_time || null,
          departure_time: s.departure_time || null,
          fare: Number(s.fare) || 0,
        }))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-route", id] });
      queryClient.invalidateQueries({ queryKey: ["transport-routes"] });
      setIsDirty(false);
      toast.success("Route stops saved successfully.");
    },
    onError: () => {
      toast.error("Failed to save route stops.");
    },
  });

  if (isLoading) {
    return (
      <>
        <Head title="Route" />
        <PageLoader />
      </>
    );
  }

  if (!route?.id) return null;

  return (
    <>
      <Head title={route.name} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Remove Stop"
        description={`Remove "${deleteTarget?.stopName}" from this route?`}
        onConfirm={() => deleteTarget && handleRemoveStop(deleteTarget._key)}
        confirmText="Remove"
        variant="danger"
      />
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <MainPageHeader
            breadcrumbs={TRANSPORT_ROUTES_BREADCRUMBS}
            icon={ClipboardList}
            title={route.name}
            subtitle={route.code ? `Code: ${route.code}` : "Transport route"}
          />
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/transport/routes">
                <ArrowLeft className="size-4" />
                Back to Routes
              </Link>
            </Button>
          </div>

          {/* Route details */}
          <Card>
            <CardHeader>
              <h3 className="font-medium">Route Details</h3>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span> {route.name}
              </p>
              {route.code && (
                <p>
                  <span className="text-muted-foreground">Code:</span>{" "}
                  <span className="font-mono bg-muted/40 px-1.5 py-0.5 rounded text-xs border border-border/20">
                    {route.code}
                  </span>
                </p>
              )}
              {route.description && (
                <p>
                  <span className="text-muted-foreground">Description:</span> {route.description}
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Status:</span>{" "}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    route.is_active !== false
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {route.is_active !== false ? "Active" : "Inactive"}
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Stops management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h3 className="font-medium">Stops on this Route</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {localStops.length} stop{localStops.length !== 1 ? "s" : ""}
                </span>
              </div>
              <PermissionGate can="update_transport_routes">
                {isDirty && (
                  <Button
                    size="sm"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="shadow-sm"
                  >
                    <Save className="size-4" />
                    {saveMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </PermissionGate>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add stop row */}
              <PermissionGate can="update_transport_routes">
                <div className="flex items-end gap-2 p-3 bg-muted/30 rounded-lg border border-dashed border-border/50">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wider">
                      Add a Stop
                    </label>
                    <Select value={selectedStopId} onValueChange={setSelectedStopId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a stop to add..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStops.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            No available stops
                          </SelectItem>
                        ) : (
                          availableStops.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}{s.code ? ` (${s.code})` : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleAddStop}
                    disabled={!selectedStopId}
                    className="shrink-0"
                  >
                    <Plus className="size-4" />
                    Add
                  </Button>
                </div>
              </PermissionGate>

              {/* Linked stops list */}
              {localStops.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="size-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No stops linked to this route yet.</p>
                  <p className="text-xs mt-1">Use the dropdown above to add stops.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="hidden sm:grid sm:grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-2 px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <span className="w-16">#</span>
                    <span>Stop</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> Arrival</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> Departure</span>
                    <span>Fare (₹)</span>
                    <span className="w-20 text-right">Actions</span>
                  </div>

                  {localStops.map((stop, index) => (
                    <div
                      key={stop._key}
                      className="grid grid-cols-1 sm:grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-2 items-center px-3 py-2.5 rounded-lg border border-border/50 bg-background hover:bg-muted/20 transition-colors group"
                    >
                      {/* Sequence */}
                      <div className="w-16 flex items-center gap-1">
                        <GripVertical className="size-3.5 text-muted-foreground/30 hidden sm:block" />
                        <span className="text-sm font-mono font-bold text-primary/70 bg-primary/5 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                          {stop.sequence}
                        </span>
                        <PermissionGate can="update_transport_routes">
                          <div className="flex flex-col -space-y-px ml-1">
                            <button
                              type="button"
                              className="text-muted-foreground/40 hover:text-primary text-[10px] leading-none disabled:opacity-20"
                              disabled={index === 0}
                              onClick={() => moveStop(index, "up")}
                              title="Move up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              className="text-muted-foreground/40 hover:text-primary text-[10px] leading-none disabled:opacity-20"
                              disabled={index === localStops.length - 1}
                              onClick={() => moveStop(index, "down")}
                              title="Move down"
                            >
                              ▼
                            </button>
                          </div>
                        </PermissionGate>
                      </div>

                      {/* Stop name */}
                      <div className="min-w-0">
                        <span className="font-medium text-sm truncate block">{stop.stopName}</span>
                        {stop.stopCode && (
                          <span className="text-[10px] font-mono text-muted-foreground/60 bg-muted/30 px-1 rounded">
                            {stop.stopCode}
                          </span>
                        )}
                      </div>

                      <PermissionGate
                        can="update_transport_routes"
                        fallback={
                          <span className="text-sm text-muted-foreground">{stop.arrival_time || "—"}</span>
                        }
                      >
                        <Input
                          type="time"
                          value={stop.arrival_time}
                          onChange={(e) => updateField(stop._key, "arrival_time", e.target.value)}
                          onClick={(e) => {
                            try {
                              e.currentTarget.showPicker();
                            } catch (err) {}
                          }}
                          className="h-8 text-sm cursor-pointer"
                          placeholder="HH:MM"
                        />
                      </PermissionGate>

                      <PermissionGate
                        can="update_transport_routes"
                        fallback={
                          <span className="text-sm text-muted-foreground">{stop.departure_time || "—"}</span>
                        }
                      >
                        <Input
                          type="time"
                          value={stop.departure_time}
                          onChange={(e) => updateField(stop._key, "departure_time", e.target.value)}
                          onClick={(e) => {
                            try {
                              e.currentTarget.showPicker();
                            } catch (err) {}
                          }}
                          className="h-8 text-sm cursor-pointer"
                          placeholder="HH:MM"
                        />
                      </PermissionGate>

                      <PermissionGate
                        can="update_transport_routes"
                        fallback={
                          <span className="text-sm text-muted-foreground">₹{stop.fare || "0.00"}</span>
                        }
                      >
                        <Input
                          type="number"
                          value={stop.fare === 0 ? "" : stop.fare}
                          onChange={(e) => updateField(stop._key, "fare", e.target.value === "" ? 0 : Number(e.target.value))}
                          className="h-8 text-sm"
                          placeholder="0.00"
                          min={0}
                        />
                      </PermissionGate>

                      {/* Remove */}
                      <div className="w-20 flex justify-end">
                        <PermissionGate can="update_transport_routes">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                className="text-destructive/50 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setDeleteTarget({ _key: stop._key, stopName: stop.stopName })}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove from route</TooltipContent>
                          </Tooltip>
                        </PermissionGate>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom save bar */}
              <PermissionGate can="update_transport_routes">
                {isDirty && (
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      ⚠ You have unsaved changes
                    </p>
                    <Button
                      size="sm"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                    >
                      <Save className="size-4" />
                      {saveMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </PermissionGate>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </>
  );
};

export default TransportRoutesShow;
