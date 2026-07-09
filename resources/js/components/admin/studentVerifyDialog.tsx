import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Transition } from "@headlessui/react";
import { Loader2, Save, Undo2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import SettingsTip from "@/components/shared/SettingsTip";
import Each from "@/components/Each";
import { useMutation } from "@tanstack/react-query";
import { ADMISSION_VERIFICATION_FORM_LAYOUT } from "@/constants/page/admin/admissionVerification";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import AdmissionVerificationApi from "@/lib/api/AdmissionVerificationApi";
import { ModalDialog } from "../shared/Modal";
import StudentVerificationApi from "@/lib/api/StudentVerificationApi";

type AdmissionVerificationForm = {
  streamId: number | string;
  file: File[];
};

const StudentVerificationDialog = ({ open, onClose, selectedId }: any) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<AdmissionVerificationForm>({
    mode: "onChange",
  });
  console.log(selectedId);
  useEffect(() => {
    reset({
      streamId: selectedId || "",
      file: [],
    });
  }, [selectedId, reset]);

  const { mainStreams = [] } = useCollegeMainStreams({ enabled: true });

  const formLayout = useMemo(() => {
    return ADMISSION_VERIFICATION_FORM_LAYOUT.map((field) => {
      if (field.name === "streamId") {
        return { ...field, options: mainStreams };
      }
      return field;
    });
  }, [mainStreams]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (data: AdmissionVerificationForm) => {
      return StudentVerificationApi.uploadStudentDatabase(
        data.streamId,
        data.file[0], // single Excel file
      );
    },
    onSuccess: () => {
      toast.success("Student verification database uploaded successfully");
      reset();
    },
    onError: () => {
      toast.error("Failed to upload student database");
    },
  });

  const onSubmit = (data: AdmissionVerificationForm) => {
    handleMutation(data);
  };

  return (
    <ModalDialog
      title={"Add File"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSaving}
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
};

export default StudentVerificationDialog;
