import Web from './Web'
import Api from './Api'
import Settings from './Settings'
import Examination from './Examination'
import Timetable from './Timetable'

const Controllers = {
    Web: Object.assign(Web, Web),
    Api: Object.assign(Api, Api),
    Settings: Object.assign(Settings, Settings),
    Examination: Object.assign(Examination, Examination),
    Timetable: Object.assign(Timetable, Timetable),
}

export default Controllers