import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-logs/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:180
 * @route '/api/v1/transport/vehicle-logs/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:13
 * @route '/api/v1/transport/vehicle-logs'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:63
 * @route '/api/v1/transport/vehicle-logs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/vehicle-logs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:63
 * @route '/api/v1/transport/vehicle-logs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:63
 * @route '/api/v1/transport/vehicle-logs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:63
 * @route '/api/v1/transport/vehicle-logs'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:63
 * @route '/api/v1/transport/vehicle-logs'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
export const show = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-logs/{vehicle_log}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
show.url = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_log: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_log: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_log: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_log: typeof args.vehicle_log === 'object'
                ? args.vehicle_log.id
                : args.vehicle_log,
                }

    return show.definition.url
            .replace('{vehicle_log}', parsedArgs.vehicle_log.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
show.get = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
show.head = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
    const showForm = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
        showForm.get = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:111
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
        showForm.head = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
export const update = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/vehicle-logs/{vehicle_log}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
update.url = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_log: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_log: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_log: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_log: typeof args.vehicle_log === 'object'
                ? args.vehicle_log.id
                : args.vehicle_log,
                }

    return update.definition.url
            .replace('{vehicle_log}', parsedArgs.vehicle_log.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
update.put = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
update.patch = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
    const updateForm = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
        updateForm.put = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:122
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
        updateForm.patch = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:169
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
export const destroy = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/vehicle-logs/{vehicle_log}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:169
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
destroy.url = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_log: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_log: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_log: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_log: typeof args.vehicle_log === 'object'
                ? args.vehicle_log.id
                : args.vehicle_log,
                }

    return destroy.definition.url
            .replace('{vehicle_log}', parsedArgs.vehicle_log.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:169
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
destroy.delete = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:169
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
    const destroyForm = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleLogController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleLogController.php:169
 * @route '/api/v1/transport/vehicle-logs/{vehicle_log}'
 */
        destroyForm.delete = (args: { vehicle_log: number | { id: number } } | [vehicle_log: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TransportVehicleLogController = { exportMethod, index, store, show, update, destroy, export: exportMethod }

export default TransportVehicleLogController