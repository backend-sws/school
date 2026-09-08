import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/issues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:16
 * @route '/api/v1/inventory/issues'
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:86
 * @route '/api/v1/inventory/issues'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/issues',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:86
 * @route '/api/v1/inventory/issues'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:86
 * @route '/api/v1/inventory/issues'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:86
 * @route '/api/v1/inventory/issues'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:86
 * @route '/api/v1/inventory/issues'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
export const show = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/issues/{inventory_issue}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
show.url = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_issue: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_issue: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_issue: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_issue: typeof args.inventory_issue === 'object'
                ? args.inventory_issue.id
                : args.inventory_issue,
                }

    return show.definition.url
            .replace('{inventory_issue}', parsedArgs.inventory_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
show.get = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
show.head = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
    const showForm = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
        showForm.get = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:167
 * @route '/api/v1/inventory/issues/{inventory_issue}'
 */
        showForm.head = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::recordReturn
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:182
 * @route '/api/v1/inventory/issues/{inventory_issue}/return'
 */
export const recordReturn = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordReturn.url(args, options),
    method: 'post',
})

recordReturn.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/issues/{inventory_issue}/return',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::recordReturn
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:182
 * @route '/api/v1/inventory/issues/{inventory_issue}/return'
 */
recordReturn.url = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_issue: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_issue: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_issue: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_issue: typeof args.inventory_issue === 'object'
                ? args.inventory_issue.id
                : args.inventory_issue,
                }

    return recordReturn.definition.url
            .replace('{inventory_issue}', parsedArgs.inventory_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::recordReturn
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:182
 * @route '/api/v1/inventory/issues/{inventory_issue}/return'
 */
recordReturn.post = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordReturn.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::recordReturn
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:182
 * @route '/api/v1/inventory/issues/{inventory_issue}/return'
 */
    const recordReturnForm = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recordReturn.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryIssueController::recordReturn
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryIssueController.php:182
 * @route '/api/v1/inventory/issues/{inventory_issue}/return'
 */
        recordReturnForm.post = (args: { inventory_issue: number | { id: number } } | [inventory_issue: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recordReturn.url(args, options),
            method: 'post',
        })
    
    recordReturn.form = recordReturnForm
const InventoryIssueController = { index, store, show, recordReturn }

export default InventoryIssueController