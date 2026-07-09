import InventoryCategoryController from './InventoryCategoryController'
import InventoryLocationController from './InventoryLocationController'
import InventoryItemController from './InventoryItemController'
import InventoryMovementController from './InventoryMovementController'
import InventoryReportController from './InventoryReportController'
import InventorySaleController from './InventorySaleController'

const Inventory = {
    InventoryCategoryController: Object.assign(InventoryCategoryController, InventoryCategoryController),
    InventoryLocationController: Object.assign(InventoryLocationController, InventoryLocationController),
    InventoryItemController: Object.assign(InventoryItemController, InventoryItemController),
    InventoryMovementController: Object.assign(InventoryMovementController, InventoryMovementController),
    InventoryReportController: Object.assign(InventoryReportController, InventoryReportController),
    InventorySaleController: Object.assign(InventorySaleController, InventorySaleController),
}

export default Inventory