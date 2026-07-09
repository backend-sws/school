import React, { useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import SupportTicketApi from "@/lib/api/supportTicketApi";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import R2Api from "@/lib/api/r2Api";

interface SupportTicketMessageDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
  showpriority?: boolean;
}

// Message bubble component for chat-like display
function MessageBubble({ message }: { message: any }) {
  const isUserMessage = message.user?.id === message.user?.id; // You should compare with current user
  const timeAgo =
    new Date(message.created_at).toLocaleDateString() +
    " " +
    new Date(message.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className={`flex gap-3 mb-4 ${isUserMessage ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isUserMessage
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-900 rounded-tl-none"
        }`}
      >
        <p className="text-sm font-semibold mb-1">{message.user?.name}</p>
        <p className="text-sm break-words">{message.message}</p>
        {message.attachment && (
          <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
            <FileText className="size-3" />
            <img
              src={R2Api.imageSrc(message.attachment)}
              className="underline hover:no-underline"
            />
          </div>
        )}
        <p
          className={`text-xs mt-2 ${isUserMessage ? "text-blue-100" : "text-gray-500"}`}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    open: { icon: AlertCircle, color: "bg-blue-100 text-blue-800" },
    "in-progress": { icon: Clock3, color: "bg-yellow-100 text-yellow-800" },
    closed: { icon: CheckCircle2, color: "bg-red-100 text-red-800" },
  };
  const Icon = config[status as keyof typeof config]?.icon || AlertCircle;
  const colors = config[status as keyof typeof config]?.color || "";

  return (
    <Badge className={`${colors} capitalize`}>
      <Icon className="size-3 mr-1" />
      {status}
    </Badge>
  );
}

export function SupportTicketMessageDialog({
  open,
  onClose,
  data,
  showpriority = true,
}: SupportTicketMessageDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      message: "",
      attachment: "",
    },
    mode: "onChange",
  });

  const ticketId = data?.id;

  const { data: ticketDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["supportTicketDetail", ticketId],
    queryFn: () => SupportTicketApi.getSupportTicketById(ticketId as string),
    enabled: open && !!ticketId,
  });

  const { mutate: postReply, isPending: isReplying } = useMutation({
    mutationFn: (submitData: any) =>
      SupportTicketApi.postReply(ticketId as string, {
        message: submitData.message,
        attachment: submitData.attachment || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supportTicketDetail", ticketId],
      });
      toast.success("Reply posted successfully");
      reset();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to post reply";
      toast.error(message);
    },
  });

  const onSubmit = (formData: any) => {
    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    postReply(formData);
  };

  const ticket = ticketDetail?.data;
  const isTicketClosed = ticket?.status === "closed";

  return (
    <ModalDialog
      title="Support Ticket Messages"
      description={`Ticket #${ticket?.ticket_id || "..."}`}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isReplying || isLoadingDetail}
      submitLabel="Post Reply"
      className="sm:max-w-2xl"
      disabled={isTicketClosed}
    >
      {isLoadingDetail ? (
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Ticket Header Info */}
          <div className=" p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Ticket ID
                </p>
                <p className="text-sm font-mono">{ticket?.ticket_id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Status
                </p>
                <div className="mt-1">
                  <StatusBadge status={ticket?.status} />
                </div>
              </div>
              {showpriority && (
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Priority
                  </p>
                  <p className="text-sm capitalize font-semibold text-orange-600">
                    {ticket?.priority}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Support For
                </p>
                <p className="text-sm">{ticket?.support_for}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ticket Subject */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Subject</h3>
            <p className="text-sm text-foreground">{ticket?.subject}</p>
          </div>

          {/* Initial Description */}
          <div className="space-y-2  p-4 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold  flex items-center gap-2">
              <MessageSquare className="size-3" />
              Initial Issue
            </p>
            <p className="text-sm  whitespace-pre-wrap">
              {ticket?.description}
            </p>
            {ticket?.attachment && (
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-700">
                <FileText className="size-3" />
                <a
                  href={R2Api.imageSrc(ticket.attachment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  Attachment
                </a>
              </div>
            )}
          </div>

          <Separator />

          {/* Messages Thread */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">
                Thread ({ticket?.messages?.length || 0} messages)
              </h3>
            </div>

            <ScrollArea className="h-64 rounded-lg border p-4 ">
              <div className="space-y-4 pr-4">
                {ticket?.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((message: any) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    <MessageSquare className="size-4 mr-2" />
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Reply Form */}
          {!isTicketClosed ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Post a Reply</h3>
              <ControlledFormComponent
                control={control}
                name="message"
                label="Message"
                type="textarea"
                placeholder="Type your message here..."
                required={true}
                helperText="Your response will be visible to the ticket creator"
              />
              <ControlledFormComponent
                control={control}
                name="attachment"
                label="Attachment (Optional)"
                type="file"
                placeholder="Attachment URL"
                helperText="Provide a link to any supporting documents"
              />
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Ticket is Closed
                </p>
                <p className="text-xs text-red-700">
                  You cannot reply to closed tickets. Reopen the ticket to
                  continue the conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </ModalDialog>
  );
}
