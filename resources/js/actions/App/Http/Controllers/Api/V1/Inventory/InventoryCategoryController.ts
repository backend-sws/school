import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::index
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:12
 * @route '/api/v1/inventory/categories'
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:34
 * @route '/api/v1/inventory/categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/inventory/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:34
 * @route '/api/v1/inventory/categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:34
 * @route '/api/v1/inventory/categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:34
 * @route '/api/v1/inventory/categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::store
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:34
 * @route '/api/v1/inventory/categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
export const show = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/inventory/categories/{inventory_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
show.url = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_category: typeof args.inventory_category === 'object'
                ? args.inventory_category.id
                : args.inventory_category,
                }

    return show.definition.url
            .replace('{inventory_category}', parsedArgs.inventory_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
show.get = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
show.head = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
    const showForm = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
        showForm.get = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::show
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:50
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
        showForm.head = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
export const update = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/inventory/categories/{inventory_category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
update.url = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_category: typeof args.inventory_category === 'object'
                ? args.inventory_category.id
                : args.inventory_category,
                }

    return update.definition.url
            .replace('{inventory_category}', parsedArgs.inventory_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
update.put = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
update.patch = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
    const updateForm = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
        updateForm.put = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::update
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:59
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
        updateForm.patch = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:75
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
export const destroy = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/inventory/categories/{inventory_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:75
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
destroy.url = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inventory_category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inventory_category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inventory_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inventory_category: typeof args.inventory_category === 'object'
                ? args.inventory_category.id
                : args.inventory_category,
                }

    return destroy.definition.url
            .replace('{inventory_category}', parsedArgs.inventory_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:75
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
destroy.delete = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:75
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
    const destroyForm = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Inventory/InventoryCategoryController.php:75
 * @route '/api/v1/inventory/categories/{inventory_category}'
 */
        destroyForm.delete = (args: { inventory_category: number | { id: number } } | [inventory_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const InventoryCategoryController = { index, store, show, update, destroy }

export default InventoryCategoryController