import React, { useEffect, useMemo, useRef } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  INVENTORY_ITEM_FORM_INITIAL,
  INVENTORY_ITEM_DIALOG_FORM_LAYOUT_DETAILS,
  INVENTORY_ITEM_DIALOG_FORM_LAYOUT_PRICING,
} from "@/constants/page/admin/inventory";
import {
  InventoryItemFormSchema,
  type InventoryItemFormValues,
  type InventoryItemFormInputValues,
} from "@/lib/validations/inventory";

type PriceMarginSource = "purchase" | "selling" | "margin" | null;

interface InventoryItemDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: {
    id: number;
    name: string;
    code?: string;
    unit?: string;
    min_stock?: number;
    location?: string;
    description?: string;
    is_active?: boolean;
    inventory_category_id?: number;
    selling_price?: number;
    purchase_price?: number;
    margin_percentage?: number;
    gst_rate?: number;
    hsn_code?: string;
  } | null;
}

export function InventoryItemDialog({ open, onClose, data }: InventoryItemDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const lastPriceMarginSourceRef = useRef<PriceMarginSource>(null);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InventoryItemFormInputValues>({
    resolver: zodResolver(InventoryItemFormSchema),
    defaultValues: INVENTORY_ITEM_FORM_INITIAL as InventoryItemFormInputValues,
    mode: "onChange",
  });

  const purchase_price = watch("purchase_price");
  const selling_price = watch("selling_price");
  const margin_percentage = watch("margin_percentage");

  useEffect(() => {
    const purchase =
      purchase_price !== "" &&
      purchase_price !== undefined &&
      !Number.isNaN(Number(purchase_price))
        ? Number(purchase_price)
        : null;
    const selling =
      selling_price !== "" &&
      selling_price !== undefined &&
      !Number.isNaN(Number(selling_price))
        ? Number(selling_price)
        : null;
    const margin =
      margin_percentage !== "" &&
      margin_percentage !== undefined &&
      !Number.isNaN(Number(margin_percentage))
        ? Number(margin_percentage)
        : null;
    const source = lastPriceMarginSourceRef.current;

    if (source === "selling" && purchase != null && purchase > 0 && selling != null) {
      const m = ((selling - purchase) / purchase) * 100;
      if (!Number.isNaN(m)) {
        lastPriceMarginSourceRef.current = null;
        setValue("margin_percentage", Math.round(m * 100) / 100);
      }
      return;
    }
    if (source === "margin" && purchase != null && purchase > 0 && margin != null) {
      const s = purchase * (1 + margin / 100);
      if (!Number.isNaN(s)) {
        lastPriceMarginSourceRef.current = null;
        setValue("selling_price", Math.round(s * 100) / 100);
      }
      return;
    }
    if (source === "purchase" && purchase != null && purchase > 0) {
      lastPriceMarginSourceRef.current = null;
      if (selling != null) {
        const m = ((selling - purchase) / purchase) * 100;
        if (!Number.isNaN(m)) setValue("margin_percentage", Math.round(m * 100) / 100);
      } else if (margin != null) {
        const s = purchase * (1 + margin / 100);
        if (!Number.isNaN(s)) setValue("selling_price", Math.round(s * 100) / 100);
      }
    }
  }, [purchase_price, selling_price, margin_percentage, setValue]);

  const { data: itemDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["inventory-item", dataId],
    queryFn: () => inventoryApi.items.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: () => inventoryApi.categories.index({ per_page: 100 }),
    enabled: open,
  });

  const { data: locationsData } = useQuery({
    queryKey: ["inventory-locations"],
    queryFn: () => inventoryApi.locations.index({ per_page: 100 }),
    enabled: open,
  });

  const categoriesOptions = useMemo(() => {
    const items = (categoriesData as any)?.data ?? categoriesData ?? [];
    return (Array.isArray(items) ? items : []).map((c: any) => ({
      key: String(c.id),
      value: c.id,
      text: c.name,
    }));
  }, [categoriesData]);

  const locationsOptions = useMemo(() => {
    const items = (locationsData as any)?.data ?? locationsData ?? [];
    return (Array.isArray(items) ? items : []).map((l: any) => ({
      key: l.name,
      value: l.name,
      text: l.name,
    }));
  }, [locationsData]);

  const detailsLayout = useMemo(() => {
    return INVENTORY_ITEM_DIALOG_FORM_LAYOUT_DETAILS.map((field) => {
      if (field.name === "inventory_category_id") {
        return { ...field, options: categoriesOptions };
      }
      if (field.name === "location") {
        return { ...field, options: locationsOptions };
      }
      return field;
    });
  }, [categoriesOptions, locationsOptions]);

  const pricingLayout = useMemo(
    () =>
      INVENTORY_ITEM_DIALOG_FORM_LAYOUT_PRICING.map((field) => {
        if (field.name === "purchase_price") {
          return {
            ...field,
            onValueChange: () => {
              lastPriceMarginSourceRef.current = "purchase";
            },
          };
        }
        if (field.name === "selling_price") {
          return {
            ...field,
            onValueChange: () => {
              lastPriceMarginSourceRef.current = "selling";
            },
          };
        }
        if (field.name === "margin_percentage") {
          return {
            ...field,
            onValueChange: () => {
              lastPriceMarginSourceRef.current = "margin";
            },
          };
        }
        return field;
      }),
    [],
  );

  const watchedSelling = watch("selling_price");
  const watchedGst = watch("gst_rate");
  const finalPriceInclGst = useMemo(() => {
    const s =
      watchedSelling !== "" &&
      watchedSelling !== undefined &&
      !Number.isNaN(Number(watchedSelling))
        ? Number(watchedSelling)
        : null;
    const g =
      watchedGst !== "" &&
      watchedGst !== undefined &&
      !Number.isNaN(Number(watchedGst))
        ? Number(watchedGst)
        : null;
    if (s == null || s < 0) return null;
    if (g == null || g <= 0) return s;
    return Math.round(s * (1 + g / 100) * 100) / 100;
  }, [watchedSelling, watchedGst]);

  const itemDetailData = itemDetail?.data ?? itemDetail;

  useEffect(() => {
    if (isEditMode && itemDetailData?.id) {
      const num = (v: unknown): number | "" =>
        v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : "";
      reset({
        inventory_category_id: itemDetailData.inventory_category_id || "",
        name: itemDetailData.name ?? "",
        code: itemDetailData.code ?? "",
        unit: itemDetailData.unit ?? "piece",
        min_stock: num(itemDetailData.min_stock),
        purchase_price: num(itemDetailData.purchase_price),
        selling_price: num(itemDetailData.selling_price),
        margin_percentage: num(itemDetailData.margin_percentage),
        gst_rate: num(itemDetailData.gst_rate),
        hsn_code: itemDetailData.hsn_code ?? "",
        location: itemDetailData.location ?? "",
        description: itemDetailData.description ?? "",
        is_active: itemDetailData.is_active !== false,
      } as InventoryItemFormInputValues);
    } else {
      reset(INVENTORY_ITEM_FORM_INITIAL as InventoryItemFormInputValues);
    }
  }, [isEditMode, itemDetailData, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: InventoryItemFormValues) =>
      isEditMode
        ? inventoryApi.items.update(dataId!, payload)
        : inventoryApi.items.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-low-stock"] });
      reset(INVENTORY_ITEM_FORM_INITIAL);
      onClose(false);
    },
  });

  const onSubmit = (formData: InventoryItemFormValues) => {
    const payload: InventoryItemFormValues = {
      ...formData,
      is_active: true,
      min_stock: formData.min_stock ?? undefined,
      purchase_price: formData.purchase_price ?? undefined,
      selling_price: formData.selling_price ?? undefined,
      margin_percentage: formData.margin_percentage ?? undefined,
      gst_rate: formData.gst_rate ?? undefined,
    };
    handleMutation(payload);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Item" : "Add Item"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data) => onSubmit(data as InventoryItemFormValues))}
      isLoading={isSaving || (isEditMode && isLoadingDetail)}
      className="sm:max-w-[520px]"
    >
      <div className="grid gap-6">
        <div className="grid gap-4">
          <h3 className="text-sm font-semibold text-foreground">Item details</h3>
          <Each
            of={detailsLayout}
            render={(form: any) => (
              <ControlledFormComponent<InventoryItemFormInputValues>
                {...form}
                control={control}
              />
            )}
          />
        </div>
        <div className="grid gap-4">
          <h3 className="text-sm font-semibold text-foreground">
            Pricing, margin & final price
          </h3>
          <Each
            of={pricingLayout}
            render={(form: any) => (
              <ControlledFormComponent<InventoryItemFormInputValues>
                {...form}
                control={control}
              />
            )}
          />
          {finalPriceInclGst != null && (
            <p className="text-sm text-muted-foreground">
              Final price (incl. GST): ₹{finalPriceInclGst.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
