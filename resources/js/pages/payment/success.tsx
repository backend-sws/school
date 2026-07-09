import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download } from "lucide-react";

interface SuccessPageProps {
  transactionId?: string;
  amount?: string;
  onGoDashboard?: () => void;
  onDownloadReceipt?: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  transactionId,
  amount,
  onGoDashboard,
  onDownloadReceipt,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Payment Successful
            </h1>
            <p className="text-sm text-muted-foreground">
              Your transaction has been completed successfully.
            </p>
          </div>

          {/* Details */}
          {(transactionId || amount) && (
            <div className="bg-muted/40 rounded-lg p-4 text-sm space-y-2 border border-border">
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium text-foreground">
                    {transactionId}
                  </span>
                </div>
              )}

              {amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-foreground">{amount}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={onGoDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition h-10 w-full"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </Button>

            <Button
              variant="outline"
              onClick={onDownloadReceipt}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition h-10 w-full"
            >
              Download Receipt
              <Download size={16} />
            </Button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          A confirmation has been sent to your registered details.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
