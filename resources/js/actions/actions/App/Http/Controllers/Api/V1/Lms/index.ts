import LmsCourseController from './LmsCourseController'
import LmsClassController from './LmsClassController'
import ClassSubjectAllocationController from './ClassSubjectAllocationController'
import LmsClassEnrollmentController from './LmsClassEnrollmentController'
import LmsAssignmentController from './LmsAssignmentController'
import LmsAssignmentSubmissionController from './LmsAssignmentSubmissionController'
import LmsTestController from './LmsTestController'
import LmsTestQuestionController from './LmsTestQuestionController'
import LmsTestAttemptController from './LmsTestAttemptController'
import LmsLiveSessionController from './LmsLiveSessionController'
import LmsRecordingController from './LmsRecordingController'
import LmsAnnouncementController from './LmsAnnouncementController'
import LmsMaterialController from './LmsMaterialController'

const Lms = {
    LmsCourseController: Object.assign(LmsCourseController, LmsCourseController),
    LmsClassController: Object.assign(LmsClassController, LmsClassController),
    ClassSubjectAllocationController: Object.assign(ClassSubjectAllocationController, ClassSubjectAllocationController),
    LmsClassEnrollmentController: Object.assign(LmsClassEnrollmentController, LmsClassEnrollmentController),
    LmsAssignmentController: Object.assign(LmsAssignmentController, LmsAssignmentController),
    LmsAssignmentSubmissionController: Object.assign(LmsAssignmentSubmissionController, LmsAssignmentSubmissionController),
    LmsTestController: Object.assign(LmsTestController, LmsTestController),
    LmsTestQuestionController: Object.assign(LmsTestQuestionController, LmsTestQuestionController),
    LmsTestAttemptController: Object.assign(LmsTestAttemptController, LmsTestAttemptController),
    LmsLiveSessionController: Object.assign(LmsLiveSessionController, LmsLiveSessionController),
    LmsRecordingController: Object.assign(LmsRecordingController, LmsRecordingController),
    LmsAnnouncementController: Object.assign(LmsAnnouncementController, LmsAnnouncementController),
    LmsMaterialController: Object.assign(LmsMaterialController, LmsMaterialController),
}

export default Lms