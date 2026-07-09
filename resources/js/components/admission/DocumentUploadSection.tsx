import React, { RefObject } from "react";
import Each from "@/components/Each";
import { DocumentUploadRow } from "./DocumentUploadRow";

export interface DocTypeConfig {
  key: string;
  label: string;
  tooltip?: string;
}

interface DocumentUploadSectionProps {
  docTypes: readonly DocTypeConfig[];
  value: Record<string, string>;
  fileNames: Record<string, string>;
  onUpload: (key: string, file: File) => void;
  onRemove: (key: string) => void;
  uploadingKey: string | null;
  inputRefs: RefObject<Record<string, HTMLInputElement | null>>;
}

function setRefForKey(
  refs: RefObject<Record<string, HTMLInputElement | null>>,
  key: string
): (el: HTMLInputElement | null) => void {
  return (el) => {
    if (!refs.current) refs.current = {};
    refs.current[key] = el;
  };
}

export function DocumentUploadSection({
  docTypes,
  value,
  fileNames,
  onUpload,
  onRemove,
  uploadingKey,
  inputRefs,
}: DocumentUploadSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Each
        of={[...docTypes]}
        keyExtractor={(item) => item.key}
        render={({ key, label, tooltip }) => (
          <DocumentUploadRow
            label={label}
            tooltip={tooltip}
            path={value[key] ?? ""}
            fileName={fileNames[key]}
            onUpload={(file) => onUpload(key, file)}
            onRemove={() => onRemove(key)}
            uploading={uploadingKey === key}
            inputRef={setRefForKey(inputRefs, key)}
          />
        )}
      />
    </div>
  );
}
