import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-expenses/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::exportMethod
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:178
 * @route '/api/v1/transport/vehicle-expenses/export'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-expenses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:14
 * @route '/api/v1/transport/vehicle-expenses'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:60
 * @route '/api/v1/transport/vehicle-expenses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/vehicle-expenses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:60
 * @route '/api/v1/transport/vehicle-expenses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:60
 * @route '/api/v1/transport/vehicle-expenses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:60
 * @route '/api/v1/transport/vehicle-expenses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:60
 * @route '/api/v1/transport/vehicle-expenses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
export const show = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicle-expenses/{vehicle_expense}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
show.url = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_expense: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_expense: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_expense: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_expense: typeof args.vehicle_expense === 'object'
                ? args.vehicle_expense.id
                : args.vehicle_expense,
                }

    return show.definition.url
            .replace('{vehicle_expense}', parsedArgs.vehicle_expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
show.get = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
show.head = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
    const showForm = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
        showForm.get = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:110
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
        showForm.head = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
export const update = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/vehicle-expenses/{vehicle_expense}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
update.url = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_expense: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_expense: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_expense: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_expense: typeof args.vehicle_expense === 'object'
                ? args.vehicle_expense.id
                : args.vehicle_expense,
                }

    return update.definition.url
            .replace('{vehicle_expense}', parsedArgs.vehicle_expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
update.put = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
update.patch = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
    const updateForm = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
        updateForm.put = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:121
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
        updateForm.patch = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:167
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
export const destroy = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/vehicle-expenses/{vehicle_expense}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:167
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
destroy.url = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_expense: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehicle_expense: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehicle_expense: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_expense: typeof args.vehicle_expense === 'object'
                ? args.vehicle_expense.id
                : args.vehicle_expense,
                }

    return destroy.definition.url
            .replace('{vehicle_expense}', parsedArgs.vehicle_expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:167
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
destroy.delete = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:167
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
    const destroyForm = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleExpenseController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleExpenseController.php:167
 * @route '/api/v1/transport/vehicle-expenses/{vehicle_expense}'
 */
        destroyForm.delete = (args: { vehicle_expense: number | { id: number } } | [vehicle_expense: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TransportVehicleExpenseController = { exportMethod, index, store, show, update, destroy, export: exportMethod }

export default TransportVehicleExpenseController