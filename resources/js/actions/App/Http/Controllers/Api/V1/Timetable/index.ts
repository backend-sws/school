import TimetableTemplateController from './TimetableTemplateController'
import RoomController from './RoomController'
import TimetableController from './TimetableController'
import SubstitutionController from './SubstitutionController'
const Timetable = {
    TimetableTemplateController: Object.assign(TimetableTemplateController, TimetableTemplateController),
RoomController: Object.assign(RoomController, RoomController),
TimetableController: Object.assign(TimetableController, TimetableController),
SubstitutionController: Object.assign(SubstitutionController, SubstitutionController),
}

export default Timetable