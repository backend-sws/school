import React, { useEffect, useState } from "react";
import { ModalDialog } from "../shared/Modal";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import {
  SLIDER_DIALOG_FORM_LAYOUT,
  SLIDER_FORM_INITIAL_DATA,
} from "@/constants/page/admin/slider";
import SliderApi from "@/lib/api/sliderApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { sliderDialogFormSchema, type SliderFormData } from "@/lib/validations/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SliderDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

// Section header component for visual organization
function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function SliderDialog({ open, onClose, data }: SliderDialogProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderDialogFormSchema) as any,
    defaultValues: SLIDER_FORM_INITIAL_DATA as any,
    mode: "onChange",
  });

  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { data: sliderDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["sliders", dataId],
    queryFn: () => SliderApi.getSliderById(dataId),
    enabled: open && isEditMode,
  });

  useEffect(() => {
    if (isEditMode && sliderDetail) {
      const fullData = sliderDetail?.data;
      // Backend returns int (101=published, 100=draft), convert to string for form
      const statusValue =
        fullData.status === 101 || fullData.status === "published"
          ? "published"
          : "draft";
      reset({
        title: fullData.title,
        description: fullData.description || "",
        image_url: fullData.image_url || "",
        button_caption: fullData.button_caption || "",
        button_url: fullData.button_url || "",
        status: statusValue,
        sort_order: fullData.sort_order ?? 0,
      });
    } else {
      reset(SLIDER_FORM_INITIAL_DATA);
    }
  }, [isEditMode, sliderDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) => {
      const payload = {
        title: submitData.title,
        description: submitData.description || "",
        image_url: submitData.image_url,
        button_caption: submitData.button_caption || "",
        button_url: submitData.button_url || null,
        status: submitData.status,
        sort_order: Number(submitData.sort_order) || 0,
      };
      return isEditMode
        ? SliderApi.updateSlider(dataId, payload)
        : SliderApi.createSlider(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sliders"],
      });
      toast.success(
        isEditMode
          ? "Banner slide updated successfully"
          : "Banner slide created successfully",
      );
      reset();
      onClose(false);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save banner slide";
      toast.error(message);
    },
  });

  const onSubmit = (data: any) => {
    if (isImageUploading) {
      toast.error("Please wait for the banner image upload to finish.");
      return;
    }
    if (!data.image_url) {
      toast.error("Banner image is required.");
      return;
    }
    handleMutation(data);
  };

  const imageUrl = watch("image_url");

  // Get form fields from layout
  const [
    titleField,
    descField,
    imageField,
    buttonCaptionField,
    buttonUrlField,
    sortOrderField,
    statusField,
  ] = SLIDER_DIALOG_FORM_LAYOUT;

  return (
    <ModalDialog
      title={isEditMode ? "Edit Banner Slide" : "Add New Banner Slide"}
      description="Create banner slides for your homepage carousel with images and call-to-action buttons."
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit) as any}
      isLoading={isSaving || isLoadingDetail}
      submitLabel={isEditMode ? "Update Slide" : "Create Slide"}
      primaryDisabled={isImageUploading || !imageUrl}
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Banner Content Section */}
        <div className="space-y-4">
          <SectionHeader
            title="Banner Content"
            description="Define the main heading and description for your banner slide"
          />
          <div className="space-y-4">
            <ControlledFormComponent
              control={control as any}
              name="title"
              label={titleField.label}
              type={titleField.type}
              placeholder={titleField.placeholder}
              required={titleField.required}
              tooltip={titleField.tooltip}
            />
            <ControlledFormComponent
              control={control as any}
              name="description"
              label={descField.label}
              type={descField.type}
              placeholder={descField.placeholder}
              tooltip={descField.tooltip}
              helperText={descField.helperText}
            />
          </div>
        </div>

        <Separator />

        {/* Banner Image Section */}
        <div className="space-y-4">
          <SectionHeader
            title="Banner Image"
            description="Upload a high-quality image for your banner slide"
          />
          <ControlledFormComponent
            control={control as any}
            name="image_url"
            label={imageField.label}
            type={imageField.type}
            accept={imageField.accept}
            required={imageField.required}
            tooltip={imageField.tooltip}
            helperText={imageField.helperText}
            onUploadingChange={setIsImageUploading}
          />
          {errors.image_url?.message && (
            <p className="text-sm text-destructive">{String(errors.image_url.message)}</p>
          )}
        </div>

        <Separator />

        {/* Call-to-Action Section */}
        <div className="space-y-4">
          <SectionHeader
            title="Call-to-Action Button"
            description="Add an optional button to drive user engagement (leave empty to hide button)"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledFormComponent
              control={control as any}
              name="button_caption"
              label={buttonCaptionField.label}
              type={buttonCaptionField.type}
              placeholder={buttonCaptionField.placeholder}
              tooltip={buttonCaptionField.tooltip}
            />
            <ControlledFormComponent
              control={control as any}
              name="button_url"
              label={buttonUrlField.label}
              type={buttonUrlField.type}
              placeholder={buttonUrlField.placeholder}
              tooltip={buttonUrlField.tooltip}
              helperText={buttonUrlField.helperText}
            />
          </div>
        </div>

        <Separator />

        {/* Display Settings Section */}
        <div className="space-y-4">
          <SectionHeader
            title="Display Settings"
            description="Configure visibility and ordering preferences"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledFormComponent
              control={control as any}
              name="sort_order"
              label={sortOrderField.label}
              type={sortOrderField.type}
              placeholder={sortOrderField.placeholder}
              tooltip={sortOrderField.tooltip}
              helperText={sortOrderField.helperText}
            />
            <ControlledFormComponent
              control={control as any}
              name="status"
              label={statusField.label}
              type={statusField.type}
              options={statusField.options}
              tooltip={statusField.tooltip}
            />
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
