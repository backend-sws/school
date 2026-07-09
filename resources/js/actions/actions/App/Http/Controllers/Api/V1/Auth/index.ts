import AuthController from './AuthController'
import StudentAuthController from './StudentAuthController'
import UserController from './UserController'
import StaffPermissionController from './StaffPermissionController'
import RoleController from './RoleController'
import WorkflowController from './WorkflowController'
import PermissionController from './PermissionController'

const Auth = {
    AuthController: Object.assign(AuthController, AuthController),
    StudentAuthController: Object.assign(StudentAuthController, StudentAuthController),
    UserController: Object.assign(UserController, UserController),
    StaffPermissionController: Object.assign(StaffPermissionController, StaffPermissionController),
    RoleController: Object.assign(RoleController, RoleController),
    WorkflowController: Object.assign(WorkflowController, WorkflowController),
    PermissionController: Object.assign(PermissionController, PermissionController),
}

export default Auth