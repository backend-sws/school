import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
export const exportLowStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportLowStock.url(options),
    method: 'get',
})

exportLowStock.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/reports/low-stock/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
exportLowStock.url = (options?: RouteQueryOptions) => {
    return exportLowStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
exportLowStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportLowStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
exportLowStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportLowStock.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
    const exportLowStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportLowStock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
        exportLowStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportLowStock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::exportLowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:73
 * @route '/api/v1/inventory/reports/low-stock/export'
 */
        exportLowStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportLowStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportLowStock.form = exportLowStockForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
export const lowStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lowStock.url(options),
    method: 'get',
})

lowStock.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/reports/low-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
lowStock.url = (options?: RouteQueryOptions) => {
    return lowStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
lowStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lowStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
lowStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lowStock.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
    const lowStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lowStock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
        lowStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lowStock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryReportController::lowStock
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryReportController.php:12
 * @route '/api/v1/inventory/reports/low-stock'
 */
        lowStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lowStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lowStock.form = lowStockForm
const InventoryReportController = { exportLowStock, lowStock }

export default InventoryReportController