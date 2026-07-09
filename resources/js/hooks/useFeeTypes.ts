import { useQuery } from "@tanstack/react-query";
import feeTypesApi from "@/lib/api/feeTypesApi";
import { FeeTypeQueryKeys } from "@/lib/querykey/feeType";
import { toFieldOptions } from "@/lib/utils";

/**
 * Fetches fee types for the current institution, formatted as dropdown options.
 * Drop-in replacement for the removed `useCollegeFeeParticulars`.
 */
export function useFeeTypes({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: FeeTypeQueryKeys.list({ all: true }),
    queryFn: () => feeTypesApi.index({ all: true }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const raw = data?.data?.data ?? data?.data ?? [];
  const feeTypes = toFieldOptions(raw, { text: (item: any) => item.name });

  return { feeTypes, isLoading, raw };
}
