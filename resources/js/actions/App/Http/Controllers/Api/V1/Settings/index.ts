import AuditLogController from './AuditLogController'
import SettingController from './SettingController'
const Settings = {
    AuditLogController: Object.assign(AuditLogController, AuditLogController),
SettingController: Object.assign(SettingController, SettingController),
}

export default Settings