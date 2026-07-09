import PayrollController from './PayrollController'
import LeaveTypeController from './LeaveTypeController'
import LeaveRequestController from './LeaveRequestController'
import StaffAttendanceController from './StaffAttendanceController'
import SalaryStructureController from './SalaryStructureController'
import PayrollComponentController from './PayrollComponentController'
const HR = {
    PayrollController: Object.assign(PayrollController, PayrollController),
LeaveTypeController: Object.assign(LeaveTypeController, LeaveTypeController),
LeaveRequestController: Object.assign(LeaveRequestController, LeaveRequestController),
StaffAttendanceController: Object.assign(StaffAttendanceController, StaffAttendanceController),
SalaryStructureController: Object.assign(SalaryStructureController, SalaryStructureController),
PayrollComponentController: Object.assign(PayrollComponentController, PayrollComponentController),
}

export default HR