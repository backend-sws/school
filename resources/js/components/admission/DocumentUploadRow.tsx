import React, { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { Upload, Loader2, X } from "lucide-react";

interface DocumentUploadRowProps {
  label: string;
  tooltip?: string;
  path: string;
  fileName?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  uploading?: boolean;
  inputRef?: React.RefCallback<HTMLInputElement | null> | React.RefObject<HTMLInputElement | null>;
}

export function DocumentUploadRow({
  label,
  tooltip,
  path,
  fileName,
  onUpload,
  onRemove,
  accept = ".pdf,.jpg,.jpeg,.png",
  uploading = false,
  inputRef,
}: DocumentUploadRowProps) {
  const localRef = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      localRef.current = el;
      if (typeof inputRef === "function") inputRef(el);
      else if (inputRef && "current" in inputRef) (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
    },
    [inputRef]
  );

  return (
    <div className="flex flex-wrap items-center gap-2 rounded border bg-background p-3">
      <div className="flex items-center gap-1.5 w-full md:w-40 shrink-0">
        <Label className="text-sm font-medium">{label}</Label>
        {tooltip ? <HelperTooltip content={tooltip} className="inline-flex" /> : null}
      </div>
      <input
        ref={setRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
      {path ? (
        <>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]" title={fileName}>
            {fileName ?? path.split("/").pop() ?? "Uploaded"} (Uploaded)
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <X className="size-4 mr-1" />
            Remove
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => localRef.current?.click()}
          className="gap-2"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading…" : "Choose file"}
        </Button>
      )}
    </div>
  );
}
