import api from "./api";

const API_URL = "/student";

const PaymentApi = {
  dopayment: (data: any) => api.post(`${API_URL}/payment/initiate`, data),
};
export default PaymentApi;
