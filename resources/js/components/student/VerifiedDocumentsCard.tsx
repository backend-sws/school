import React, { useMemo } from "react";
import { FileText, ExternalLink, Download } from "lucide-react";
import R2Api from "@/lib/api/r2Api";
import Each from "@/components/Each";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DOCUMENT_STATUS_CONFIG,
  STUDENT_DASHBOARD_LABELS,
} from "@/constants/page/studentDashboard";

interface Document {
  type?: string;
  url?: string;
  status?: string;
  doc_type?: string;
  document_type?: string;
  doc_path?: string;
  file_url?: string;
}

interface VerifiedDocumentsCardProps {
  documents: Document[];
  isLoading?: boolean;
  className?: string;
}

const DocsLoader = () => (
  <div className="divide-y divide-border/50">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 px-5 py-3.5">
        <Skeleton className="size-9 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const VerifiedDocumentsCard = ({
  documents,
  isLoading = false,
  className,
}: VerifiedDocumentsCardProps) => {
  const summaryEntries = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      const s = doc.status ?? "pending";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts);
  }, [documents]);

  return (
    <div className={`rounded-2xl border border-border bg-card overflow-hidden flex flex-col ${className ?? ""}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <FileText size={15} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {STUDENT_DASHBOARD_LABELS.documentsCardTitle}
          </h3>
        </div>
        {!isLoading && documents.length > 0 && (
          <div className="flex items-center gap-2">
            <Each
              of={summaryEntries}
              keyExtractor={([status]) => status}
              render={([status, count]) => {
                const cfg = DOCUMENT_STATUS_CONFIG[status] ?? DOCUMENT_STATUS_CONFIG.pending;
                return (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                    {count}
                  </span>
                );
              }}
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <DocsLoader />
      ) : (
        <div className="p-5 overflow-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Each
              of={documents}
              keyExtractor={(_, i) => String(i)}
              nodatafound={
                <div className="col-span-full py-8 text-center border-2 border-dashed rounded-xl">
                  <FileText size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {STUDENT_DASHBOARD_LABELS.documentsEmptyMessage}
                  </p>
                </div>
              }
              render={(doc) => <DocumentPreviewCard doc={doc} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentPreviewCard = ({ doc }: { doc: Document }) => {
  const [imgError, setImgError] = React.useState(false);
  const rawType = doc.type || doc.doc_type || doc.document_type || "Document";
  const docName = rawType.replace(/_/g, " ");
  const rawUrl = doc.url || doc.doc_path || doc.file_url || "";
  const fileUrl = rawUrl ? R2Api.imageSrc(rawUrl) : "";
  const isPdf = rawUrl.toLowerCase().endsWith(".pdf");
  const isBroken = imgError || !fileUrl;

  return (
    <div className="group relative rounded-xl border bg-card overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all">
      <div className="aspect-[4/3] bg-muted/50 relative flex items-center justify-center overflow-hidden border-b">
        {isPdf || isBroken ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <FileText size={32} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {isPdf ? "PDF" : "DOC"}
            </span>
          </div>
        ) : (
          <img 
            src={fileUrl} 
            alt={docName} 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          {fileUrl && (
            <>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                title="View"
              >
                <ExternalLink size={16} />
              </a>
              <a
                href={fileUrl}
                download
                className="size-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                title="Download"
              >
                <Download size={16} />
              </a>
            </>
          )}
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground capitalize truncate text-center" title={docName}>
          {docName}
        </p>
      </div>
    </div>
  );
};
