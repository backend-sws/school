import TransportStopController from './TransportStopController'
import TransportRouteController from './TransportRouteController'
import TransportDriverController from './TransportDriverController'
import TransportVehicleController from './TransportVehicleController'
import TransportVehicleAnalyticsController from './TransportVehicleAnalyticsController'
import TransportVehicleLogController from './TransportVehicleLogController'
import TransportVehicleFuelController from './TransportVehicleFuelController'
import TransportVehicleExpenseController from './TransportVehicleExpenseController'
import TransportAssignmentController from './TransportAssignmentController'
import TransportReportController from './TransportReportController'
const Transport = {
    TransportStopController: Object.assign(TransportStopController, TransportStopController),
TransportRouteController: Object.assign(TransportRouteController, TransportRouteController),
TransportDriverController: Object.assign(TransportDriverController, TransportDriverController),
TransportVehicleController: Object.assign(TransportVehicleController, TransportVehicleController),
TransportVehicleAnalyticsController: Object.assign(TransportVehicleAnalyticsController, TransportVehicleAnalyticsController),
TransportVehicleLogController: Object.assign(TransportVehicleLogController, TransportVehicleLogController),
TransportVehicleFuelController: Object.assign(TransportVehicleFuelController, TransportVehicleFuelController),
TransportVehicleExpenseController: Object.assign(TransportVehicleExpenseController, TransportVehicleExpenseController),
TransportAssignmentController: Object.assign(TransportAssignmentController, TransportAssignmentController),
TransportReportController: Object.assign(TransportReportController, TransportReportController),
}

export default Transport