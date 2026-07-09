
import HeadingSmall from "@/components/heading-small";
import SettingsTip from "@/components/shared/SettingsTip";
import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save, User, ShieldAlert } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import StaffApi from "@/lib/api/staffApi";
import RoleApi from "@/lib/api/roleApi";
import { FORM_TYPE } from "@/constants/shared/form";
import { useDepartments } from "@/hooks/useDepartments";
import { useCollegeSubject } from "@/hooks/useSubjects";
import type { BreadcrumbItem } from "@/types";
import {
  ADD_STAFF_FORM_LAYOUT,
} from "@/constants/page/admin/staffDirectory";
import { STAFF_DIRECTORY_GUIDE } from "@/constants/guides/settings";
import { useRegisterGuide } from '@/components/GuideProvider';
import { staffFormSchema } from "@/lib/validations/staffForm";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import StaffPermissionsTab from "@/components/admin/StaffPermissionsTab";
import { PermissionGate } from "@/components/PermissionGate";
import { cn } from "@/lib/utils";
import SettingsFooter from "@/components/shared/SettingsFooter";

interface PageProps { id?: number; name?: string }

const StaffDirectoryCreate = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(STAFF_DIRECTORY_GUIDE);
  const pageProps = usePage().props as unknown as PageProps;
  const staffId = pageProps.id;
  const isEditMode = !!staffId;

  const { data: rolesResponse } = useQuery({
    queryKey: ["roles"],
    queryFn: () => RoleApi.getRoles(),
  });
  const rolesList = Array.isArray(rolesResponse?.data)
    ? rolesResponse.data
    : Array.isArray(rolesResponse)
      ? rolesResponse
      : [];
  const roleOptions = rolesList.map((r: { id: number; name: string; key?: string }) => ({
    key: String(r.id),
    text: r.name,
    value: String(r.id),
  }));

  const { departments = [] } = useDepartments({ per_page: 200 });
  const { subjects = [] } = useCollegeSubject({ params: { all: true }, enabled: true });
  const departmentOptions = departments.map((d: { key: number; text: string; value: number }) => ({
    key: String(d.key),
    text: d.text,
    value: String(d.value),
  }));
  const subjectOptions = subjects.map((s: { key: string; text: string; value: string }) => ({
    key: s.key,
    text: s.text,
    value: s.value,
  }));

  const { data: staffResponse } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => StaffApi.getStaffById(String(staffId!)),
    enabled: isEditMode && !!staffId,
  });
  const staffData = staffResponse?.data ?? staffResponse;

  const formLayout = ADD_STAFF_FORM_LAYOUT.map((field) => {
    if (field.name === "role_id") return { ...field, options: roleOptions };
    if (field.name === "department_ids") return { ...field, options: departmentOptions };
    if (field.name === "subject_ids") return { ...field, options: subjectOptions };
    if (field.name === "email" && isEditMode) return { ...field, disabled: true };
    return field;
  }).filter((field) => {
    if (isEditMode && field.name === "send_invitation") return false;
    return true;
  });

  const avatarField = formLayout.find((f) => f.name === "avatar");
  const restLayout = formLayout.filter((f) => f.name !== "avatar");

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(staffFormSchema),
    mode: "onChange",
    defaultValues: {
      avatar: "",
      name: "",
      email: "",
      role_id: "",
      category: "",
      department_ids: [] as string[],
      subject_ids: [] as string[],
      send_invitation: true, // Default to true for new staff
    },
  });

  useEffect(() => {
    if (!isEditMode || !staffData) return;
    const u = staffData as Record<string, unknown>;
    const roleId = Array.isArray(u.roles) && (u.roles as { id: number }[])[0] ? (u.roles as { id: number }[])[0].id : u.role_id ?? "";
    reset({
      avatar: (u.photo_url as string) ?? "",
      name: (u.name as string) ?? "",
      email: (u.email as string) ?? "",
      role_id: String(roleId),
      category: u.category != null ? String(u.category) : "",
      department_ids: Array.isArray(u.department_ids) ? (u.department_ids as number[]).map(String) : [],
      subject_ids: Array.isArray(u.subject_ids) ? (u.subject_ids as number[]).map(String) : [],
    });
  }, [isEditMode, staffData, reset]);

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        role_id: data.role_id ? Number(data.role_id) : undefined,
        category: data.category ? Number(data.category) : undefined,
        status: 1,
        send_invitation: data.send_invitation === true,
      };
      if (!isEditMode) payload.email = data.email;
      const photoUrl = data.avatar;
      if (typeof photoUrl === "string" && photoUrl) payload.photo_url = photoUrl;
      const norm = (x: unknown) => (typeof x === "object" && x != null && "value" in (x as object) ? Number((x as { value: unknown }).value) : Number(x));
      const deptIds = Array.isArray(data.department_ids) ? data.department_ids.map(norm).filter((n) => !Number.isNaN(n)) : [];
      const subjIds = Array.isArray(data.subject_ids) ? data.subject_ids.map(norm).filter((n) => !Number.isNaN(n)) : [];
      if (deptIds.length) payload.department_ids = deptIds;
      if (subjIds.length) payload.subject_ids = subjIds;
      if (isEditMode && staffId) return StaffApi.updateStaff(String(staffId), payload);
      return StaffApi.createStaff(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "staff-directory"] });
      if (staffId) queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
      toast.success(isEditMode ? "Staff updated successfully" : "Staff user created successfully");
      router.visit("/settings/staff-directory");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? (isEditMode ? "Failed to update staff" : "Failed to create staff user"));
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data);
  };

  return (
    <>
      <Head title={isEditMode ? "Edit staff" : "Add staff user"} />

        <div className="space-y-6">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/settings/staff-directory" className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" aria-hidden />
                Back
              </Link>
            </Button>
            <HeadingSmall
              id="staff-create-header"
              guidance={STAFF_DIRECTORY_GUIDE}
            />
          </div>

          {!isEditMode ? (
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-8">
                {avatarField && (
                  <div>
                    <ControlledFormComponent
                      control={control}
                      {...(avatarField as any)}
                      error={(errors as Record<string, { message?: string }>).avatar?.message}
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                  <Each
                    of={restLayout}
                    render={(field: Record<string, unknown>) => {
                      const fieldEl = (
                        <ControlledFormComponent
                          control={control}
                          {...(field as any)}
                          error={(errors as Record<string, { message?: string }>)[String(field.name)]?.message}
                        />
                      );
                      const canPermission = field.can as string | undefined;
                      return canPermission ? (
                        <PermissionGate key={String(field.name)} can={canPermission}>
                          {fieldEl}
                        </PermissionGate>
                      ) : (
                        <React.Fragment key={String(field.name)}>{fieldEl}</React.Fragment>
                      );
                    }}
                  />
                </div>

                <SettingsFooter
                  isPending={createMutation.isPending}
                  alwaysShow={true}
                  cancelLink="/settings/staff-directory"
                  submitLabel={createMutation.isPending ? "Creating..." : "Create staff"}
                  className="mt-8"
                />
              </form>
            </div>
          ) : (
            <TabGroup>
              <TabList className="flex gap-4 border-b">
                <Tab className={({ selected }: { selected: boolean }) => cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 outline-none",
                  selected ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}>
                  <User className="size-4" />
                  Basic Information
                </Tab>
                <Tab className={({ selected }: { selected: boolean }) => cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 outline-none",
                  selected ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}>
                  <ShieldAlert className="size-4" />
                  Permissions & Overrides
                </Tab>
              </TabList>

              <TabPanels className="mt-6">
                <TabPanel>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-8">
                    {avatarField && (
                      <div>
                        <ControlledFormComponent
                          control={control}
                          {...(avatarField as any)}
                          error={(errors as Record<string, { message?: string }>).avatar?.message}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                      <Each
                        of={restLayout}
                        render={(field: Record<string, unknown>) => {
                          const fieldEl = (
                            <ControlledFormComponent
                              control={control}
                              {...(field as any)}
                              error={(errors as Record<string, { message?: string }>)[String(field.name)]?.message}
                            />
                          );
                          const canPermission = field.can as string | undefined;
                          return canPermission ? (
                            <PermissionGate key={String(field.name)} can={canPermission}>
                              {fieldEl}
                            </PermissionGate>
                          ) : (
                            <React.Fragment key={String(field.name)}>{fieldEl}</React.Fragment>
                          );
                        }}
                      />
                    </div>

                    <SettingsFooter
                      isPending={createMutation.isPending}
                      alwaysShow={true}
                      cancelLink="/settings/staff-directory"
                      submitLabel={createMutation.isPending ? "Updating..." : "Update staff"}
                      className="mt-8"
                    />
                  </form>
                </TabPanel>

                <TabPanel>
                  <StaffPermissionsTab
                    userId={Number(staffId)}
                    userName={String(staffData?.name || "Staff")}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          )}
        </div>
    </>
  );
}


export default StaffDirectoryCreate;
