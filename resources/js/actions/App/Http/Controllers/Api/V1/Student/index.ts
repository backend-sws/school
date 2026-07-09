import StudentController from './StudentController'
import StudentServicesController from './StudentServicesController'
const Student = {
    StudentController: Object.assign(StudentController, StudentController),
StudentServicesController: Object.assign(StudentServicesController, StudentServicesController),
}

export default Student