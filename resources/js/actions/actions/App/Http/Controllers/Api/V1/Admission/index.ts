import FeeStructureController from './FeeStructureController'
import ApplicationController from './ApplicationController'
import AdmissionSettingsController from './AdmissionSettingsController'
import StudentVerificationController from './StudentVerificationController'
import PromotionController from './PromotionController'
import ReadmissionController from './ReadmissionController'

const Admission = {
    FeeStructureController: Object.assign(FeeStructureController, FeeStructureController),
    ApplicationController: Object.assign(ApplicationController, ApplicationController),
    AdmissionSettingsController: Object.assign(AdmissionSettingsController, AdmissionSettingsController),
    StudentVerificationController: Object.assign(StudentVerificationController, StudentVerificationController),
    PromotionController: Object.assign(PromotionController, PromotionController),
    ReadmissionController: Object.assign(ReadmissionController, ReadmissionController),
}

export default Admission