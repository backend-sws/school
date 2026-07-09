import React, { useState, useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import Each from "@/components/Each";
import { FORM_TYPE } from "@/constants/shared/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { LmsMaterialSchema, type LmsMaterialFormValues } from "@/lib/validations/lms";
import {
  LMS_MATERIAL_RESOURCE_DETAILS_LAYOUT,
  LMS_RESOURCE_ACCEPT,
  LMS_RESOURCE_SOURCE,
} from "@/constants/page/admin/lmsForms";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText, Link2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LmsMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  allocationId?: number;
}

export function LmsMaterialDialog({ open, onClose, classId, allocationId }: LmsMaterialDialogProps) {
  const queryClient = useQueryClient();
  const [sourceType, setSourceType] = useState<typeof LMS_RESOURCE_SOURCE[keyof typeof LMS_RESOURCE_SOURCE]>(LMS_RESOURCE_SOURCE.UPLOAD);
  const [uploadPath, setUploadPath] = useState<string | null>(null);

  const { handleSubmit, control, reset, watch } = useForm<LmsMaterialFormValues>({
    resolver: zodResolver(LmsMaterialSchema),
    defaultValues: { title: "", file_path: "", file_type: "" },
    mode: "onChange",
  });

  const watchedFilePath = watch("file_path");

  useEffect(() => {
    if (open) {
      reset({ title: "", file_path: "", file_type: "" });
      setUploadPath(null);
      setSourceType(LMS_RESOURCE_SOURCE.UPLOAD);
    }
  }, [open, reset]);

  const getFilepath = (): string | null => {
    if (sourceType === LMS_RESOURCE_SOURCE.UPLOAD && uploadPath) return uploadPath;
    if (sourceType === LMS_RESOURCE_SOURCE.URL && watchedFilePath?.trim()) return watchedFilePath.trim();
    return null;
  };

  const canSubmit = (): boolean => !!getFilepath();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LmsMaterialFormValues) => {
      const file_path = getFilepath();
      if (!file_path) throw new Error("File path or URL is required");
      return lmsApi.materials.store(classId, {
        title: data.title.trim(),
        file_path,
        file_type: data.file_type?.trim() || null,
        ...(allocationId != null ? { class_subject_allocation_id: allocationId } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.materials(classId) });
      toast.success("Resource uploaded successfully!");
      reset();
      setUploadPath(null);
      onClose();
    },
  });

  const onSubmit = (data: LmsMaterialFormValues) => {
    if (!canSubmit()) return;
    mutate(data);
  };

  return (
    <ModalDialog
      title="Add Resource"
      description="Attach a file or link for students. Upload a PDF, document, or paste a URL."
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isPending}
      submitLabel="Add Resource"
      primaryDisabled={!canSubmit()}
      className="sm:max-w-4xl gap-0 p-0 overflow-hidden"
      headerClassName="p-6 pb-2"
      footerClassName="p-4 border-t bg-muted/5"
    >
      <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
        {/* Left: Resource Details */}
        <div className="w-full md:w-1/2 p-6 space-y-6 overflow-y-auto border-b md:border-b-0 md:border-r">
          <div>
            <h3 className="text-lg font-medium mb-1">Resource Details</h3>
            <p className="text-sm text-muted-foreground">Title and optional file type for the list.</p>
          </div>

          <div className="grid gap-5">
            <Each
              of={LMS_MATERIAL_RESOURCE_DETAILS_LAYOUT}
              keyExtractor={(field) => field.name}
              nodatafound={<p className="text-sm text-muted-foreground">No form fields configured.</p>}
              render={(field) => (
                <ControlledFormComponent
                  control={control}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  required={field.required}
                  maxLength={field.maxLength}
                  tooltip={field.tooltip}
                />
              )}
            />
          </div>
        </div>

        {/* Right: Add Resource */}
        <div className="w-full md:w-1/2 p-6 space-y-6 bg-muted/10 overflow-y-auto flex flex-col">
          <div>
            <h3 className="text-lg font-medium mb-1">Add Resource</h3>
            <p className="text-sm text-muted-foreground">Upload a file (PDF, DOC, etc.) or paste a URL.</p>
          </div>

          <div className="space-y-6">
            {/* Source Type Selector */}
            <div className="flex p-1 bg-muted/50 rounded-lg w-full border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSourceType(LMS_RESOURCE_SOURCE.UPLOAD);
                  setUploadPath(null);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all h-auto px-2",
                  sourceType === LMS_RESOURCE_SOURCE.UPLOAD
                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5 hover:bg-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload File</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSourceType(LMS_RESOURCE_SOURCE.URL);
                  setUploadPath(null);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all h-auto px-2",
                  sourceType === LMS_RESOURCE_SOURCE.URL
                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5 hover:bg-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">URL or path</span>
              </Button>
            </div>

            {/* Input Area */}
            <div className="min-h-[160px] flex flex-col justify-center">
              {sourceType === LMS_RESOURCE_SOURCE.UPLOAD && (
                <FileUpload
                  mode="single"
                  value={uploadPath}
                  onChange={(path) => setUploadPath(path)}
                  accept={LMS_RESOURCE_ACCEPT}
                  className="h-full w-full min-h-[160px] hover:bg-muted/5 bg-background"
                />
              )}

              {sourceType === LMS_RESOURCE_SOURCE.URL && (
                <div className="flex flex-col gap-4">
                  <div className="border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-background min-h-[120px]">
                    <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">Paste a link to a PDF, document, or any resource.</p>
                  </div>
                  <ControlledFormComponent
                    control={control}
                    name="file_path"
                    label="URL or path"
                    type={FORM_TYPE.TEXT}
                    placeholder="e.g. https://example.com/doc.pdf or /storage/materials/file.pdf"
                    maxLength={500}
                    tooltip="Link to the file or document. Can be a full URL (PDF, doc, video, etc.) or an internal path. Max 500 characters."
                  />
                </div>
              )}
            </div>

            {!canSubmit() && (
              <p className="text-xs text-muted-foreground">
                {sourceType === LMS_RESOURCE_SOURCE.UPLOAD && "Upload a file to continue."}
                {sourceType === LMS_RESOURCE_SOURCE.URL && "Enter a URL or path to continue."}
              </p>
            )}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
