import PaymentApi from "@/lib/api/payment";
import redirectToPayU from "@/lib/payUredirect";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type PaymentResponse = {
  data: any; // Replace with proper type
};

export const usePayment = (
  options?: UseMutationOptions<PaymentResponse, unknown, any>,
) => {
  return useMutation({
    mutationFn: PaymentApi.dopayment,

    onSuccess: (res, variables, context) => {
      const paymentData = res?.data;

      if (!paymentData) return;

      redirectToPayU(paymentData);

      // Allow override / extension
      //   options?.onSuccess?.(res, variables, context);
    },

    onError: (error, variables, context) => {
      //   options?.onError?.(error, variables, context);
    },

    ...options,
  });
};
