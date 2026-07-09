import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:12
 * @route '/api/v1/inventory/items'
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
 * @route '/api/v1/inventory/items'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
 * @route '/api/v1/inventory/items'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
 * @route '/api/v1/inventory/items'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
 * @route '/api/v1/inventory/items'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:89
 * @route '/api/v1/inventory/items'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
export const show = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/items/{inventory_item}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
show.url = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_item: typeof args.inventory_item === 'object'
                ? args.inventory_item.id
                : args.inventory_item,
                }

    return show.definition.url
            .replace('{inventory_item}', parsedArgs.inventory_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
show.get = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
show.head = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
    const showForm = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
        showForm.get = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:122
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
        showForm.head = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
export const update = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/inventory/items/{inventory_item}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
update.url = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_item: typeof args.inventory_item === 'object'
                ? args.inventory_item.id
                : args.inventory_item,
                }

    return update.definition.url
            .replace('{inventory_item}', parsedArgs.inventory_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
update.put = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
update.patch = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
    const updateForm = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
        updateForm.put = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:131
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
        updateForm.patch = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
export const destroy = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/inventory/items/{inventory_item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
destroy.url = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_item: typeof args.inventory_item === 'object'
                ? args.inventory_item.id
                : args.inventory_item,
                }

    return destroy.definition.url
            .replace('{inventory_item}', parsedArgs.inventory_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
destroy.delete = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
    const destroyForm = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryItemController.php:158
 * @route '/api/v1/inventory/items/{inventory_item}'
 */
        destroyForm.delete = (args: { inventory_item: number | { id: number } } | [inventory_item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const items = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default items