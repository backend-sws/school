import Heading from "@/components/heading";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  STUDENT_ADMISSION_FORM_FIELDS,
  STUDENT_ADMISSION_FORM_INITIAL_DATA,
} from "@/constants/page/admin/studentAdmission";
import { FORM_TYPE } from "@/constants/shared/form";
import AdmissionApi from "@/lib/api/student/admissionApi";
import { StudentAdmissionFormSchema } from "@/lib/validations/studentAdmission";
import { BreadcrumbItem } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Megaphone, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import Each from '@/components/Each';

enum ADMISSION_STEP {
  FILTER = 1,
  FEE_HEAD,
  INSTRUCTION,
  VERIFY,
  FORM,
}

enum ADMISSION_FORM_STEP {
  BASIC_DETAIL = 1,
  EXAM,
  DOCUMENT,
  SUBJECT,
  DECLARATION,
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tickets",
    href: "",
  },
];
const FORM_STEPS = [
  ADMISSION_FORM_STEP.BASIC_DETAIL,
  ADMISSION_FORM_STEP.EXAM,
  ADMISSION_FORM_STEP.DOCUMENT,
  ADMISSION_FORM_STEP.SUBJECT,
  ADMISSION_FORM_STEP.DECLARATION,
];
const STEP_FIELDS: Record<ADMISSION_FORM_STEP, string[]> = {
  [ADMISSION_FORM_STEP.BASIC_DETAIL]: [
    "applicant_name",
    "father_name",
    "mother_name",
    "dob",
    "gender",
    "category",
    "caste",
    "mobile",
    "father_mobile",
    "aadhar_no",
    "abc_no",
    "apaar_id",
    "religion",
    "marital_status",
    "addresses.0.village_mohalla",
    "addresses.0.post_office",
    "addresses.0.police_station",
    "addresses.0.district",
    "addresses.0.state",
    "addresses.0.pincode",
    "addresses.1.village_mohalla",
    "addresses.1.post_office",
    "addresses.1.police_station",
    "addresses.1.district",
    "addresses.1.state",
    "addresses.1.pincode",
    "last_academic.institute_name",
    "last_academic.class",
    "last_academic.session",
    "last_academic.section",
    "last_academic.roll_number",
  ],

  [ADMISSION_FORM_STEP.EXAM]: ["previous_exams"],

  [ADMISSION_FORM_STEP.DOCUMENT]: ["documents"],

  [ADMISSION_FORM_STEP.SUBJECT]: ["selected_subjects"],

  [ADMISSION_FORM_STEP.DECLARATION]: ["place", "signature_url"],
};

const Admission = () => {
  const [step, setStep] = useState(ADMISSION_STEP.FILTER);
  const [formStep, setFormStep] = useState(ADMISSION_FORM_STEP.BASIC_DETAIL);

  const [accepted, setAccepted] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    register,
    watch,
    setValue,
    getValues,
    // formState: { errors },
  } = useForm({
    resolver: zodResolver(StudentAdmissionFormSchema) as any,
    defaultValues: STUDENT_ADMISSION_FORM_INITIAL_DATA,
  });
  const currentIndex = FORM_STEPS.indexOf(formStep);
  // console.log(errors);
  const goNext = () => {
    if (currentIndex < FORM_STEPS.length - 1) {
      setFormStep(FORM_STEPS[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setFormStep(FORM_STEPS[currentIndex - 1]);
    }
  };
  const handleNext = async () => {
    const fields = STEP_FIELDS[formStep];

    const isValid = await trigger(fields as any);

    if (!isValid) return;

    goNext();
  };

  const {
    fields: examFields,
    append: appendExam,
    remove: removeExam,
  } = useFieldArray({
    control,
    name: "previous_exams",
  });

  const {
    fields: docFields,
    append: appendDoc,
    remove: removeDoc,
  } = useFieldArray({
    control,
    name: "documents",
  });

  const [filterValues, setFilterValues] = useState({
    subject_id: "",
    board: "",
    course_for: "new",
  });
  const { data: filterData, isLoading: filterLoading } = useQuery({
    queryKey: ["admissionFilterData"],
    queryFn: AdmissionApi.getFilterData,
  });
  const searchAdmissionHeadMutation = useMutation({
    mutationFn: AdmissionApi.searchAdmissionHead,
  });

  const instructionQuery = useQuery({
    queryKey: ["admissionInstruction", "admission_new_instruction"],
    queryFn: () => AdmissionApi.getSettingByKey("admission_new_instruction"),
    enabled: step === ADMISSION_STEP.INSTRUCTION,
  });

  const tcQuery = useQuery({
    queryKey: ["admissionTC", "admission_new_tc"],
    queryFn: () => AdmissionApi.getSettingByKey("admission_new_tc"),
    enabled: step === ADMISSION_STEP.INSTRUCTION,
  });

  const verifyMutation = useMutation({
    mutationFn: AdmissionApi.verifyAdmissionId,
    onSuccess: () => {
      setStep(ADMISSION_STEP.FORM);
    },
  });

  const [admissionId, setAdmissionId] = useState("");

  const admissionFormQuery = useQuery({
    queryKey: ["admissionForm", searchAdmissionHeadMutation.data?.data?.id],
    queryFn: () =>
      AdmissionApi.getAdmissionForm(searchAdmissionHeadMutation.data?.data?.id),
    enabled:
      step === ADMISSION_STEP.FORM && !!searchAdmissionHeadMutation.data?.data?.id,
  });

  useEffect(() => {
    if (admissionFormQuery.data?.data) {
      const data = admissionFormQuery.data.data;
      const personal = data.personal_info;

      // Map API data to form fields
      const formData = {
        ...STUDENT_ADMISSION_FORM_INITIAL_DATA,
        admission_head_id: searchAdmissionHeadMutation.data?.data?.id,
        applicant_name: personal.name,
        father_name: personal.father_name,
        mother_name: personal.mother_name,
        father_qualification: personal.father_qualification,
        father_occupation: personal.father_occupation,
        father_mobile: personal.father_mobile,
        dob: personal.dob,
        gender: personal.gender,
        category: personal.category,
        caste: personal.caste,
        mobile: personal.mobile,
        aadhar_no: personal.aadhaar,
        abc_no: personal.abc_id,
        blood_group: personal.blood_group,
        nationality: personal.nationality || "Indian",
        marital_status: personal.marital_status,
        religion: personal.religion,
        university_confidential_no: personal.university_confidential_no,
        is_differently_abled: !!personal.is_differently_abled,
        university_roll_no: personal.university_roll_no,
        reg_no: personal.reg_no,
        roll_no: personal.roll_no,
        application_type: searchAdmissionHeadMutation.data?.data?.course_for,

        addresses: [
          ...(data.address || []),
          ...Array(Math.max(0, 2 - (data.address?.length || 0))).fill({
            address_type: "",
            village_mohalla: "",
            post_office: "",
            police_station: "",
            district: "",
            state: "",
            pincode: "",
          }),
        ].map((addr, index) => ({
          ...addr,
          address_type: index === 0 ? "permanent" : "correspondence",
        })),
        last_academic: {
          institute_name: data.last_institution?.institute_name || "",
          class: data.last_institution?.class || "",
          session: data.last_institution?.session || "",
          section: data.last_institution?.section || "",
          roll_number: data.last_institution?.roll_number || "",
        },
        previous_exams: data.previous_exams?.length
          ? data.previous_exams
          : [
            {
              exam_name: "",
              board_university: "",
              passing_year: "",
              total_marks: "",
              marks_obtained: "",
              percentage: "",
              division: "",
              subjects: "",
              document_url: "",
            },
          ],
        documents: data.documents?.length
          ? [
            {
              doc_type: "clc",
              doc_path:
                data.documents.find((d: any) => d.doc_type === "clc")
                  ?.doc_path || "",
            },
            {
              doc_type: "photo",
              doc_path:
                data.documents.find((d: any) => d.doc_type === "photo")
                  ?.doc_path || "",
            },
            {
              doc_type: "migration",
              doc_path:
                data.documents.find((d: any) => d.doc_type === "migration")
                  ?.doc_path || "",
            },
          ]
          : STUDENT_ADMISSION_FORM_INITIAL_DATA.documents,
        selected_subjects: data.subjects
          .filter((s: any) => s.selected_subject)
          .map((s: any) => ({
            subject_id: s.selected_subject.id,
            subject_category_id: s.category_id,
          })),
      };

      reset(formData);
    }
  }, [admissionFormQuery.data, reset, searchAdmissionHeadMutation.data]);

  const submitAdmissionMutation = useMutation({
    mutationFn: AdmissionApi.submitAdmissionForm,
    onSuccess: (res) => {
      // Handle success (e.g., redirect to payment)
      if (res.data.next_step === "payment_redirection") {
        toast.success("Form Submitted Successfully");
        // window.location.href = `/payment/${res.data.application_id}`;
      }
    },
  });

  const selectedSubjects = watch("selected_subjects") || [];
  const handleSubjectToggle = (
    categoryId: number,
    subjectId: number,
    paperLimit: number,
  ) => {
    const current = selectedSubjects.filter(
      (s: any) => s.subject_category_id === categoryId,
    );

    const alreadySelected = current.some(
      (s: any) => s.subject_id === subjectId,
    );

    let updatedCategorySubjects;

    if (alreadySelected) {
      // remove
      updatedCategorySubjects = current.filter(
        (s: any) => s.subject_id !== subjectId,
      );
    } else {
      // enforce paper limit
      if (current.length >= paperLimit) return;

      updatedCategorySubjects = [
        ...current,
        { subject_id: subjectId, subject_category_id: categoryId },
      ];
    }

    const others = selectedSubjects.filter(
      (s: any) => s.subject_category_id !== categoryId,
    );

    setValue("selected_subjects", [...others, ...updatedCategorySubjects]);
  };
  const isSubjectChecked = (categoryId: number, subjectId: number) =>
    selectedSubjects.some(
      (s: any) =>
        s.subject_category_id === categoryId && s.subject_id === subjectId,
    );

  const [copyAddress, setCopyAddress] = useState(false);

  const handleCopyAddress = (checked: boolean) => {
    setCopyAddress(checked);
    if (checked) {
      const values = getValues();
      const correspondence = values.addresses?.[1]; // Correspondence is index 1

      if (correspondence) {
        // Copy to Permanent (index 0)
        setValue("addresses.0.village_mohalla", correspondence.village_mohalla);
        setValue("addresses.0.post_office", correspondence.post_office);
        setValue("addresses.0.police_station", correspondence.police_station);
        setValue("addresses.0.district", correspondence.district);
        setValue("addresses.0.state", correspondence.state);
        setValue("addresses.0.pincode", correspondence.pincode);
      }
    } else {
      // Optional: Clear permanent address if unchecked? usually not required, just let them edit.
    }
  };

  // Filter fields for Basic Details step
  const basicDetailFields = STUDENT_ADMISSION_FORM_FIELDS.filter(
    (field) => !field.name.startsWith("addresses."),
  );

  const permanentAddressFields = STUDENT_ADMISSION_FORM_FIELDS.filter((field) =>
    field.name.startsWith("addresses.0"),
  );

  const correspondenceAddressFields = STUDENT_ADMISSION_FORM_FIELDS.filter(
    (field) => field.name.startsWith("addresses.1"),
  );

  return (
    <>
      <Head title="Admission" />

      <TooltipProvider>
        <div className="p-3 sm:p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Heading
              title="Admission Management"
              description="Manage Admission."
              icon={<Megaphone className="size-5" />}
            />
          </div>

          <Card className="sm:p-5">
            <CardContent className="pt-0">
              {step === ADMISSION_STEP.FILTER && (
                <Card>
                  <CardHeader>
                    <Heading title="Admission Selection" />
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-5 flex flex-2 gap-4">
                      <Select
                        onValueChange={(v) =>
                          setFilterValues((p) => ({ ...p, subject_id: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <Each
                              of={filterData?.data?.subjects}
                              keyExtractor={(s: any) => String(s.id)}
                              render={(s: any) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          )}
                          />
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(v) =>
                          setFilterValues((p) => ({ ...p, board: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Board" />
                        </SelectTrigger>
                        <SelectContent>
                          <Each
                              of={filterData?.data?.boards}
                              keyExtractor={(b: string) => b}
                              render={(b: string) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          )}
                          />
                        </SelectContent>
                      </Select>
                      {!searchAdmissionHeadMutation?.data && (
                        <Button
                          className="w-2/7"
                          onClick={() =>
                            searchAdmissionHeadMutation.mutate({
                              major_subject_id: Number(filterValues.subject_id),
                              board: filterValues.board,
                              course_for: filterValues.course_for as any,
                            })
                          }
                          disabled={
                            !filterValues.subject_id || !filterValues.board
                          }
                          isLoading={searchAdmissionHeadMutation.isPending}
                        >
                          Next
                        </Button>
                      )}
                    </div>

                    {searchAdmissionHeadMutation?.data && (
                      <div className="max-w-md rounded-lg border p-4 shadow-sm bg-white">
                        <h2 className="text-lg font-semibold text-gray-800">
                          🎓 {searchAdmissionHeadMutation.data.data.title}
                        </h2>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Semester:</span>{" "}
                            {searchAdmissionHeadMutation.data.data.semester}
                          </p>
                          <p>
                            <span className="font-medium">
                              Eligible Category:
                            </span>{" "}
                            {searchAdmissionHeadMutation.data.data.category_criteria.join(
                              ", ",
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Board:</span>{" "}
                            {searchAdmissionHeadMutation.data.data.board_criteria.join(
                              ", ",
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Gender:</span>{" "}
                            {searchAdmissionHeadMutation.data.data.gender_criteria.join(
                              ", ",
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Last Date:</span>{" "}
                            {new Date(
                              searchAdmissionHeadMutation.data.data.last_date,
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Admission Fee:</span>{" "}
                            ₹
                            {
                              searchAdmissionHeadMutation.data.data
                                .total_admission_fees
                            }
                          </p>
                        </div>

                        <Button
                          className="mt-4 w-full"
                          onClick={() => setStep(ADMISSION_STEP.INSTRUCTION)}
                        >
                          Continue Application →
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {step === ADMISSION_STEP.INSTRUCTION && (
                <Card>
                  <CardHeader>
                    <Heading title="Instructions & Terms" />
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: instructionQuery.data?.data?.setting_value,
                      }}
                    />

                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: tcQuery.data?.data?.setting_value,
                      }}
                    />

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={accepted}
                        onCheckedChange={setAccepted}
                      />
                      <span>I accept Terms & Conditions</span>
                    </div>

                    <Button
                      disabled={!accepted}
                      onClick={() => setStep(ADMISSION_STEP.VERIFY)}
                    >
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === ADMISSION_STEP.VERIFY && (
                <Card>
                  <CardHeader>
                    <Heading title="Verify Admission ID" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Please enter your Admission ID (Application Number) to
                      verify your application before proceeding to the form.
                    </p>

                    <Input
                      placeholder="Enter Admission ID"
                      value={admissionId}
                      onChange={(e) => setAdmissionId(e.target.value)}
                    />

                    <Button
                      disabled={!admissionId}
                      isLoading={verifyMutation.isPending}
                      onClick={() =>
                        verifyMutation.mutate({
                          admission_id: admissionId,
                          admission_head_id: searchAdmissionHeadMutation.data.data.id,
                        })
                      }
                    >
                      Verify & Continue
                    </Button>

                    {verifyMutation.error && (
                      <p className="text-red-500 text-sm mt-2">
                        {(verifyMutation.error as any).response?.data
                          ?.message || "Verification failed"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {step === ADMISSION_STEP.FORM && (
                <Card>
                  <CardHeader>
                    <Heading title="Admission Application Form" />
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {admissionFormQuery.isLoading ? (
                      <div>Loading form data...</div>
                    ) : (
                      <>
                        {formStep === ADMISSION_FORM_STEP.BASIC_DETAIL && (
                          <div className="space-y-6">
                            {/* Non-Address Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                              <Each
                                  of={basicDetailFields}
                                  keyExtractor={(field) => String(field.name)}
                                  render={(field) => (
                                <div key={field.name}>
                                  {field.section && (
                                    <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3 col-span-full mt-4">
                                      {field.section}
                                    </h3>
                                  )}
                                  <ControlledFormComponent
                                    control={control}
                                    {...(field as any)}
                                    className={field.name === "applicant_name" ? "md:col-span-2 lg:col-span-3" : ""}
                                  />
                                </div>
                              )}
                              />
                            </div>

                            {/* Address Section */}
                            <div className="border-t pt-5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                                  Address Details
                                </h3>

                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="copy-address"
                                    checked={copyAddress}
                                    onCheckedChange={(checked) =>
                                      handleCopyAddress(checked as boolean)
                                    }
                                  />
                                  <Label
                                    htmlFor="copy-address"
                                    className="cursor-pointer"
                                  >
                                    Same as Correspondence Address
                                  </Label>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Correspondence Address (Left) */}
                                <div className="space-y-3 p-3 rounded-lg bg-muted/20 border">
                                  <h4 className="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                                    Correspondence Address
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                    {correspondenceAddressFields.map(
                                      (field) => (
                                        <ControlledFormComponent
                                          key={field.name}
                                          control={control}
                                          {...(field as any)}
                                          // Remove "Correspondence Address" section title appearing again
                                          section={undefined}
                                        />
                                      ),
                                    )}
                                  </div>
                                </div>

                                {/* Permanent Address (Right) */}
                                <div className="space-y-3 p-3 rounded-lg bg-muted/20 border">
                                  <h4 className="font-semibold text-gray-700 text-sm">
                                    Permanent Address
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                    <Each
                                        of={permanentAddressFields}
                                        keyExtractor={(field) => String(field.name)}
                                        render={(field) => (
                                      <ControlledFormComponent
                                        key={field.name}
                                        control={control}
                                        {...(field as any)}
                                        // Remove "Permanent Address" section title
                                        section={undefined}
                                      />
                                    )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {formStep === ADMISSION_FORM_STEP.EXAM && (
                          <div className="space-y-6 border-t pt-8">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                                Previous Examination History
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  appendExam({
                                    exam_name: "",
                                    board_university: "",
                                    passing_year: "",
                                    total_marks: "",
                                    marks_obtained: "",
                                    percentage: "",
                                    division: "",
                                    subjects: "",
                                    document_url: "",
                                  })
                                }
                              >
                                <Plus className="size-4 mr-2" /> Add Exam
                              </Button>
                            </div>

                            <Each
                                of={examFields}
                                keyExtractor={(field) => String(field.id)}
                                render={(field, index) => (
                              <div
                                key={field.id}
                                className="p-4 border rounded-lg bg-muted/30 relative space-y-4"
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 text-destructive"
                                  onClick={() => removeExam(index)}
                                >
                                  <Trash className="size-4" />
                                </Button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <ControlledFormComponent
                                    label="Exam Name"
                                    name={`previous_exams.${index}.exam_name`}
                                    control={control}
                                    type={FORM_TYPE.TEXT}
                                    required
                                  />
                                  <ControlledFormComponent
                                    label="Board/University"
                                    name={`previous_exams.${index}.board_university`}
                                    control={control}
                                    type={FORM_TYPE.DROPDOWN}
                                    options={[
                                      {
                                        key: "cbse",
                                        value: "CBSE",
                                        text: "CBSE",
                                      },
                                      {
                                        key: "icse",
                                        value: "ICSE",
                                        text: "ICSE",
                                      },
                                      {
                                        key: "state_board",
                                        value: "State Board",
                                        text: "State Board",
                                      },
                                      {
                                        key: "nios",
                                        value: "NIOS",
                                        text: "NIOS",
                                      },

                                      {
                                        key: "university",
                                        value: "University",
                                        text: "University",
                                      },
                                    ]}
                                    required
                                  />

                                  <ControlledFormComponent
                                    label="Passing Year"
                                    name={`previous_exams.${index}.passing_year`}
                                    control={control}
                                    type={FORM_TYPE.NUMBER}
                                    required
                                  />
                                  <ControlledFormComponent
                                    label="Total Marks"
                                    name={`previous_exams.${index}.total_marks`}
                                    control={control}
                                    type={FORM_TYPE.NUMBER}
                                    required
                                  />
                                  <ControlledFormComponent
                                    label="Marks Obtained"
                                    name={`previous_exams.${index}.marks_obtained`}
                                    control={control}
                                    type={FORM_TYPE.NUMBER}
                                    required
                                  />
                                  <ControlledFormComponent
                                    label="Percentage"
                                    name={`previous_exams.${index}.percentage`}
                                    control={control}
                                    type={FORM_TYPE.NUMBER}
                                    required
                                  />

                                  <ControlledFormComponent
                                    label="Division"
                                    name={`previous_exams.${index}.division`}
                                    control={control}
                                    type={FORM_TYPE.TEXT}
                                    required
                                  />
                                  <ControlledFormComponent
                                    label="Subjects"
                                    name={`previous_exams.${index}.subjects`}
                                    control={control}
                                    type={FORM_TYPE.TEXT}
                                    required
                                  />
                                  <ControlledFormComponent
                                    label="Upload Marksheet"
                                    name={`previous_exams.${index}.document_url`}
                                    control={control}
                                    type={FORM_TYPE.FILE}
                                    required
                                  />
                                </div>
                              </div>
                            )}
                            />
                          </div>
                        )}
                        {/* Documents Dynamic Section */}

                        {formStep === ADMISSION_FORM_STEP.DOCUMENT && (
                          <>
                            <Each
                                of={docFields}
                                keyExtractor={(field) => String(field.id)}
                                render={(field, index) => (
                              <div
                                key={field.id}
                                className="p-4 border rounded-lg bg-muted/30 space-y-4"
                              >
                                <ControlledFormComponent
                                  label={
                                    field.doc_type === "photo"
                                      ? "Photo"
                                      : field.doc_type === "migration"
                                        ? "Migration Certificate"
                                        : "clc"
                                  }
                                  name={`documents.${index}.doc_path`}
                                  control={control}
                                  type={FORM_TYPE.FILE}
                                  required
                                />

                                {/* keep doc_type registered & immutable */}
                                <input
                                  type="hidden"
                                  {...register(`documents.${index}.doc_type`)}
                                />
                              </div>
                            )}
                            />
                          </>
                        )}
                        {/* Subject Selection */}

                        {formStep === ADMISSION_FORM_STEP.SUBJECT && (
                          <div className="space-y-4 mt-8 border-t pt-8">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                              Subject Selection
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {admissionFormQuery.data?.data?.subjects.map(
                                (sub: any) => {
                                  const selectedCount = selectedSubjects.filter(
                                    (s: any) =>
                                      s.subject_category_id === sub.category_id,
                                  ).length;

                                  return (
                                    <div
                                      key={sub.category_id}
                                      className="space-y-2"
                                    >
                                      <label className="text-sm font-medium">
                                        {sub.category_name}
                                        {sub.is_compulsory && (
                                          <span className="text-red-500 ml-1">
                                            *
                                          </span>
                                        )}
                                      </label>

                                      {/* Pre-selected compulsory subject */}
                                      {sub.selected_subject && (
                                        <div className="flex items-center gap-2 text-sm">
                                          <input
                                            type="checkbox"
                                            checked
                                            disabled
                                          />
                                          <span>
                                            {sub.selected_subject.name}{" "}
                                            (Pre-selected)
                                          </span>
                                        </div>
                                      )}

                                      {/* Checkbox options */}
                                      {sub.options.map((opt: any) => {
                                        const checked = isSubjectChecked(
                                          sub.category_id,
                                          opt.id,
                                        );

                                        const disabled =
                                          !checked &&
                                          selectedCount >= sub.paper_limit;

                                        return (
                                          <div
                                            key={opt.id}
                                            className="flex items-center gap-2 text-sm"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              disabled={disabled}
                                              onChange={() =>
                                                handleSubjectToggle(
                                                  sub.category_id,
                                                  opt.id,
                                                  sub.paper_limit,
                                                )
                                              }
                                            />
                                            <span>
                                              {opt.name} ({opt.subject_code})
                                            </span>
                                          </div>
                                        );
                                      })}

                                      <p className="text-xs text-muted-foreground">
                                        Select up to {sub.paper_limit}
                                      </p>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}

                        {formStep === ADMISSION_FORM_STEP.DECLARATION && (
                          <>
                            <div className="space-y-6 border-t pt-8">
                              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                                Declaration
                              </h3>

                              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                                <p className="text-sm leading-relaxed text-gray-700">
                                  I hereby declare that the information provided
                                  by me in this application form is true,
                                  complete, and correct to the best of my
                                  knowledge and belief. I understand that if any
                                  information is found to be false or incorrect,
                                  my admission is liable to be cancelled at any
                                  stage.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Applicant Name */}
                                  <ControlledFormComponent
                                    label="Place"
                                    name="place"
                                    control={control}
                                    type={FORM_TYPE.TEXT}
                                    required
                                  />

                                  {/* Signature Upload */}
                                  <ControlledFormComponent
                                    label="Upload Signature"
                                    name="signature_url"
                                    control={control}
                                    type={FORM_TYPE.FILE}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            {/* <Button
                              className="mt-6 w-full md:w-auto"
                              onClick={handleSubmit((data) => {
                                submitAdmissionMutation.mutate(data);
                              })}
                              isLoading={submitAdmissionMutation.isPending}
                            >
                              Submit Application
                            </Button> */}
                          </>
                        )}
                        {step === ADMISSION_STEP.FORM && (
                          <div className="flex justify-between items-center border-t pt-6 mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={goPrev}
                              disabled={currentIndex === 0}
                            >
                              ← Previous
                            </Button>

                            {formStep !== ADMISSION_FORM_STEP.DECLARATION ? (
                              <Button type="button" onClick={handleNext}>
                                Next →
                              </Button>
                            ) : (
                              <Button
                                onClick={handleSubmit((data) =>
                                  submitAdmissionMutation.mutate(data),
                                )}
                                isLoading={submitAdmissionMutation.isPending}
                              >
                                Submit Application
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {/* Declaration */}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </>
  );
};

export default Admission;
