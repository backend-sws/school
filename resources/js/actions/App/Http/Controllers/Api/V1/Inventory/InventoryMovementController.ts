import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/movements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:17
 * @route '/api/v1/inventory/movements'
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:47
 * @route '/api/v1/inventory/movements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/movements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:47
 * @route '/api/v1/inventory/movements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:47
 * @route '/api/v1/inventory/movements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:47
 * @route '/api/v1/inventory/movements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:47
 * @route '/api/v1/inventory/movements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
export const show = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/movements/{inventory_movement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
show.url = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_movement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_movement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_movement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_movement: typeof args.inventory_movement === 'object'
                ? args.inventory_movement.id
                : args.inventory_movement,
                }

    return show.definition.url
            .replace('{inventory_movement}', parsedArgs.inventory_movement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
show.get = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
show.head = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
    const showForm = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
        showForm.get = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:101
 * @route '/api/v1/inventory/movements/{inventory_movement}'
 */
        showForm.head = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::revert
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:110
 * @route '/api/v1/inventory/movements/{inventory_movement}/revert'
 */
export const revert = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revert.url(args, options),
    method: 'post',
})

revert.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/movements/{inventory_movement}/revert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::revert
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:110
 * @route '/api/v1/inventory/movements/{inventory_movement}/revert'
 */
revert.url = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_movement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_movement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_movement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_movement: typeof args.inventory_movement === 'object'
                ? args.inventory_movement.id
                : args.inventory_movement,
                }

    return revert.definition.url
            .replace('{inventory_movement}', parsedArgs.inventory_movement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::revert
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:110
 * @route '/api/v1/inventory/movements/{inventory_movement}/revert'
 */
revert.post = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revert.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::revert
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:110
 * @route '/api/v1/inventory/movements/{inventory_movement}/revert'
 */
    const revertForm = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revert.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::revert
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryMovementController.php:110
 * @route '/api/v1/inventory/movements/{inventory_movement}/revert'
 */
        revertForm.post = (args: { inventory_movement: number | { id: number } } | [inventory_movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revert.url(args, options),
            method: 'post',
        })
    
    revert.form = revertForm
const InventoryMovementController = { index, store, show, revert }

export default InventoryMovementController