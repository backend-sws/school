import api from "./api";

const API_URL = "/roles";

/** Role list excludes protected keys (super_admin, college_admin, student, candidate). All other roles are included. */
/** Custom roles only: institution-created roles (is_system = false), for the Security Roles settings table. */
const RoleApi = {
  getRoles: () => api.get(API_URL),
  getCustomRoles: (params?: Record<string, any>) => api.get(`${API_URL}/custom`, { params }),
  getRoleById: (id: string | number) => api.get(`${API_URL}/${id}`),
  storeRole: (data: any) => api.post(API_URL, data),
  updateRole: (id: string | number, data: any) => api.put(`${API_URL}/${id}`, data),
  deleteRole: (id: string | number) => api.delete(`${API_URL}/${id}`),
  syncRoleWorkflows: (roleId: string | number, workflowIds: number[]) =>
    api.post(`${API_URL}/${roleId}/workflows`, { workflow_ids: workflowIds }),
  syncPermissions: (roleId: string | number, permissionIds: number[]) =>
    api.post(`${API_URL}/${roleId}/permissions`, { permission_ids: permissionIds }),
  getPermissions: () => api.get("/permissions"),
  assignRoleToUser: (userId: string, data: { role_id: number; scope_type?: string; scope_id?: number }) =>
    api.post(`/users/${userId}/roles`, data),
};

export default RoleApi;
