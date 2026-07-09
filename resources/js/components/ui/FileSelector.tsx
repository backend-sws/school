import React, { useRef, useState, useCallback } from "react";
import { Upload, X, File, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileSelectorProps {
  value?: any;
  onChange?: (files: any) => void;
  onFileSelect?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  label?: string;
  description?: string;
  disabled?: boolean;
  onBlur?: (e: any) => void;
}

interface SelectedFile {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  value,
  onChange,
  onFileSelect,
  multiple = false,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  label = "Upload Files",
  description = "Drag and drop your files here or click to browse",
  disabled = false,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size exceeds ${sizeMB}MB limit`,
      };
    }
    return { valid: true };
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = Array.from(files);
      const newFiles: SelectedFile[] = [];
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const validation = validateFile(file);
        const fileId = `${file.name}-${Date.now()}-${Math.random()}`;

        if (validation.valid) {
          if (!multiple && selectedFiles.length > 0) {
            setSelectedFiles([]);
          }

          if (selectedFiles.length + newFiles.length < maxFiles) {
            newFiles.push({
              file,
              id: fileId,
              progress: 0,
              status: "pending",
            });
            validFiles.push(file);
          }
        } else {
          newFiles.push({
            file,
            id: fileId,
            progress: 0,
            status: "error",
            error: validation.error,
          });
        }
      });

      setSelectedFiles((prev) =>
        multiple ? [...prev, ...newFiles] : newFiles,
      );
      if (validFiles.length > 0) {
        onChange?.(validFiles);
        onFileSelect?.(validFiles);
      }
    },
    [
      multiple,
      selectedFiles,
      maxFiles,
      maxSize,
      disabled,
      onChange,
      onFileSelect,
    ],
  );

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(e.type === "dragenter" || e.type === "dragover");
      }
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-10 h-10 object-cover rounded"
        />
      );
    }
    return <File className="w-10 h-10 text-gray-400" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${isDragActive
          ? "border-blue-500 bg-blue-50 scale-105"
          : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          onBlur={onBlur}
          disabled={disabled}
          className="hidden"
        />

        {/* Animated Background */}
        {isDragActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 animate-pulse" />
        )}

        {/* Content */}
        <div className="relative py-12 px-6 text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-full ${isDragActive ? "bg-blue-100" : "bg-gray-200"}`}
            >
              <Upload
                className={`w-8 h-8 transition-all ${isDragActive ? "text-blue-600 scale-110" : "text-gray-600"
                  }`}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>

          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <span>Max size: {formatFileSize(maxSize)}</span>
            {multiple && <span>•</span>}
            {multiple && <span>Max files: {maxFiles}</span>}
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">
            Selected Files ({selectedFiles.length})
          </h4>

          <div className="space-y-2">
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.status === "error"
                  ? "bg-red-50 border-red-200"
                  : item.status === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
              >
                {/* File Icon/Thumbnail */}
                <div className="flex-shrink-0">
                  {item.status === "error" ? (
                    <div className="w-10 h-10 bg-red-200 rounded flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  ) : item.status === "success" ? (
                    <div className="w-10 h-10 bg-green-200 rounded flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    getFileIcon(item.file)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.file.size)}
                    </p>
                    {item.error && (
                      <p className="text-xs text-red-600 font-medium">
                        {item.error}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {item.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(item.id)}
                  disabled={item.status === "uploading"}
                  className={cn(
                    "flex-shrink-0 p-1 rounded-md transition-colors h-8 w-8",
                    item.status === "uploading"
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  )}
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Message */}
      {selectedFiles.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No files selected yet. Drag and drop files or click to browse.
        </p>
      )}
    </div>
  );
};

export default FileSelector;
