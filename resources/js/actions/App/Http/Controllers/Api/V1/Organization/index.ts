import SessionController from './SessionController'
import OrganizationController from './OrganizationController'
import InstitutionController from './InstitutionController'
import BulkImportController from './BulkImportController'
import DepartmentController from './DepartmentController'
import MainStreamController from './MainStreamController'
import StreamController from './StreamController'
import SubjectController from './SubjectController'
import SubjectCategoryController from './SubjectCategoryController'
import SubjectCategoryMappingController from './SubjectCategoryMappingController'
import SubjectGroupController from './SubjectGroupController'
import AcademicCalendarSettingsController from './AcademicCalendarSettingsController'
import BillingController from './BillingController'
const Organization = {
    SessionController: Object.assign(SessionController, SessionController),
OrganizationController: Object.assign(OrganizationController, OrganizationController),
InstitutionController: Object.assign(InstitutionController, InstitutionController),
BulkImportController: Object.assign(BulkImportController, BulkImportController),
DepartmentController: Object.assign(DepartmentController, DepartmentController),
MainStreamController: Object.assign(MainStreamController, MainStreamController),
StreamController: Object.assign(StreamController, StreamController),
SubjectController: Object.assign(SubjectController, SubjectController),
SubjectCategoryController: Object.assign(SubjectCategoryController, SubjectCategoryController),
SubjectCategoryMappingController: Object.assign(SubjectCategoryMappingController, SubjectCategoryMappingController),
SubjectGroupController: Object.assign(SubjectGroupController, SubjectGroupController),
AcademicCalendarSettingsController: Object.assign(AcademicCalendarSettingsController, AcademicCalendarSettingsController),
BillingController: Object.assign(BillingController, BillingController),
}

export default Organization