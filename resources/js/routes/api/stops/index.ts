import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/stops',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:13
 * @route '/api/v1/transport/stops'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:46
 * @route '/api/v1/transport/stops'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/stops',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:46
 * @route '/api/v1/transport/stops'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:46
 * @route '/api/v1/transport/stops'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:46
 * @route '/api/v1/transport/stops'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:46
 * @route '/api/v1/transport/stops'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
export const show = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/stops/{transport_stop}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
show.url = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_stop: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_stop: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_stop: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_stop: typeof args.transport_stop === 'object'
                ? args.transport_stop.id
                : args.transport_stop,
                }

    return show.definition.url
            .replace('{transport_stop}', parsedArgs.transport_stop.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
show.get = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
show.head = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
    const showForm = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
        showForm.get = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:78
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
        showForm.head = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
export const update = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/stops/{transport_stop}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
update.url = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_stop: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_stop: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_stop: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_stop: typeof args.transport_stop === 'object'
                ? args.transport_stop.id
                : args.transport_stop,
                }

    return update.definition.url
            .replace('{transport_stop}', parsedArgs.transport_stop.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
update.put = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
update.patch = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
    const updateForm = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
        updateForm.put = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:87
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
        updateForm.patch = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:116
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
export const destroy = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/stops/{transport_stop}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:116
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
destroy.url = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_stop: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_stop: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_stop: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_stop: typeof args.transport_stop === 'object'
                ? args.transport_stop.id
                : args.transport_stop,
                }

    return destroy.definition.url
            .replace('{transport_stop}', parsedArgs.transport_stop.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:116
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
destroy.delete = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:116
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
    const destroyForm = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportStopController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportStopController.php:116
 * @route '/api/v1/transport/stops/{transport_stop}'
 */
        destroyForm.delete = (args: { transport_stop: number | { id: number } } | [transport_stop: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const stops = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default stops