import api from "./api";

export interface Transaction {
    id: number;
    transaction_id: string;
    gateway_txn_id: string | null;
    amount: string;
    status: string;
    gateway_name: string | null;
    payable_type: string;
    payable_id: number;
    created_at: string;
    payable?: {
        title?: string;
        application_id?: string;
        name?: string;
    } | any;
}

const transactionApi = {
    getStudentTransactions: (params?: any) =>
        api.get("/student/transactions", { params }),
};

export default transactionApi;
