import AdmissionApi from "@/lib/api/student/admissionApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Button } from "../ui/button";
import redirectToPayU from "@/lib/payUredirect";
import PaymentApi from "@/lib/api/payment";

const FeePreview = ({ applicationId, admissionType }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["feePreview", applicationId],
    queryFn: () => AdmissionApi.feePreview(applicationId),
    enabled: !!applicationId,
  });
  const paymentMutation = useMutation({
    mutationFn: PaymentApi.dopayment,
    onSuccess: (res) => {
      const paymentData = res.data;

      if (!paymentData) return;

      redirectToPayU(paymentData);
    },
  });

  const feePreview = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-gray-500">Loading fee preview...</p>
      </div>
    );
  }

  if (!feePreview) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-red-500">No fee data found</p>
      </div>
    );
  }
  const handlePayment = () => {
    paymentMutation.mutate({
      id: applicationId,
      type: admissionType,
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Fee Preview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Application ID</p>
            <p className="font-medium">{feePreview.application_id}</p>
          </div>

          <div>
            <p className="text-gray-500">Applicant Name</p>
            <p className="font-medium">{feePreview.applicant_name}</p>
          </div>

          <div>
            <p className="text-gray-500">Course</p>
            <p className="font-medium uppercase">{feePreview.course}</p>
          </div>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-700">
          Fee Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Fee Head</th>
                <th className="text-right px-4 py-2 border-b">Amount (₹)</th>
              </tr>
            </thead>

            <tbody>
              {feePreview.fee_breakdown.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{item.head_name}</td>
                  <td className="px-4 py-2 border-b text-right font-medium">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-4 py-2 text-right">Admission Fee Subtotal</td>
                <td className="px-4 py-2 text-right">
                  ₹{feePreview.summary.admission_fee_subtotal}
                </td>
              </tr>

              <tr className="bg-blue-50 text-blue-700 text-lg">
                <td className="px-4 py-3 text-right">Total Payable</td>
                <td className="px-4 py-3 text-right">
                  ₹{feePreview.summary.total_payable}
                </td>
              </tr>
            </tfoot>
          </table>{" "}
          <Button
            onClick={handlePayment}
            disabled={paymentMutation.isPending}
            className="float-right my-4"
          >
            {paymentMutation.isPending ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeePreview;
