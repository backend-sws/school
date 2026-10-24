import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/fuel-vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:19
 * @route '/api/v1/transport/fuel-vendors'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:63
 * @route '/api/v1/transport/fuel-vendors'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/fuel-vendors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:63
 * @route '/api/v1/transport/fuel-vendors'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:63
 * @route '/api/v1/transport/fuel-vendors'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:63
 * @route '/api/v1/transport/fuel-vendors'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:63
 * @route '/api/v1/transport/fuel-vendors'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
export const show = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/fuel-vendors/{fuel_vendor}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
show.url = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fuel_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { fuel_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    fuel_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fuel_vendor: typeof args.fuel_vendor === 'object'
                ? args.fuel_vendor.id
                : args.fuel_vendor,
                }

    return show.definition.url
            .replace('{fuel_vendor}', parsedArgs.fuel_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
show.get = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
show.head = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
    const showForm = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
        showForm.get = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:95
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
        showForm.head = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
export const update = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/fuel-vendors/{fuel_vendor}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
update.url = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fuel_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { fuel_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    fuel_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fuel_vendor: typeof args.fuel_vendor === 'object'
                ? args.fuel_vendor.id
                : args.fuel_vendor,
                }

    return update.definition.url
            .replace('{fuel_vendor}', parsedArgs.fuel_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
update.put = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
update.patch = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
    const updateForm = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
        updateForm.put = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:109
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
        updateForm.patch = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:136
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
export const destroy = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/fuel-vendors/{fuel_vendor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:136
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
destroy.url = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fuel_vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { fuel_vendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    fuel_vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fuel_vendor: typeof args.fuel_vendor === 'object'
                ? args.fuel_vendor.id
                : args.fuel_vendor,
                }

    return destroy.definition.url
            .replace('{fuel_vendor}', parsedArgs.fuel_vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:136
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
destroy.delete = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:136
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
    const destroyForm = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportFuelVendorController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportFuelVendorController.php:136
 * @route '/api/v1/transport/fuel-vendors/{fuel_vendor}'
 */
        destroyForm.delete = (args: { fuel_vendor: number | { id: number } } | [fuel_vendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const fuelVendors = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default fuelVendors