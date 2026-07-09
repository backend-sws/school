import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useQuery } from "@tanstack/react-query";
import {
  CONTACT_DIALOG_FORM_LAYOUT,
  CONTACT_FORM_INITIAL_DATA,
} from "@/constants/page/admin/contact";
import ContactsApi from "@/lib/api/contactApi";

interface ContactDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function ContactDialog({ open, onClose, data }: ContactDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(ContactDialogFormSchema) as any,
    defaultValues: CONTACT_FORM_INITIAL_DATA,

    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { data: subjectMappingDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["contacts", dataId],
    queryFn: () => ContactsApi.getContactsById(dataId),
    enabled: open && isEditMode,
  });
  const formLayout = useMemo(() => {
    return CONTACT_DIALOG_FORM_LAYOUT;
  }, []);

  useEffect(() => {
    if (isEditMode && subjectMappingDetail) {
      const fullData = subjectMappingDetail?.data;

      reset({
        name: fullData?.name,
        status: fullData?.status,
        email: fullData?.email,
        mobile: fullData?.mobile,
        subject: fullData.subject,
        message: fullData?.message,
        created_at: fullData?.created_at,
      });
    } else {
      reset(CONTACT_FORM_INITIAL_DATA);
    }
  }, [isEditMode, reset, subjectMappingDetail]);

  // Note: This dialog is view-only. The mutation was vestigial from
  // a copy-paste of the old fee particulars dialog and is removed.

  return (
    <ModalDialog
      title={isEditMode ? "View Contact" : "Contact Details"}
      open={open}
      onClose={onClose}
      isLoading={isLoadingDetail}
    >
      <div className="grid gap-1">
        <Each
          of={formLayout}
          render={(form: any) => (
            <ControlledFormComponent
              control={control}
              options={form.options}
              {...form}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
