import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-fuels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:14
 * @route '/api/v1/transport/vehicle-fuels'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:60
 * @route '/api/v1/transport/vehicle-fuels'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/vehicle-fuels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:60
 * @route '/api/v1/transport/vehicle-fuels'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:60
 * @route '/api/v1/transport/vehicle-fuels'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:60
 * @route '/api/v1/transport/vehicle-fuels'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:60
 * @route '/api/v1/transport/vehicle-fuels'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
export const show = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-fuels/{vehicle_fuel}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
show.url = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_fuel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_fuel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_fuel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_fuel: typeof args.vehicle_fuel === 'object'
                ? args.vehicle_fuel.id
                : args.vehicle_fuel,
                }

    return show.definition.url
            .replace('{vehicle_fuel}', parsedArgs.vehicle_fuel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
show.get = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
show.head = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
    const showForm = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
        showForm.get = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:136
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
        showForm.head = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
export const update = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/vehicle-fuels/{vehicle_fuel}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
update.url = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_fuel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_fuel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_fuel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_fuel: typeof args.vehicle_fuel === 'object'
                ? args.vehicle_fuel.id
                : args.vehicle_fuel,
                }

    return update.definition.url
            .replace('{vehicle_fuel}', parsedArgs.vehicle_fuel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
update.put = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
update.patch = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
    const updateForm = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
        updateForm.put = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:147
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
        updateForm.patch = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:203
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
export const destroy = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/vehicle-fuels/{vehicle_fuel}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:203
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
destroy.url = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_fuel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_fuel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_fuel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_fuel: typeof args.vehicle_fuel === 'object'
                ? args.vehicle_fuel.id
                : args.vehicle_fuel,
                }

    return destroy.definition.url
            .replace('{vehicle_fuel}', parsedArgs.vehicle_fuel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:203
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
destroy.delete = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:203
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
    const destroyForm = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleFuelController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleFuelController.php:203
 * @route '/api/v1/transport/vehicle-fuels/{vehicle_fuel}'
 */
        destroyForm.delete = (args: { vehicle_fuel: number | { id: number } } | [vehicle_fuel: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const vehicleFuels = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default vehicleFuels