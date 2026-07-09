import StudentProfileController from './StudentProfileController'
import StudentDashboardController from './StudentDashboardController'
import AdmissionSubmissionController from './AdmissionSubmissionController'
import AdmissionApplicationController from './AdmissionApplicationController'
import CertificateHeadController from './CertificateHeadController'
import CertificateApplicationController from './CertificateApplicationController'
import StudentIdCardController from './StudentIdCardController'
import StudentTransactionController from './StudentTransactionController'
import StudentFinancialLedgerController from './StudentFinancialLedgerController'
import StudentNoticeController from './StudentNoticeController'

const StudentDashboard = {
    StudentProfileController: Object.assign(StudentProfileController, StudentProfileController),
    StudentDashboardController: Object.assign(StudentDashboardController, StudentDashboardController),
    AdmissionSubmissionController: Object.assign(AdmissionSubmissionController, AdmissionSubmissionController),
    AdmissionApplicationController: Object.assign(AdmissionApplicationController, AdmissionApplicationController),
    CertificateHeadController: Object.assign(CertificateHeadController, CertificateHeadController),
    CertificateApplicationController: Object.assign(CertificateApplicationController, CertificateApplicationController),
    StudentIdCardController: Object.assign(StudentIdCardController, StudentIdCardController),
    StudentTransactionController: Object.assign(StudentTransactionController, StudentTransactionController),
    StudentFinancialLedgerController: Object.assign(StudentFinancialLedgerController, StudentFinancialLedgerController),
    StudentNoticeController: Object.assign(StudentNoticeController, StudentNoticeController),
}

export default StudentDashboard