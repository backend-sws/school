import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import transportApi from "@/lib/api/transportApi";
import StudentApi from "@/lib/api/studentApi";
import {
  TRANSPORT_ASSIGNMENT_FORM_INITIAL,
  TRANSPORT_ASSIGNMENT_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/transport";
import { TransportAssignmentFormSchema, type TransportAssignmentFormValues } from "@/lib/validations/transport";
import { FORM_TYPE } from "@/constants";
import type { AsyncSelectConfig } from "@/types";
import { TransportQueryKeys } from "@/lib/querykey/transport";

export type TransportAssignmentDialogData = {
  id: number;
  user_id: number;
  transport_route_id: number;
  transport_stop_id: number;
  effective_from: string;
  effective_until?: string | null;
  remarks?: string | null;
  user?: { id: number; name: string; email?: string };
  transport_route?: { id: number; name: string; code?: string };
  transport_stop?: { id: number; name: string; code?: string };
} | null;

interface TransportAssignmentDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: TransportAssignmentDialogData;
}

export function formatToYmd(dateVal?: string | Date | null): string {
  if (!dateVal) return "";
  if (dateVal instanceof Date) {
    if (isNaN(dateVal.getTime())) return "";
    const year = dateVal.getFullYear();
    const month = String(dateVal.getMonth() + 1).padStart(2, "0");
    const day = String(dateVal.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const str = String(dateVal).trim();
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str.slice(0, 10);
}

export function TransportAssignmentDialog({ open, onClose, data }: TransportAssignmentDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { watch, handleSubmit, control, reset, setValue } = useForm<TransportAssignmentFormValues>({
    resolver: zodResolver(TransportAssignmentFormSchema) as any,
    defaultValues: TRANSPORT_ASSIGNMENT_FORM_INITIAL,
    mode: "onChange",
  });

  const routeId = watch("transport_route_id");

  const { data: routeStopsData } = useQuery({
    queryKey: ["transport-route-stops", routeId],
    queryFn: () => transportApi.routeStops.index(Number(routeId)),
    enabled: open && !!routeId,
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["transport-assignment", dataId],
    queryFn: () => transportApi.assignments.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students-list-all"],
    queryFn: () => StudentApi.getStudentList({ per_page: 500 }),
    enabled: open,
  });

  const { data: routesData, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ["transport-routes-all"],
    queryFn: () => transportApi.routes.index({ per_page: 500 }),
    enabled: open,
  });

  const assignmentDetail = (detail as { data?: TransportAssignmentDialogData })?.data ?? (detail as any);

  const studentOptions = useMemo(() => {
    const students = (studentsData as any)?.data ?? studentsData ?? [];
    return (Array.isArray(students) ? students : []).map((s: any) => {
      const sp = s.student_profile || s.studentProfile;
      const classInfo = sp?.stream?.name ? sp.stream.name : "";
      const regNo = sp?.reg_no ? `Reg: ${sp.reg_no}` : "";
      const fatherName = sp?.father_name ? `Father: ${sp.father_name}` : "";
      const extra = [classInfo, regNo, fatherName].filter(Boolean).join(" | ");
      const textLabel = extra ? `${s.name} (${extra})` : s.name;
      return {
        key: String(s.id),
        value: s.id,
        text: textLabel,
      };
    });
  }, [studentsData]);

  const routeOptions = useMemo(() => {
    const routes = (routesData as any)?.data ?? routesData ?? [];
    return (Array.isArray(routes) ? routes : []).map((r: any) => ({
      key: String(r.id),
      value: r.id,
      text: r.name,
    }));
  }, [routesData]);

  // Build stop options from the nested route-stops endpoint
  const stopOptions = useMemo(() => {
    const routeStops = (routeStopsData?.data ?? []) as {
      id: number;
      transport_stop_id: number;
      transport_stop?: { id: number; name: string; code?: string };
    }[];
    return routeStops.map((rs) => ({
      key: String(rs.transport_stop_id),
      text: rs.transport_stop
        ? rs.transport_stop.name + (rs.transport_stop.code ? ` (${rs.transport_stop.code})` : "")
        : String(rs.transport_stop_id),
      value: rs.transport_stop_id,
    }));
  }, [routeStopsData]);

  // Override fields to inject local data options
  const layoutWithStopOptions = useMemo(
    () =>
      TRANSPORT_ASSIGNMENT_DIALOG_FORM_LAYOUT.map((f) => {
        if (f.name === "user_id") {
          return {
            ...f,
            disabled: isEditMode,
            options: studentOptions,
            type: FORM_TYPE.SELECT,
            asyncConfig: undefined,
          };
        }
        if (f.name === "transport_route_id") {
          return {
            ...f,
            options: routeOptions,
            type: FORM_TYPE.SELECT,
            asyncConfig: undefined,
          };
        }
        if (f.name === "transport_stop_id") {
          return {
            ...f,
            type: FORM_TYPE.SELECT,
            asyncConfig: undefined,
            options: stopOptions,
          };
        }
        return f;
      }),
    [studentOptions, routeOptions, stopOptions, isEditMode],
  );

  useEffect(() => {
    if (routeId === "" || !routeId) {
      setValue("transport_stop_id", "");
    }
  }, [routeId, setValue]);

  const currentRecord = (isEditMode ? (assignmentDetail?.id ? assignmentDetail : data) : null) as TransportAssignmentDialogData;

  useEffect(() => {
    if (isEditMode && currentRecord?.id) {
      reset({
        user_id: currentRecord.user_id ?? "",
        transport_route_id: currentRecord.transport_route_id ?? "",
        transport_stop_id: currentRecord.transport_stop_id ?? "",
        effective_from: formatToYmd(currentRecord.effective_from),
        effective_until: formatToYmd(currentRecord.effective_until),
        remarks: currentRecord.remarks ?? "",
      });
    } else if (!isEditMode) {
      reset(TRANSPORT_ASSIGNMENT_FORM_INITIAL);
    }
  }, [isEditMode, currentRecord, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: TransportAssignmentFormValues) => {
      const body = {
        user_id: Number(payload.user_id),
        transport_route_id: Number(payload.transport_route_id),
        transport_stop_id: Number(payload.transport_stop_id),
        effective_from: formatToYmd(payload.effective_from),
        effective_until: payload.effective_until ? formatToYmd(payload.effective_until) : undefined,
        remarks: payload.remarks || undefined,
      };
      return isEditMode
        ? transportApi.assignments.update(dataId!, body)
        : transportApi.assignments.store(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-assignments"] });
      reset(TRANSPORT_ASSIGNMENT_FORM_INITIAL);
      onClose(false);
    },
  });

  return (
    <ModalDialog
      title={isEditMode ? "Edit Assignment" : "Add Assignment"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((formData) => handleMutation(formData)) as any}
      isLoading={isSaving || (isEditMode && isLoadingDetail) || isLoadingStudents || isLoadingRoutes}
    >
      <div className="grid gap-4">
        <Each
          of={layoutWithStopOptions}
          render={(form: any) => (
            <ControlledFormComponent
              control={control as any}
              options={form.options}
              disabled={form.disabled}
              {...form}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
