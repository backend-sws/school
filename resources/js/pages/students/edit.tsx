import { useEffect, useMemo, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import FullPageLayout from "@/layouts/full-page-layout";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StudentApi from "@/lib/api/studentApi";
import { StudentQueryKeys } from "@/lib/querykey/student";
import {
  getStudentEditFormLayoutGroups,
  buildStudentEditPayload,
} from "@/constants/page/admin/student";
import { get, omitKeys, pick, ADDRESS_COPY_OMIT_KEYS } from "@/lib/helpers";
import { APPLICATION_DESK_DOCUMENT_FIELDS } from "@/constants/admission/application";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import { useCollegeSubject } from "@/hooks/useSubjects";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentEditSchema, type StudentEditFormValues } from "@/lib/validations/student";

const StudentEdit = () => {
  const { props } = usePage();
  const id = (props as unknown as { id?: string | number }).id;
  const scopeType = (props as unknown as { institution?: { type?: string } }).institution?.type ?? null;
  const queryClient = useQueryClient();
  const [selectedMainStreamId, setSelectedMainStreamId] = useState<
    number | null
  >(null);
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["student-edit", id],
    queryFn: async () => {
      const res = await StudentApi.getCandidateById(id);
      return res?.data;
    },
    enabled: !!id,
  });

  const { mainStreams = [] } = useCollegeMainStreams({ enabled: !!id });
  const { streams = [], isLoading: streamLoading } = useCollegeStreams({
    main_stream_id: selectedMainStreamId,
    enabled: true,
  });
  const { subjects = [], isLoading: subjectLoading } = useCollegeSubject({
    stream_id: selectedStreamId,
    enabled: !!selectedStreamId,
  });
  const { sessions = [], isLoading: sessionLoading } = useCollegeSessions({
    enabled: true,
  });

  const dropdownOptions = useMemo(
    () => ({
      main_streams: mainStreams,
      streams,
      sessions,
      subjects,
    }),
    [mainStreams, streams, sessions, subjects]
  );

  const transformedData = useMemo(() => {
    if (!data) return undefined;
    const profile = get(data, "student_profile") ?? get(data, "studentProfile");
    
    const docRecord = (data.documents ?? []).reduce((acc: Record<string, string>, doc: any) => {
      acc[doc.doc_type] = doc.file_url;
      return acc;
    }, {});

    // Top-level user fields
    const userFields = {
      id: data.id,
      name: data.name ?? "",
      email: data.email ?? "",
      mobile: data.mobile ?? "",
      reg_no: data.reg_no ?? profile?.reg_no ?? "",
      photo_url: data.photo_url ?? "",
    };

    return {
      ...userFields,
      main_stream_id: Number(profile?.main_stream_id ?? 0),
      stream_id: Number(profile?.stream_id ?? 0),
      session_id: Number(profile?.session_id ?? 0),
      roll_no: profile?.roll_no ?? "",
      dob: profile?.dob ?? "",
      gender: profile?.gender ?? "",
      blood_group: profile?.blood_group ?? "",
      aadhar_no: profile?.aadhar_no ?? "",
      father_name: profile?.father_name ?? "",
      father_mobile: profile?.father_mobile ?? "",
      father_qualification: profile?.father_qualification ?? "",
      father_occupation: profile?.father_occupation ?? "",
      mother_name: profile?.mother_name ?? "",
      category: profile?.category ?? "",
      caste: profile?.caste ?? "",
      religion: profile?.religion ?? "",
      nationality: profile?.nationality ?? "",
      is_differently_abled: !!profile?.is_differently_abled,
      disability_type: profile?.disability_type ?? "",
      medical_condition: profile?.medical_condition ?? "",
      allergy: profile?.allergy ?? "",
      abc_no: profile?.abc_no ?? "",
      apaar_id: profile?.apaar_id ?? "",
      has_government_portal: !!profile?.has_government_portal,
      government_portal_name: profile?.government_portal_name ?? "",
      previous_school_name: profile?.previous_school_name ?? "",
      previous_board: profile?.previous_board ?? "",
      previous_marks: profile?.previous_marks ?? "",
      previous_roll_no: profile?.previous_roll_no ?? "",
      has_tc: !!profile?.has_tc,
      guardian_snapshot: {
        name: profile?.guardian_snapshot?.name ?? "",
        occupation: profile?.guardian_snapshot?.occupation ?? "",
        aadhaar_no: profile?.guardian_snapshot?.aadhaar_no ?? "",
        income: profile?.guardian_snapshot?.income ?? "",
        local_guardian: {
          name: profile?.guardian_snapshot?.local_guardian?.name ?? "",
          phone: profile?.guardian_snapshot?.local_guardian?.phone ?? "",
          relationship: profile?.guardian_snapshot?.local_guardian?.relationship ?? "",
        },
      },
      permanent_address: {
        village_mohalla: profile?.permanent_address?.village_mohalla ?? "",
        post_office: profile?.permanent_address?.post_office ?? "",
        police_station: profile?.permanent_address?.police_station ?? "",
        district: profile?.permanent_address?.district ?? "",
        state: profile?.permanent_address?.state ?? "",
        pincode: profile?.permanent_address?.pincode ?? "",
      },
      correspondence_address: {
        village_mohalla: profile?.correspondence_address?.village_mohalla ?? "",
        post_office: profile?.correspondence_address?.post_office ?? "",
        police_station: profile?.correspondence_address?.police_station ?? "",
        district: profile?.correspondence_address?.district ?? "",
        state: profile?.correspondence_address?.state ?? "",
        pincode: profile?.correspondence_address?.pincode ?? "",
      },
      copy_correspondence: false,
      documents: docRecord,
    } as StudentEditFormValues;
  }, [data]);

  const formGroups = useMemo(
    () => getStudentEditFormLayoutGroups(scopeType),
    [scopeType]
  );
  const { 
    basicFields, 
    copyCheckboxField, 
    permanentAddressFields, 
    correspondenceAddressFields,
    medicalFields,
    academicFields,
    govtIdFields,
    guardianFields
  } = formGroups;

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StudentEditFormValues>({ 
    resolver: zodResolver(studentEditSchema) as any,
    values: transformedData,
  });

  const mainStreamIdValue = watch("main_stream_id");
  const streamIdValue = watch("stream_id");
  const session_id = watch("session_id");
  const watchCopyChecked = watch("copy_correspondence");

  useEffect(() => {
    if (mainStreamIdValue) {
      setSelectedMainStreamId(Number(mainStreamIdValue));
    }
  }, [mainStreamIdValue]);

  useEffect(() => {
    if (streamIdValue) {
      setSelectedStreamId(Number(streamIdValue));
    }
  }, [streamIdValue]);

  useEffect(() => {
    if (session_id) setSelectedSessionId(Number(session_id));
  }, [session_id]);

  useEffect(() => {
    if (!watchCopyChecked) return;
    const values = getValues();
    const corr = values?.correspondence_address;
    if (!corr) return;

    const fields = ["village_mohalla", "post_office", "police_station", "district", "state", "pincode"] as const;
    fields.forEach((field) => {
      setValue(`permanent_address.${field}` as any, corr[field]);
    });
  }, [watchCopyChecked, setValue, getValues]);

  const updateMutation = useMutation({
    mutationFn: async (submitData: any) => {
      const result = await StudentApi.updateCandidate(id, submitData);
      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudentQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["student-show", id] });
      queryClient.invalidateQueries({ queryKey: ["student-edit", id] });
      toast.success("Student updated successfully");
      router.visit(`/students/manage/${id}`);
    },
    onError: (error: any) => {
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        Object.entries(backendErrors).forEach(([key, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : (messages as string);
          let formKey = key;
          if (key.startsWith("student_profile.")) {
            formKey = key.replace("student_profile.", "");
          }
          setError(formKey as any, {
            type: "server",
            message: msg,
          });
        });
      }
      toast.error(error?.response?.data?.message ?? "Failed to update student");
    }
  });

  const onSubmit = (formData: StudentEditFormValues) => {
    updateMutation.mutate(buildStudentEditPayload(formData));
  };

  const onInvalid = (errors: any) => {
    const getFirstMessage = (errObj: any): string | undefined => {
      if (!errObj) return undefined;
      if (errObj.message) return errObj.message;
      for (const key in errObj) {
        const msg = getFirstMessage(errObj[key]);
        if (msg) return msg;
      }
      return undefined;
    };
    
    const specificMessage = getFirstMessage(errors);
    toast.error(specificMessage || "Please check the form for validation errors.");
  };

  const handleCopyAddressClick = () => {
    const values = getValues();
    const corr = values?.correspondence_address as Record<string, unknown> | undefined;
    if (!corr) return;
    const toCopy = omitKeys(corr, ADDRESS_COPY_OMIT_KEYS);
    Object.entries(toCopy).forEach(([key, val]) =>
      setValue(`permanent_address.${key}` as any, val)
    );
    toast.success("Correspondence address copied to permanent address");
  };

  const breadcrumbs = [
    { title: "Student Hub", href: "/students/manage" },
    { title: "Student List", href: "/students/manage" },
    {
      title: data?.name ? `Edit ${data.name}` : "Edit Student",
      href: `/students/manage/${id}/edit`,
    },
  ];

  if (!id) {
    return (
      <>
        <Head title="Edit Student" />
        <div className="p-4 sm:p-6">Invalid student.</div>
      </>
    );
  }

  return (
    <>
      <Head title={data?.name ? `Edit ${data.name}` : "Edit Student"} />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Edit Student</CardTitle>
            <Link href={`/students/manage/${id}`}>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-2/3" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Each
                    of={basicFields}
                    render={(form: any) => {
                      const formWithOptions = { ...form };
                      if (
                        form.optionsKey &&
                        dropdownOptions[
                          form.optionsKey as keyof typeof dropdownOptions
                        ]
                      ) {
                        formWithOptions.options =
                          dropdownOptions[
                            form.optionsKey as keyof typeof dropdownOptions
                          ];
                      }
                      if (form.dependsOn) {
                        const dependentValue = watch(form.dependsOn);
                        const isLoading =
                          (form.optionsKey === "streams" && streamLoading) ||
                          (form.optionsKey === "sessions" && sessionLoading) ||
                          (form.optionsKey === "subjects" && subjectLoading);
                        formWithOptions.disabled =
                          !dependentValue || isLoading;
                      }
                      const { control: _c, ...rest } = formWithOptions as Record<string, unknown>;
                      return (
                        <ControlledFormComponent
                          key={form.name}
                          control={control}
                          {...(rest as any)}
                        />
                      );
                    }}
                  />
                </div>

                {copyCheckboxField && (() => {
                  const { control: _c, ...rest } = copyCheckboxField as Record<string, unknown>;
                  return (
                  <div className="py-3 border-t space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <ControlledFormComponent
                          control={control}
                          {...(rest as any)}
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
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Correspondence Address
                    </h3>
                    <div className="space-y-3">
                      <Each
                        of={correspondenceAddressFields}
                        render={(form: any) => (
                          <ControlledFormComponent
                            key={form.name}
                            control={control}
                            {...form}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Permanent Address
                    </h3>
                    <div className="space-y-3">
                      <Each
                        of={permanentAddressFields}
                        render={(form: any) => (
                          <ControlledFormComponent
                            key={form.name}
                            control={control}
                            {...form}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>


                {/* Additional Sections added from Admission */}
                {medicalFields.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4">Medical Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Each
                        of={medicalFields}
                        render={(form: any) => (
                          <ControlledFormComponent key={form.name} control={control} {...form} />
                        )}
                      />
                    </div>
                  </div>
                )}

                {academicFields.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4">Previous Academic Records</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Each
                        of={academicFields}
                        render={(form: any) => (
                          <ControlledFormComponent key={form.name} control={control} {...form} />
                        )}
                      />
                    </div>
                  </div>
                )}

                {govtIdFields.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4">Government IDs & Portals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Each
                        of={govtIdFields}
                        render={(form: any) => {
                          const formWithOptions = { ...form };
                          if (form.dependsOn) {
                            const dependentValue = watch(form.dependsOn);
                            formWithOptions.disabled = !dependentValue;
                          }
                          const { control: _c, ...rest } = formWithOptions;
                          return (
                            <ControlledFormComponent key={form.name} control={control} {...(rest as any)} />
                          );
                        }}
                      />
                    </div>
                  </div>
                )}

                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-lg mb-4">Uploaded Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload required documents (PDF or image). You can add or replace files before saving.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Each
                      of={APPLICATION_DESK_DOCUMENT_FIELDS}
                      render={(form: any) => (
                        <ControlledFormComponent key={form.name} control={control} {...form} />
                      )}
                    />
                  </div>
                </div>

                {guardianFields.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4">Guardian Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Each
                        of={guardianFields}
                        render={(form: any) => (
                          <ControlledFormComponent key={form.name} control={control} {...form} />
                        )}
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving…" : "Save changes"}
                  </Button>
                  <Link href={`/students/manage/${id}`}>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

StudentEdit.layoutProps = (props: any) => ({
  backHref: `/students/manage/${props.id}`,
  backLabel: "Back to Student",
});

export default StudentEdit;
