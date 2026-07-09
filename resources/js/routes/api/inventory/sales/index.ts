import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
export const receipt = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/sales/{inventory_sale}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
receipt.url = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_sale: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_sale: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_sale: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_sale: typeof args.inventory_sale === 'object'
                ? args.inventory_sale.id
                : args.inventory_sale,
                }

    return receipt.definition.url
            .replace('{inventory_sale}', parsedArgs.inventory_sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
receipt.get = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
receipt.head = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
    const receiptForm = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: receipt.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
        receiptForm.get = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipt.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::receipt
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:161
 * @route '/api/v1/inventory/sales/{inventory_sale}/receipt'
 */
        receiptForm.head = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipt.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    receipt.form = receiptForm
const sales = {
    receipt: Object.assign(receipt, receipt),
}

export default sales