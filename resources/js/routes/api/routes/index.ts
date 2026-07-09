import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/routes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:14
 * @route '/api/v1/transport/routes'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:40
 * @route '/api/v1/transport/routes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/routes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:40
 * @route '/api/v1/transport/routes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:40
 * @route '/api/v1/transport/routes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:40
 * @route '/api/v1/transport/routes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:40
 * @route '/api/v1/transport/routes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
export const show = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/routes/{transport_route}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
show.url = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_route: typeof args.transport_route === 'object'
                ? args.transport_route.id
                : args.transport_route,
                }

    return show.definition.url
            .replace('{transport_route}', parsedArgs.transport_route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
show.get = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
show.head = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
    const showForm = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
        showForm.get = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:64
 * @route '/api/v1/transport/routes/{transport_route}'
 */
        showForm.head = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
export const update = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/routes/{transport_route}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
update.url = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_route: typeof args.transport_route === 'object'
                ? args.transport_route.id
                : args.transport_route,
                }

    return update.definition.url
            .replace('{transport_route}', parsedArgs.transport_route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
update.put = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
update.patch = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
    const updateForm = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
        updateForm.put = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:75
 * @route '/api/v1/transport/routes/{transport_route}'
 */
        updateForm.patch = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:101
 * @route '/api/v1/transport/routes/{transport_route}'
 */
export const destroy = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/routes/{transport_route}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:101
 * @route '/api/v1/transport/routes/{transport_route}'
 */
destroy.url = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_route: typeof args.transport_route === 'object'
                ? args.transport_route.id
                : args.transport_route,
                }

    return destroy.definition.url
            .replace('{transport_route}', parsedArgs.transport_route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:101
 * @route '/api/v1/transport/routes/{transport_route}'
 */
destroy.delete = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:101
 * @route '/api/v1/transport/routes/{transport_route}'
 */
    const destroyForm = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportRouteController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportRouteController.php:101
 * @route '/api/v1/transport/routes/{transport_route}'
 */
        destroyForm.delete = (args: { transport_route: string | number | { id: string | number } } | [transport_route: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const routes = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default routes