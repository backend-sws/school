import ExamController from './ExamController'
import ExamScheduleController from './ExamScheduleController'
import GradingScaleController from './GradingScaleController'
import MarksEntryController from './MarksEntryController'
import MarksheetController from './MarksheetController'
import ExamResultController from './ExamResultController'

const Examination = {
    ExamController: Object.assign(ExamController, ExamController),
    ExamScheduleController: Object.assign(ExamScheduleController, ExamScheduleController),
    GradingScaleController: Object.assign(GradingScaleController, GradingScaleController),
    MarksEntryController: Object.assign(MarksEntryController, MarksEntryController),
    MarksheetController: Object.assign(MarksheetController, MarksheetController),
    ExamResultController: Object.assign(ExamResultController, ExamResultController),
}

export default Examination