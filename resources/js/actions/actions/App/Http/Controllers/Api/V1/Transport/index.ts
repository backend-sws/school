import TransportStopController from './TransportStopController'
import TransportRouteController from './TransportRouteController'
import TransportDriverController from './TransportDriverController'
import TransportVehicleController from './TransportVehicleController'
import TransportAssignmentController from './TransportAssignmentController'
import TransportReportController from './TransportReportController'

const Transport = {
    TransportStopController: Object.assign(TransportStopController, TransportStopController),
    TransportRouteController: Object.assign(TransportRouteController, TransportRouteController),
    TransportDriverController: Object.assign(TransportDriverController, TransportDriverController),
    TransportVehicleController: Object.assign(TransportVehicleController, TransportVehicleController),
    TransportAssignmentController: Object.assign(TransportAssignmentController, TransportAssignmentController),
    TransportReportController: Object.assign(TransportReportController, TransportReportController),
}

export default Transport