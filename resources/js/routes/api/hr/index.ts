import payrolls from './payrolls'
import payslips from './payslips'
import leaveTypes from './leave-types'
import leaveRequests from './leave-requests'
import salaryStructures from './salary-structures'
import payrollComponents from './payroll-components'
const hr = {
    payrolls: Object.assign(payrolls, payrolls),
payslips: Object.assign(payslips, payslips),
leaveTypes: Object.assign(leaveTypes, leaveTypes),
leaveRequests: Object.assign(leaveRequests, leaveRequests),
salaryStructures: Object.assign(salaryStructures, salaryStructures),
payrollComponents: Object.assign(payrollComponents, payrollComponents),
}

export default hr