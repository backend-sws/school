import { send } from "@/routes/verification";
import { type BreadcrumbItem, type SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";

import { Transition } from "@headlessui/react";

import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { edit } from "@/routes/profile";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { PROFILE_FORM_LAYOUT } from "@/constants/page/admin/collegeConfig";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Loader2, Save, Undo2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProfileApi from "@/lib/api/profileApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { SETTINGS_GUIDE } from "@/constants/guides/settings";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";
import { User } from "lucide-react";

// ... breadcrumbs constant ...
export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const queryClient = useQueryClient();
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  useRegisterGuide(SETTINGS_GUIDE);

  // Effective user when parent has switched context (e.g. to Deepa); otherwise logged-in user
  const effectiveUser = auth?.effective_user ?? auth?.user;
  const effectiveUserId = effectiveUser?.id;

  // Fetch profile by effective user id (API returns effective user when parent has switched)
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", effectiveUserId],
    queryFn: () => ProfileApi.getProfile(),
    initialData: { data: effectiveUser },
  });

  const profile = profileData?.data || effectiveUser;

  const { control, reset, handleSubmit, formState: { isDirty } } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: profile.avatar_url || "",
      name: profile.name || "",
      email: profile.email || "",
    }
  });

  useEffect(() => {
    reset({
      avatar: profile.avatar_url || "",
      name: profile.name || "",
      email: profile.email || "",
    });
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => ProfileApi.updateProfile({
      name: data.name,
      email: data.email,
      avatar_url: data.avatar,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      setRecentlySuccessful(true);
      setTimeout(() => setRecentlySuccessful(false), 3000);
      // Inertia partial reload: refresh only shared auth so sidebar and app get updated user
      router.reload({ only: ["auth"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <>
      <Head title="Profile settings" />

      <div>
        <HeadingSmall
          id="profile-info-header"
          guidance={SETTINGS_GUIDE}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-10">
          <SettingsSection
            icon={User}
            title="Profile Information"
            description="Update your account details and profile picture."
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              {/* Left Column: Avatar */}
              <div className="md:col-span-4">
                <ControlledFormComponent
                  control={control}
                  {...PROFILE_FORM_LAYOUT.find(f => f.name === 'avatar') as any}
                />
              </div>

              {/* Right Column: Text Fields */}
              <div className="md:col-span-8 space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <ControlledFormComponent
                    control={control}
                    {...PROFILE_FORM_LAYOUT.find(f => f.name === 'name') as any}
                  />
                  <ControlledFormComponent
                    control={control}
                    {...PROFILE_FORM_LAYOUT.find(f => f.name === 'email') as any}
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          {mustVerifyEmail && auth.user.email_verified_at === null && (
            <div className="px-6 py-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-700 italic">
                Your email address is unverified.{" "}
                <Link
                  href={send()}
                  as="button"
                  className="text-primary font-bold underline decoration-primary/30 underline-offset-4 transition-all hover:decoration-primary"
                >
                  Click here to resend the verification email.
                </Link>
              </p>

              {status === "verification-link-sent" && (
                <div className="mt-4 text-sm font-bold text-emerald-600 bg-emerald-100/50 border border-emerald-100 px-4 py-2 rounded-lg">
                  A new verification link has been sent to your email
                  address.
                </div>
              )}
            </div>
          )}

          <SettingsFooter
              isDirty={isDirty}
              isPending={updateProfileMutation.isPending}
              isSuccess={recentlySuccessful}
              onDiscard={() => reset()}
              submitLabel="Commit Profile"
              dataTest="update-profile-button"
          />
        </form>
      </div>
    </>
  );
}


