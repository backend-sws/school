import { FileUpload } from "@/components/ui/file-upload";

export type FormFileInputMode = "single" | "multiple" | "avatar" | "portrait";

export interface FormFileInputProps {
  value?: string | string[] | File | File[] | null;
  onChange: (value: string | string[] | null) => void;
  fileMode?: FormFileInputMode;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  onBlur?: (e: any) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * File input for form config: delegates to FileUpload with mode derived from fileMode.
 */
export function FormFileInput({
  value,
  onChange,
  fileMode = "single",
  maxFiles,
  accept = "image/*",
  disabled,
  error,
  className,
  onBlur,
  onUploadingChange,
}: FormFileInputProps) {
  if (fileMode === "multiple") {
    return (
      <FileUpload
        mode="multiple"
        maxFiles={maxFiles}
        value={Array.isArray(value) ? value : []}
        onChange={onChange as (v: string[]) => void}
        accept={accept}
        disabled={disabled}
        error={!!error}
        onBlur={onBlur}
        className={className}
        onUploadingChange={onUploadingChange}
      />
    );
  }

  if (fileMode === "portrait") {
    return (
      <FileUpload
        mode="portrait"
        value={(value as string | File | null) ?? null}
        onChange={onChange as (v: string | null) => void}
        accept={accept}
        disabled={disabled}
        error={!!error}
        onBlur={onBlur}
        className={className}
        onUploadingChange={onUploadingChange}
      />
    );
  }

  return (
    <FileUpload
      mode={fileMode === "avatar" ? "avatar" : "single"}
      value={(value as string | File | null) ?? null}
      onChange={onChange as (v: string | null) => void}
      accept={accept}
      disabled={disabled}
      error={!!error}
      onBlur={onBlur}
      className={className}
      onUploadingChange={onUploadingChange}
    />
  );
}
