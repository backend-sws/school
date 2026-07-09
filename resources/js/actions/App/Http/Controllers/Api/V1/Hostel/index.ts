import HostelController from './HostelController'
import HostelFloorController from './HostelFloorController'
import HostelRoomController from './HostelRoomController'
import HostelBedController from './HostelBedController'
import HostelAllocationController from './HostelAllocationController'
import HostelComplaintController from './HostelComplaintController'
import HostelMessPlanController from './HostelMessPlanController'
import HostelReportController from './HostelReportController'
const Hostel = {
    HostelController: Object.assign(HostelController, HostelController),
HostelFloorController: Object.assign(HostelFloorController, HostelFloorController),
HostelRoomController: Object.assign(HostelRoomController, HostelRoomController),
HostelBedController: Object.assign(HostelBedController, HostelBedController),
HostelAllocationController: Object.assign(HostelAllocationController, HostelAllocationController),
HostelComplaintController: Object.assign(HostelComplaintController, HostelComplaintController),
HostelMessPlanController: Object.assign(HostelMessPlanController, HostelMessPlanController),
HostelReportController: Object.assign(HostelReportController, HostelReportController),
}

export default Hostel