import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/sales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:25
 * @route '/api/v1/inventory/sales'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:59
 * @route '/api/v1/inventory/sales'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/sales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:59
 * @route '/api/v1/inventory/sales'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:59
 * @route '/api/v1/inventory/sales'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:59
 * @route '/api/v1/inventory/sales'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:59
 * @route '/api/v1/inventory/sales'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
export const show = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/sales/{inventory_sale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
show.url = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{inventory_sale}', parsedArgs.inventory_sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
show.get = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
show.head = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
    const showForm = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
        showForm.get = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:101
 * @route '/api/v1/inventory/sales/{inventory_sale}'
 */
        showForm.head = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
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
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::confirm
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:112
 * @route '/api/v1/inventory/sales/{inventory_sale}/confirm'
 */
export const confirm = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/sales/{inventory_sale}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::confirm
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:112
 * @route '/api/v1/inventory/sales/{inventory_sale}/confirm'
 */
confirm.url = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return confirm.definition.url
            .replace('{inventory_sale}', parsedArgs.inventory_sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::confirm
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:112
 * @route '/api/v1/inventory/sales/{inventory_sale}/confirm'
 */
confirm.post = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::confirm
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:112
 * @route '/api/v1/inventory/sales/{inventory_sale}/confirm'
 */
    const confirmForm = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventorySaleController::confirm
 * @see app/Http/Controllers/Api/V1/Inventory/InventorySaleController.php:112
 * @route '/api/v1/inventory/sales/{inventory_sale}/confirm'
 */
        confirmForm.post = (args: { inventory_sale: string | number | { id: string | number } } | [inventory_sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(args, options),
            method: 'post',
        })
    
    confirm.form = confirmForm
const InventorySaleController = { index, store, show, receipt, confirm }

export default InventorySaleController