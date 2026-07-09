import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ContactsApi from "@/lib/api/contactApi";
import {
  STUDENT_SUPPORT_TICKET_DIALOG_FORM_LAYOUT,
  STUDENT_SUPPORT_TICKET_FORM_INITIAL_DATA,
} from "@/constants/page/admin/supportTicket";
import SupportTicketApi from "@/lib/api/supportTicketApi";
import { StudentSupportTicketSchema } from "@/lib/validations/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface TicketDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function TicketDialog({ open, onClose, data }: TicketDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(StudentSupportTicketSchema) as any,
    defaultValues: STUDENT_SUPPORT_TICKET_FORM_INITIAL_DATA,

    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { data: ticketDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["studentTicket", dataId],
    queryFn: () => ContactsApi.getContactsById(dataId),
    enabled: open && isEditMode,
  });
  const formLayout = useMemo(() => {
    return STUDENT_SUPPORT_TICKET_DIALOG_FORM_LAYOUT;
  }, []);

  useEffect(() => {
    if (isEditMode && ticketDetail) {
      const fullData = ticketDetail?.data;

      reset(ticketDetail.data);
    } else {
      reset(STUDENT_SUPPORT_TICKET_FORM_INITIAL_DATA);
    }
  }, [isEditMode, reset, ticketDetail]);

  const queryClient = useQueryClient();

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      //   isEditMode
      //     ? SupportTicketApi.updateFeeParticulars(dataId, submitData)
      // :
      SupportTicketApi.createSupportTicket(submitData),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({
        queryKey: ["studentTicket"],
      });
      queryClient.invalidateQueries({
        queryKey: ["SupportTicket"],
      });
      toast.success(res?.data?.message || "Ticket saved successfully");
      reset();
      onClose(false);
    },
    onError: (error: any) => {
      // Global mutationCache handles this
    },
  });

  const onSubmit = (data: any) => {
    handleMutation(data);
  };

  return (
    <ModalDialog
      title={isEditMode ? "View Ticket" : "Add Ticket"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSaving || isLoadingDetail}
      className="sm:max-w-5xl max-h-[85vh]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
