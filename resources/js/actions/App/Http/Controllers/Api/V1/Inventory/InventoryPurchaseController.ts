import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/purchases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:20
 * @route '/api/v1/inventory/purchases'
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:82
 * @route '/api/v1/inventory/purchases'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/purchases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:82
 * @route '/api/v1/inventory/purchases'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:82
 * @route '/api/v1/inventory/purchases'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:82
 * @route '/api/v1/inventory/purchases'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:82
 * @route '/api/v1/inventory/purchases'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
export const show = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/purchases/{inventory_purchase}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
show.url = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_purchase: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_purchase: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_purchase: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_purchase: typeof args.inventory_purchase === 'object'
                ? args.inventory_purchase.id
                : args.inventory_purchase,
                }

    return show.definition.url
            .replace('{inventory_purchase}', parsedArgs.inventory_purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
show.get = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
show.head = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
    const showForm = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
        showForm.get = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:216
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
        showForm.head = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:228
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
export const update = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/inventory/purchases/{inventory_purchase}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:228
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
update.url = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_purchase: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_purchase: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_purchase: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_purchase: typeof args.inventory_purchase === 'object'
                ? args.inventory_purchase.id
                : args.inventory_purchase,
                }

    return update.definition.url
            .replace('{inventory_purchase}', parsedArgs.inventory_purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:228
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
update.put = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:228
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
    const updateForm = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryPurchaseController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryPurchaseController.php:228
 * @route '/api/v1/inventory/purchases/{inventory_purchase}'
 */
        updateForm.put = (args: { inventory_purchase: number | { id: number } } | [inventory_purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const InventoryPurchaseController = { index, store, show, update }

export default InventoryPurchaseController