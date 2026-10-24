import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:12
 * @route '/api/v1/inventory/locations'
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:34
 * @route '/api/v1/inventory/locations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:34
 * @route '/api/v1/inventory/locations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:34
 * @route '/api/v1/inventory/locations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:34
 * @route '/api/v1/inventory/locations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:34
 * @route '/api/v1/inventory/locations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
export const show = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/locations/{inventory_location}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
show.url = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_location: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_location: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_location: typeof args.inventory_location === 'object'
                ? args.inventory_location.id
                : args.inventory_location,
                }

    return show.definition.url
            .replace('{inventory_location}', parsedArgs.inventory_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
show.get = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
show.head = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
    const showForm = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
        showForm.get = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:49
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
        showForm.head = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
export const update = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/inventory/locations/{inventory_location}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
update.url = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_location: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_location: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_location: typeof args.inventory_location === 'object'
                ? args.inventory_location.id
                : args.inventory_location,
                }

    return update.definition.url
            .replace('{inventory_location}', parsedArgs.inventory_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
update.put = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
update.patch = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
    const updateForm = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
        updateForm.put = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:58
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
        updateForm.patch = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:73
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
export const destroy = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/inventory/locations/{inventory_location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:73
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
destroy.url = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_location: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_location: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_location: typeof args.inventory_location === 'object'
                ? args.inventory_location.id
                : args.inventory_location,
                }

    return destroy.definition.url
            .replace('{inventory_location}', parsedArgs.inventory_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:73
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
destroy.delete = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:73
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
    const destroyForm = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryLocationController.php:73
 * @route '/api/v1/inventory/locations/{inventory_location}'
 */
        destroyForm.delete = (args: { inventory_location: number | { id: number } } | [inventory_location: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const InventoryLocationController = { index, store, show, update, destroy }

export default InventoryLocationController