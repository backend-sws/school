import Web from './Web'
import Api from './Api'
import Settings from './Settings'
import ShortUrlController from './ShortUrlController'
import Examination from './Examination'
import Timetable from './Timetable'
const Controllers = {
    Web: Object.assign(Web, Web),
Api: Object.assign(Api, Api),
Settings: Object.assign(Settings, Settings),
ShortUrlController: Object.assign(ShortUrlController, ShortUrlController),
Examination: Object.assign(Examination, Examination),
Timetable: Object.assign(Timetable, Timetable),
}

export default Controllers