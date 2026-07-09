import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import R2Api, {
  validateFileForUpload,
  R2_MAX_FILE_SIZE_LABEL,
  R2_ALLOWED_EXTENSIONS,
} from "@/lib/api/r2Api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface R2FileUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  accept?: string;
  className?: string;
  /** Override max size label shown in the UI */
  maxSizeLabel?: string;
}

export function R2FileUpload({
  value,
  onChange,
  disabled,
  placeholder,
  accept = "image/*,application/pdf",
  className,
  maxSizeLabel,
}: R2FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch view URL when value changes
  useEffect(() => {
    if (value && typeof value === "string" && !value.startsWith("http")) {
      const fetchViewUrl = async () => {
        try {
          const response = await R2Api.getViewUrl(value) as any;
          if (response && response.url) {
            setViewUrl(response.url);
          }
        } catch (error) {
          console.error("Error fetching view URL:", error);
        }
      };
      fetchViewUrl();
    } else if (value && value.startsWith("http")) {
      setViewUrl(value);
    } else {
      setViewUrl(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ── Client-side security validation ──────────────────────────────
    const validationError = validateFileForUpload(file);
    if (validationError) {
      toast.error(validationError.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Upload via R2Api (validates again + gets presigned URL + PUTs to R2)
      const path = await R2Api.uploadFile(file, (percent) => {
        // Scale progress: 30-95% is the actual upload
        setUploadProgress(30 + Math.round(percent * 0.65));
      });

      setUploadProgress(100);
      onChange(path);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to upload file");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    setViewUrl(null);
    setUploadProgress(0);
  };

  const handleView = () => {
    if (viewUrl) {
      window.open(viewUrl, "_blank");
    }
  };

  const displaySizeLabel = maxSizeLabel ?? R2_MAX_FILE_SIZE_LABEL;
  const extensionHint = [...R2_ALLOWED_EXTENSIONS].slice(0, 6).join(", ") + "…";

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 transition-all duration-200",
          isUploading
            ? "bg-muted/50 border-primary/30"
            : "bg-muted/5 border-muted-foreground/20 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          accept={accept}
          className="hidden"
        />

        {value ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="size-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                {viewUrl && value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={viewUrl}
                    alt="Preview"
                    className="size-full object-cover rounded"
                  />
                ) : (
                  <FileText className="size-5" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {value.split("/").pop()}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  Uploaded
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {viewUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleView}
                  className="size-8 text-muted-foreground hover:text-primary"
                  title="View File"
                >
                  <Eye className="size-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="size-8 text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-2 cursor-pointer"
            onClick={() =>
              !disabled && !isUploading && fileInputRef.current?.click()
            }
          >
            <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
              <Upload className="size-5 text-primary/60" />
            </div>
            <p className="text-xs font-medium text-foreground">
              {placeholder || "Click to upload file"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              Max {displaySizeLabel} · {extensionHint}
            </p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg animate-in fade-in duration-200">
            <Loader2 className="size-6 text-primary animate-spin mb-2" />
            <div className="w-2/3 space-y-1">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-[10px] text-center font-medium text-primary">
                UPLOADING... {uploadProgress}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
