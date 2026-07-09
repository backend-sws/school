import api from "./api";

const API_URL = "/workflows";

const WorkflowApi = {
    getWorkflows: () => api.get(API_URL),
    getWorkflowById: (id: string | number) => api.get(`${API_URL}/${id}`),
    storeWorkflow: (data: any) => api.post(API_URL, data),
    updateWorkflow: (id: string | number, data: any) => api.put(`${API_URL}/${id}`, data),
    deleteWorkflow: (id: string | number) => api.delete(`${API_URL}/${id}`),
    syncPermissions: (workflowId: string | number, permissionIds: number[]) =>
        api.post(`${API_URL}/${workflowId}/permissions`, { permission_ids: permissionIds }),

    // Staff Overrides
    getStaffPermissions: (userId: string | number) => api.get(`/staff/${userId}/permissions`),
    syncStaffWorkflows: (userId: string | number, workflowIds: number[]) =>
        api.post(`/staff/${userId}/workflows`, { workflow_ids: workflowIds }),
    syncStaffOverrides: (userId: string | number, overrides: Array<{ id: number; granted: boolean }>) =>
        api.post(`/staff/${userId}/overrides`, { overrides }),
};

export default WorkflowApi;
