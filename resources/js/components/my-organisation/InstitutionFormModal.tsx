import React, { useEffect } from "react";
import { ModalDialog } from "@/components/shared/Modal";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import InstitutionApi from "@/lib/api/institutionApi";
import type { Institution } from "@/lib/api/institutionApi";
import {
  INSTITUTION_DIALOG_FORM_LAYOUT,
  INSTITUTION_FORM_INITIAL_DATA,
} from "@/constants/page/my-organisation/institutionForm";
import { InstitutionFormSchema, type InstitutionFormValues } from "@/lib/validations/institution";
import { toast } from "sonner";

interface InstitutionFormModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  organizationId: number;
  data?: Institution | null;
}

export function InstitutionFormModal({
  open,
  onClose,
  organizationId,
  data,
}: InstitutionFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<InstitutionFormValues>({
    resolver: zodResolver(InstitutionFormSchema),
    defaultValues: INSTITUTION_FORM_INITIAL_DATA,
    mode: "onChange",
  });

  const { data: institutionDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["institution", dataId],
    queryFn: () => InstitutionApi.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  useEffect(() => {
    if (!open) return;
    if (isEditMode && institutionDetail?.data) {
      const d = institutionDetail.data as Institution;
      reset({
        name: d.name ?? "",
        code: d.code ?? "",
        type: (d.type as InstitutionFormValues["type"]) ?? "",
        address: d.address ?? "",
        city: d.city ?? "",
        state: d.state ?? "",
        pincode: d.pincode ?? "",
        phone: d.phone ?? "",
        email: d.email ?? "",
        website: d.website ?? "",
      });
    } else {
      reset(INSTITUTION_FORM_INITIAL_DATA);
    }
  }, [open, isEditMode, institutionDetail, reset]);

  const { mutate: submitMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: InstitutionFormValues) => {
      const body: Record<string, unknown> = {
        ...payload,
        organization_id: organizationId,
        type: payload.type || undefined,
      };
      if (isEditMode && dataId) {
        return InstitutionApi.update(dataId, body);
      }
      return InstitutionApi.store(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organizations", organizationId, "institutions"] });
      toast.success(isEditMode ? "Institution updated." : "Institution created.");
      onClose(false);
    },
  });

  const onSubmit = (values: InstitutionFormValues) => {
    submitMutation(values);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit institution" : "Add institution"}
      description={isEditMode ? "Update institution details." : "Create a new institution under this organisation."}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSaving || (isEditMode && isLoadingDetail)}
      submitLabel={isEditMode ? "Update" : "Create"}
      primaryDisabled={!isDirty && isEditMode}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Each
          of={INSTITUTION_DIALOG_FORM_LAYOUT}
          render={(field) => (
            <ControlledFormComponent<InstitutionFormValues>
              key={field.name}
              control={control}
              {...field}
              className={field.name === "address" ? "col-span-full" : ""}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
