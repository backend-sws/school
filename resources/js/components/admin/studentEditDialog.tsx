import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { useMemo, useEffect, useState } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useForm } from "react-hook-form";
import {
  getStudentEditFormLayoutGroups,
  buildStudentEditPayload,
} from "@/constants/page/admin/student";
import { omitKeys, ADDRESS_COPY_OMIT_KEYS } from "@/lib/helpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StudentApi from "@/lib/api/studentApi";
import { StudentQueryKeys } from "@/lib/querykey/student";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import { useCollegeSubject } from "@/hooks/useSubjects";

interface StudentEditDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  studentData: any | null;
  //   courses: Course[];
}

export function StudentEditDialog({
  open,
  onClose,
  studentData,
}: StudentEditDialogProps) {
  const isEditMode = !!studentData?.id;
  const selectedId = studentData?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-edit", selectedId],
    queryFn: async () => {
      const res = await StudentApi.getCandidateById(selectedId);
      return res?.data;
    },
    enabled: (open && !!selectedId) || false,
  });
  const [selectedMainStreamId, setSelectedMainStreamId] = useState<
    number | null
  >(null);
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>();
  // Fetch main streams
  const { mainStreams = [], isLoading: mainStreamLoading } =
    useCollegeMainStreams({ enabled: open && !!selectedId });

  // Fetch streams based on selected main stream (only when modal is open)
  const { streams = [], isLoading: streamLoading } = useCollegeStreams({
    main_stream_id: selectedMainStreamId,
    enabled: open,
  });

  // Fetch subjects based on selected stream (only when modal is open)
  const { subjects = [], isLoading: subjectLoading } = useCollegeSubject({
    stream_id: selectedStreamId,
    enabled: open && !!selectedStreamId,
  });

  // Fetch sessions based on selected stream
  const { sessions = [], isLoading: sessionLoading } =
    useCollegeSessions({ streamId: selectedStreamId, enabled: !!selectedStreamId });

  const dropdownOptions = useMemo(() => {
    return {
      main_streams: mainStreams,
      streams: streams,
      sessions: sessions,
      subjects: subjects,
    };
  }, [mainStreams, streams, sessions, subjects]);

  const transformedData = useMemo(() => {
    if (!data) return undefined;

    const user = data;
    const profile = user.student_profile;

    return {
      // Top level user fields
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || profile?.mobile,

      // Academic fields
      reg_no: user.reg_no,
      main_stream_id: profile?.main_stream_id,
      stream_id: profile?.stream_id,
      session_id: profile?.session_id,
      subject_id: profile?.subject_id,

      // Student profile fields (flattened)
      roll_no: profile?.roll_no,
      current_semester: profile?.current_semester,
      dob: profile?.dob,
      gender: profile?.gender,
      blood_group: profile?.blood_group,
      aadhar_no: profile?.aadhar_no,
      father_name: profile?.father_name,
      father_mobile: profile?.father_mobile,
      father_qualification: profile?.father_qualification,
      father_occupation: profile?.father_occupation,
      mother_name: profile?.mother_name,
      category: profile?.category,
      caste: profile?.caste,
      nationality: profile?.nationality,
      is_differently_abled: profile?.is_differently_abled,

      // Nested address objects
      permanent_address: profile?.permanent_address || {},
      correspondence_address: profile?.correspondence_address || {},
      copy_correspondence: false,
    };
  }, [data]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ values: transformedData });

  // Watch main_stream_id and stream_id for cascading dropdowns
  const mainStreamIdValue = watch("main_stream_id" as const);
  const streamIdValue = watch("stream_id" as const);
  const session_id = watch("session_id" as const);
  const watchCopyChecked = watch("copy_correspondence" as const);

  // Update selected main stream and reset dependent fields
  useEffect(() => {
    if (mainStreamIdValue) {
      setSelectedMainStreamId(mainStreamIdValue as number | null);
      // Reset stream and subject when main stream changes
      setSelectedStreamId(null);
      setValue("stream_id" as const, null);
      setValue("subject_id" as const, null);
    }
  }, [mainStreamIdValue, setValue]);

  // Update selected stream and reset dependent fields
  useEffect(() => {
    if (streamIdValue) {
      setSelectedStreamId(streamIdValue as number | null);
      // Reset subject when stream changes
      setValue("subject_id" as const, null);
    }
  }, [streamIdValue, setValue]);
  useEffect(() => {
    if (session_id) {
      setSelectedSessionId(session_id as number | null);
    }
  }, [session_id]);

  // Copy correspondence address to permanent address
  useEffect(() => {
    if (!watchCopyChecked) return;
    const values = getValues();
    const corr = values?.correspondence_address as Record<string, unknown> | undefined;
    if (!corr) return;
    const toCopy = omitKeys(corr, ADDRESS_COPY_OMIT_KEYS);
    Object.entries(toCopy).forEach(([key, val]) =>
      setValue(`permanent_address.${key}`, val),
    );
  }, [watchCopyChecked, setValue, getValues]);

  const formGroups = useMemo(() => getStudentEditFormLayoutGroups(undefined), []);
  const { basicFields, copyCheckboxField, permanentAddressFields, correspondenceAddressFields } = formGroups;

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (submitData: any) => {
      const result = await StudentApi.updateCandidate(selectedId, submitData);
      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudentQueryKeys.all });
      toast.success("Student updated successfully");
      onClose(false);
    },
    onError: (error: any) => {
      // Global mutationCache handles this
    },
  });

  const onSubmit = (formData: Record<string, unknown>) => {
    updateMutation.mutate(buildStudentEditPayload(formData));
  };

  const handleCopyAddressClick = () => {
    const values = getValues();
    const corr = values?.correspondence_address as Record<string, unknown> | undefined;
    if (!corr) return;
    const toCopy = omitKeys(corr, ADDRESS_COPY_OMIT_KEYS);
    Object.entries(toCopy).forEach(([key, val]) =>
      setValue(`permanent_address.${key}`, val),
    );
    toast.success("Correspondence address copied to permanent address");
  };

  return (
    <ModalDialog
      title="Edit Student"
      open={open}
      onClose={onClose}
      className="sm:max-w-5xl max-h-[90vh]"
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={updateMutation.isPending}
      submitLabel="Save"
    >
      <div className="overflow-y-auto pr-2 space-y-6">
        {/* Main form fields: 1 column on small screens, 2 on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Each
            of={basicFields}
            render={(form: any) => {
              // Add dynamic options to dropdown fields
              const formWithOptions = { ...form };
              if (
                form.optionsKey &&
                dropdownOptions[form.optionsKey as keyof typeof dropdownOptions]
              ) {
                formWithOptions.options =
                  dropdownOptions[
                  form.optionsKey as keyof typeof dropdownOptions
                  ];
              }
              // Disable dropdown if dependent field is not selected
              if (form.dependsOn) {
                const dependentValue = watch(form.dependsOn);
                const isLoading =
                  (form.optionsKey === "streams" && streamLoading) ||
                  (form.optionsKey === "sessions" && sessionLoading) ||
                  (form.optionsKey === "subjects" && subjectLoading);
                formWithOptions.disabled = !dependentValue || isLoading;
              }
              return (
                <ControlledFormComponent
                  control={control}
                  {...formWithOptions}
                />
              );
            }}
          />
        </div>
        {/* Copy Correspondence Checkbox & Button */}
        {copyCheckboxField && (
          <div className="py-3 border-t space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {/* @ts-ignore */}
                <ControlledFormComponent
                  control={control}
                  {...copyCheckboxField}
                />
              </div>
              <Button
                type="button"
                onClick={handleCopyAddressClick}
                variant="outline"
                className="whitespace-nowrap"
              >
                Copy Address
              </Button>
            </div>
          </div>
        )}
        {/* Addresses: stack on small screens, 2 columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          {/* Correspondence Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Correspondence Address</h3>
            <div className="space-y-3">
              <Each
                of={correspondenceAddressFields}
                render={(form: any) => (
                  <ControlledFormComponent control={control} {...form} />
                )}
              />
            </div>
          </div>
          {/* Permanent Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Permanent Address</h3>
            <div className="space-y-3">
              <Each
                of={permanentAddressFields}
                render={(form: any) => (
                  <ControlledFormComponent control={control} {...form} />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
