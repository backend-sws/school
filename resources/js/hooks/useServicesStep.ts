import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { AsyncSelectConfig } from "@/types";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import feeProfilesApi, { type FeeProfile } from "@/lib/api/feeProfilesApi";
import feeTypesApi from "@/lib/api/feeTypesApi";
import inventoryApi from "@/lib/api/inventoryApi";
import transportApi from "@/lib/api/transportApi";
import { hostelApi } from "@/lib/api/hostelApi";
import { FeeProfileQueryKeys } from "@/lib/querykey/feeProfile";
import { FeeTypeQueryKeys } from "@/lib/querykey/fees";
import { InventoryQueryKeys } from "@/lib/querykey/inventory";
import { TransportQueryKeys } from "@/lib/querykey/transport";
import { extractApiList, computeFeeBreakdown } from "@/lib/utils";

// ── Hook ────────────────────────────────────────────────────────────────

export function useServicesStep() {
  const { control, watch, getValues, setValue } = useFormContext<ApplicationDeskFormValues>();

  // ── Field Arrays ──────────────────────────────────────────────────
  const {
    append: appendFee,
    replace: replaceFee,
    fields: feeFields,
    remove: removeFee,
  } = useFieldArray({ control, name: "fees" });

  const {
    append: appendInventory,
    fields: inventoryFields,
    remove: removeInventory,
  } = useFieldArray({ control, name: "inventory_items" });

  // ── Local State ───────────────────────────────────────────────────
  const [selectedFeeId, setSelectedFeeId] = useState<string | number>("");
  const [selectedFeeName, setSelectedFeeName] = useState<string>("");
  const [selectedFeeCategory, setSelectedFeeCategory] = useState<string>("");
  const [addAmount, setAddAmount] = useState<number | string>(0);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | number>("");
  const [selectedInventoryMeta, setSelectedInventoryMeta] = useState<{ name: string; selling_price: number }>({ name: "", selling_price: 0 });
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    const saved = getValues("fee_regulation_profile_id");
    return saved ? String(saved) : "";
  });
  const isManualSwitchRef = useRef(false);
  // If we already have fees loaded from session, mark this profile as applied to prevent re-load
  const _savedProfileId = getValues("fee_regulation_profile_id");
  const _savedFees = getValues("fees");
  const profileIdAppliedRef = useRef<string>(
    _savedProfileId && Array.isArray(_savedFees) && _savedFees.length > 0
      ? String(_savedProfileId)
      : ""
  );

  // ── Fee Profile — Eager Load (for auto-default) ───────────────────

  const { data: feeProfilesRes } = useQuery({
    queryKey: FeeProfileQueryKeys.list(),
    queryFn: () => feeProfilesApi.index(),
  });

  const feeProfiles: FeeProfile[] = useMemo(
    () => extractApiList<FeeProfile>(feeProfilesRes),
    [feeProfilesRes],
  );

  /** Auto-select default profile on mount / remount */
  useEffect(() => {
    if (feeProfiles.length === 0 || selectedProfileId) return;
    const defaultProfile = feeProfiles.find((p) => p.is_default) ?? feeProfiles[0];
    if (defaultProfile) {
      setSelectedProfileId(String(defaultProfile.id));
      setValue("fee_regulation_profile_id", defaultProfile.id);
    }
  }, [feeProfiles, selectedProfileId, setValue]);

  /** Fetch selected profile detail */
  const { data: profileDetail, isFetching: isFetchingProfile } = useQuery({
    queryKey: FeeProfileQueryKeys.profileDetail(selectedProfileId),
    queryFn: () => feeProfilesApi.show(Number(selectedProfileId)),
    enabled: !!selectedProfileId,
  });

  /** Populate fee table when profile detail loads (ONLY for initial auto-load on mount) */
  useEffect(() => {
    if (!profileDetail || !selectedProfileId) return;

    const profile: any = profileDetail?.data ?? profileDetail;
    if (String(profile?.id) !== selectedProfileId) return;

    // Only run on initial auto-load, never on manual switches
    if (isManualSwitchRef.current) return;
    if (profileIdAppliedRef.current === selectedProfileId) return;
    profileIdAppliedRef.current = selectedProfileId;

    const items: any[] = profile?.items ?? [];
    const newFees = items.map((item: any) => ({
      fee_particular_id: item.fee_type_id,
      amount: Number(item.amount) || 0,
      _title: item.fee_type?.name ?? item.feeType?.name ?? "Fee",
      category: item.fee_type?.category ?? item.feeType?.category ?? "",
    }));

    console.log("🔥 [Auto-load] Replacing fees for profile:", profile?.id, newFees);
    replaceFee(newFees);
  }, [profileDetail, selectedProfileId, replaceFee]);

  // ── Transport — watch route for dependent stops ───────────────────
  const transportRouteId = useWatch({ control, name: "transport_route_id" });

  // ── Async Configs ─────────────────────────────────────────────────

  /** Fee Profile async config */
  const profileAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: async (params: Record<string, any>) => {
        const res = await feeProfilesApi.index(params);
        const items = extractApiList<FeeProfile>(res);
        const formatted = items.map((p) => ({
          ...p,
          _display_name: `${p.name}${p.is_default ? " (Default)" : ""}`,
        }));
        return { ...((res as any)?.data ?? res), data: formatted };
      },
      queryKey: FeeProfileQueryKeys.all,
      labelKey: "_display_name",
      valueKey: "id",
      searchKey: "search",
    }),
    [],
  );

  /** Fee Types async config (for manual add) */
  const feeTypeAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: (params: Record<string, any>) => feeTypesApi.index(params),
      queryKey: FeeTypeQueryKeys.all,
      labelKey: "name",
      valueKey: "id",
      searchKey: "search",
    }),
    [],
  );

  /** Inventory Items async config */
  const inventoryAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: (params: Record<string, any>) => inventoryApi.items.index(params),
      queryKey: InventoryQueryKeys.all,
      labelKey: "name",
      valueKey: "id",
      searchKey: "search",
    }),
    [],
  );

  /** Transport Routes async config */
  const transportRouteAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: (params: Record<string, any>) => transportApi.routes.index(params),
      queryKey: TransportQueryKeys.all,
      labelKey: "name",
      valueKey: "id",
      searchKey: "search",
    }),
    [],
  );

  /** Transport Stops async config (depends on selected route) */
  const transportStopAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: async (params: Record<string, any>) => {
        if (!transportRouteId) return { data: [] };
        const res = await transportApi.routeStops.index(Number(transportRouteId));
        // Transform route-stop pivot items to have flat name/id for the select
        const items = extractApiList<{
          id: number;
          transport_stop_id: number;
          transport_stop?: { id: number; name: string; code?: string };
          transportStop?: { id: number; name: string; code?: string };
        }>(res);
        const formatted = items.map((rs) => ({
          id: rs.transport_stop_id,
          name: rs.transportStop?.name ?? rs.transport_stop?.name ?? String(rs.transport_stop_id),
          fare: (rs as any).fare || 0,
        }));
        return { data: formatted };
      },
      queryKey: TransportQueryKeys.all,
      labelKey: "name",
      valueKey: "id",
      searchKey: "search",
      extraParams: { route_id: transportRouteId },
      enabled: !!transportRouteId,
    }),
    [transportRouteId],
  );

  // ── Handlers ──────────────────────────────────────────────────────

  // ── Callbacks ───────────────────────────────────────────────────────
  const handleProfileSelect = useCallback(async (profileId: string) => {
    console.log("🔥 Dropdown onChange triggered! New Profile ID:", profileId);
    isManualSwitchRef.current = true;
    setSelectedProfileId(profileId);
    setValue("fee_regulation_profile_id", profileId ? Number(profileId) : "");

    if (!profileId) {
      replaceFee([]);
      return;
    }

    try {
      const result = await feeProfilesApi.show(Number(profileId));
      const profile: any = result?.data ?? result;
      const items: any[] = profile?.items ?? [];
      const newFees = items.map((item: any) => ({
        fee_particular_id: item.fee_type_id,
        amount: Number(item.amount) || 0,
        _title: item.fee_type?.name ?? item.feeType?.name ?? "Fee",
        category: item.fee_type?.category ?? item.feeType?.category ?? "",
      }));

      console.log("🔥 [Manual switch] Replacing fees:", newFees);
      replaceFee(newFees);
      profileIdAppliedRef.current = profileId;
      toast.success(`Loaded ${newFees.length} fees for profile ${profile?.name ?? profile?.id}`);

      if (items.length === 0) {
        toast.info("This fee profile has no fee items.");
      }
    } catch (err) {
      console.error("Failed to load fee profile:", err);
      toast.error("Failed to load fee profile details.");
    }
  }, [replaceFee, setValue]);

  /** Fee type select changed — store id + name for later "Add" */
  const handleFeeSelectChange = useCallback((id: string | number, option?: any) => {
    setSelectedFeeId(id);
    setSelectedFeeName(option?.label ?? String(id));
    setSelectedFeeCategory(option?.raw?.category ?? "");
  }, []);

  const handleAddFee = useCallback(
    () => {
      if (!selectedFeeId) return;
      // Duplicate guard — prevent adding the same fee type twice
      const isDuplicate = feeFields.some(
        (f: any) => String(f.fee_particular_id) === String(selectedFeeId),
      );
      if (isDuplicate) {
        toast.warning("This fee type is already added.");
        return;
      }
      appendFee({
        fee_particular_id: Number(selectedFeeId),
        amount: Number(addAmount) || 0,
        _title: selectedFeeName,
        category: selectedFeeCategory,
      });
      setSelectedFeeId("");
      setSelectedFeeName("");
      setSelectedFeeCategory("");
      setAddAmount(0);
      toast.success(`Added: ${selectedFeeName}`);
    },
    [selectedFeeId, selectedFeeName, selectedFeeCategory, addAmount, appendFee, feeFields],
  );

  /** Inventory select changed — store id + metadata for later "Add" */
  const handleInventorySelectChange = useCallback((id: string | number, meta?: { name: string; selling_price: number }) => {
    setSelectedInventoryId(id);
    if (meta) setSelectedInventoryMeta(meta);
  }, []);

  const handleAddInventory = useCallback(() => {
    if (!selectedInventoryId) return;
    // Duplicate guard — prevent adding the same item twice
    const isDuplicate = inventoryFields.some(
      (f: any) => String(f.item_id) === String(selectedInventoryId),
    );
    if (isDuplicate) {
      toast.warning("This item is already added.");
      return;
    }
    appendInventory({
      item_id: Number(selectedInventoryId),
      quantity: 1,
      price: selectedInventoryMeta.selling_price,
      _title: selectedInventoryMeta.name,
    });
    setSelectedInventoryId("");
    setSelectedInventoryMeta({ name: "", selling_price: 0 });
    toast.success(`Item added: ${selectedInventoryMeta.name}`);
  }, [selectedInventoryId, selectedInventoryMeta, appendInventory, inventoryFields]);

  /** Route select — update form field */
  const handleRouteChange = useCallback(
    (val: any) => {
      setValue("transport_route_id" as any, val || "");
      // Clear stop when route changes
      setValue("transport_stop_id" as any, "");
    },
    [setValue],
  );

  /** Stop select — update form field */
  const handleStopChange = useCallback(
    (val: any, option?: any) => {
      setValue("transport_stop_id" as any, val || "");
      if (option && option.raw && option.raw.fare !== undefined) {
        setValue("transport_amount" as any, Number(option.raw.fare) || 0);
      } else {
        setValue("transport_amount" as any, 0);
      }
    },
    [setValue],
  );

  // ── Hostel ────────────────────────────────────────────────────────

  const hostelId = useWatch({ control, name: "hostel_id" as any });

  const hostelAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: async (params: Record<string, any>) => {
        const res = await hostelApi.hostels.index(params);
        return { data: extractApiList(res) };
      },
      queryKey: ["hostels", "list"],
      labelKey: "name",
      valueKey: "id",
      searchKey: "search",
    }),
    [],
  );

  const hostelRoomAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: async (params: Record<string, any>) => {
        if (!hostelId) return { data: [] };
        const res = await hostelApi.rooms.index({ ...params, hostel_id: hostelId, is_active: 1 });
        const items = extractApiList<any>(res);
        const formatted = items.map((r) => ({
          ...r,
          _display_name: `${r.room_number} (${r.type}) - ₹${r.monthly_fee}`,
        }));
        return { data: formatted };
      },
      queryKey: ["hostel-rooms", "list", hostelId],
      labelKey: "_display_name",
      valueKey: "id",
      searchKey: "search",
      extraParams: { hostel_id: hostelId, availability: "available" },
      enabled: !!hostelId,
    }),
    [hostelId],
  );

  const handleHostelChange = useCallback(
    (val: any) => {
      setValue("hostel_id" as any, val || null);
      setValue("hostel_room_id" as any, null);
      setValue("hostel_amount" as any, 0);
    },
    [setValue]
  );

  const handleHostelRoomChange = useCallback(
    (val: any, meta?: any) => {
      setValue("hostel_room_id" as any, val || null);
      if (meta && meta.raw && meta.raw.monthly_fee !== undefined) {
        setValue("hostel_amount" as any, Number(meta.raw.monthly_fee) || 0);
      } else {
        setValue("hostel_amount" as any, 0);
      }
    },
    [setValue]
  );

  // ── Totals (via shared utility) ───────────────────────────────────
  const fees = useWatch({ control, name: "fees" });
  const inventoryItems = useWatch({ control, name: "inventory_items" });
  const transportAmount = useWatch({ control, name: "transport_amount" });
  const transportStopId = useWatch({ control, name: "transport_stop_id" });
  const hostelRequired = useWatch({ control, name: "hostel_required" });
  const hostelAmount = useWatch({ control, name: "hostel_amount" });
  const discountAmount = useWatch({ control, name: "discount_amount" });

  const totals = useMemo(
    () =>
      computeFeeBreakdown({
        fees,
        inventory_items: inventoryItems,
        transport_amount: transportAmount,
        transport_stop_id: transportStopId,
        hostel_required: hostelRequired,
        hostel_amount: hostelAmount,
        discount_amount: discountAmount,
      }),
    [fees, inventoryItems, transportAmount, transportStopId, hostelRequired, hostelAmount, discountAmount],
  );

  // ── Return ────────────────────────────────────────────────────────

  return {
    control,
    watch,

    // Fee Profile
    profileAsyncConfig,
    selectedProfileId,
    isFetchingProfile,
    handleProfileSelect,

    // Fee Particulars
    feeFields,
    removeFee,
    feeTypeAsyncConfig,
    selectedFeeId,
    handleFeeSelectChange,
    addAmount,
    setAddAmount,
    handleAddFee,

    // Inventory
    inventoryFields,
    removeInventory,
    inventoryAsyncConfig,
    selectedInventoryId,
    handleInventorySelectChange,
    handleAddInventory,

    // Transport
    transportRouteId,
    transportRouteAsyncConfig,
    transportStopAsyncConfig,
    handleRouteChange,
    handleStopChange,

    // Hostel
    hostelId,
    hostelAsyncConfig,
    hostelRoomAsyncConfig,
    handleHostelChange,
    handleHostelRoomChange,

    // Totals
    totals,
  };
}
