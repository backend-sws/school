import ContactController from './ContactController'
import GrievanceController from './GrievanceController'
import FeedbackController from './FeedbackController'
const Grievance = {
    ContactController: Object.assign(ContactController, ContactController),
GrievanceController: Object.assign(GrievanceController, GrievanceController),
FeedbackController: Object.assign(FeedbackController, FeedbackController),
}

export default Grievance