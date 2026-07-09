import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo, useCallback } from "react";
import * as React from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { STUDENT_DIALOG_FORM_LAYOUT } from "@/constants/page/admin/student";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StudentApi from "@/lib/api/studentApi";
import { CandidateQueryKeys } from "@/lib/querykey/candidate";
import { pick } from "@/lib/utils";
import { candidateFormSchema, CandidateFormData } from "@/lib/validations/candidate";
import { Copy, MapPin, Home, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CandidateDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  candidate: { id?: number | string; viewMode?: boolean } | null;
}

// Keys to exclude when copying address
const ADDRESS_EXCLUDE_KEYS = new Set(["id", "student_profile_id", "created_at", "updated_at", "address_type"]);

// Fields to pick from API response for form
const USER_FIELDS = ["id", "name", "email", "mobile"];
const PROFILE_FIELDS = [
  "roll_no", "current_semester", "dob", "gender", "blood_group", "aadhar_no",
  "father_name", "father_mobile", "father_qualification", "father_occupation",
  "mother_name", "category", "caste", "nationality", "is_differently_abled",
];

// Transform API data to flat form structure
const transformApiData = (data: any): Partial<CandidateFormData> | undefined => {
  if (!data?.data) return undefined;
  const { student_profile: profile, ...user } = data.data;
  return {
    ...pick(USER_FIELDS, user),
    ...pick(PROFILE_FIELDS, profile || {}),
    permanent_address: profile?.permanent_address || {},
    correspondence_address: profile?.correspondence_address || {},
  };
};

// Transform form data back to API structure
const transformFormData = (formData: CandidateFormData) => ({
  name: formData.name,
  email: formData.email,
  mobile: formData.mobile,
  student_profile: {
    ...pick(PROFILE_FIELDS, formData),
    permanent_address: formData.permanent_address || {},
    correspondence_address: formData.correspondence_address || {},
  },
});

// Memoized field sections from layout
const { basicFields, permanentAddressFields, correspondenceAddressFields } = (() => {
  const layout = STUDENT_DIALOG_FORM_LAYOUT;
  return {
    basicFields: layout.filter((f: any) => !f.section && f.name !== "copy_correspondence"),
    permanentAddressFields: layout.filter((f: any) => f.section === "permanent_address"),
    correspondenceAddressFields: layout.filter((f: any) => f.section === "correspondence_address"),
  };
})();

export function CandidateDialog({ open, onClose, candidate }: CandidateDialogProps) {
  const selectedId = candidate?.id;
  const isViewMode = candidate?.viewMode ?? false;
  const isEditMode = !!selectedId;
  const queryClient = useQueryClient();

  // Fetch candidate data
  const { data } = useQuery({
    queryKey: CandidateQueryKeys.detail(selectedId!),
    queryFn: () => StudentApi.getCandidateById(selectedId!),
    enabled: !!(open && selectedId),
  });

  // Transform data for form
  const formValues = useMemo(() => transformApiData(data), [data]);

  // Form setup with Zod validation
  const { handleSubmit, control, setValue, getValues, watch, reset } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    mode: "onChange", // Enable real-time validation
  });

  // Reset form when data is loaded
  React.useEffect(() => {
    if (formValues) {
      reset(formValues);

      // Initialize toggle state if addresses match
      const corr = formValues.correspondence_address;
      const perm = formValues.permanent_address;
      if (corr && perm) {
        const matches = Object.keys(corr).every(key =>
          ADDRESS_EXCLUDE_KEYS.has(key) || (corr as any)[key] === (perm as any)[key]
        );
        setKeepSameAddress(matches);
      }
    }
  }, [formValues, reset]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (submitData: any) => StudentApi.updateCandidate(selectedId!, submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CandidateQueryKeys.detail(selectedId!) });
      queryClient.invalidateQueries({ queryKey: CandidateQueryKeys.all });
      onClose(false);
    },
  });

  // Simple checkbox state for copying addresses
  const [keepSameAddress, setKeepSameAddress] = React.useState(false);

  // Watch correspondence address for real-time syncing
  const watchedCorrespondence = watch("correspondence_address");

  // Real-time sync correspondence to permanent if toggle is ON
  React.useEffect(() => {
    if (keepSameAddress && watchedCorrespondence) {
      Object.entries(watchedCorrespondence).forEach(([key, value]) => {
        if (!ADDRESS_EXCLUDE_KEYS.has(key)) {
          setValue(`permanent_address.${key}` as any, value, { shouldValidate: true });
        }
      });
    }
  }, [keepSameAddress, watchedCorrespondence, setValue]);

  // Handle checkbox change - handle clearing when unchecked
  const handleCheckboxChange = (checked: boolean) => {
    setKeepSameAddress(checked);

    if (!checked) {
      // Clear permanent address fields when unchecked
      const currentValues = getValues();
      reset({
        ...currentValues,
        permanent_address: {
          village_mohalla: "",
          post_office: "",
          police_station: "",
          district: "",
          state: "",
          pincode: ""
        }
      });
    }
  };

  // Submit handler
  const onSubmit: SubmitHandler<CandidateFormData> = (formData) => {
    updateMutation.mutate(transformFormData(formData));
  };

  // Render field helper
  const renderField = (form: any) => (
    <ControlledFormComponent key={form.name} control={control} {...form} disabled={isViewMode} />
  );

  return (
    <ModalDialog
      title={isViewMode ? "View Candidate" : isEditMode ? "Edit Candidate" : "Add Candidate"}
      open={open}
      onClose={onClose}
      className="sm:max-w-5xl max-h-[85vh]"
      handleSubmit={isViewMode ? undefined : handleSubmit(onSubmit)}
    >
      <div className="max-h-[calc(85vh-150px)] overflow-y-auto pr-4 space-y-6">
        {/* Basic Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Each of={basicFields} render={renderField} />
        </div>

        {/* Address Sections */}
        <div className="space-y-4 pt-4 border-t">
          {/* Section Header */}
          <h3 className="text-lg font-semibold text-foreground">Address Information</h3>
          {!isViewMode && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="keep-same-address"
                checked={keepSameAddress}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="keep-same-address"
                className="text-sm font-normal cursor-pointer"
              >
                Keep permanent same as correspondence
              </Label>
            </div>
          )}

          {/* Address Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Correspondence Address Card */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-base text-foreground">Correspondence Address</h4>
              </div>
              <div className="space-y-3">
                <Each of={correspondenceAddressFields} render={renderField} />
              </div>
            </div>

            {/* Permanent Address Card */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-base text-foreground">Permanent Address</h4>
              </div>
              <div className="space-y-3">
                <Each of={permanentAddressFields} render={renderField} />
              </div>
            </div>
          </div>

          {/* Helper Text */}
          {!isViewMode && (
            <p className="text-xs text-muted-foreground flex items-start gap-2 bg-muted/30 p-3 rounded-md">
              <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                Check the "Keep permanent same as correspondence" option to automatically sync the permanent address with correspondence address.
              </span>
            </p>
          )}
        </div>
      </div>
    </ModalDialog >
  );
}
