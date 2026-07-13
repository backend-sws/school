import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/drivers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:13
 * @route '/api/v1/transport/drivers'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
 * @route '/api/v1/transport/drivers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/drivers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
 * @route '/api/v1/transport/drivers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
 * @route '/api/v1/transport/drivers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
 * @route '/api/v1/transport/drivers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:41
 * @route '/api/v1/transport/drivers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
export const show = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/drivers/{transport_driver}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
show.url = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_driver: typeof args.transport_driver === 'object'
                ? args.transport_driver.id
                : args.transport_driver,
                }

    return show.definition.url
            .replace('{transport_driver}', parsedArgs.transport_driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
show.get = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
show.head = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
    const showForm = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
        showForm.get = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:67
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
        showForm.head = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
export const update = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/drivers/{transport_driver}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
update.url = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_driver: typeof args.transport_driver === 'object'
                ? args.transport_driver.id
                : args.transport_driver,
                }

    return update.definition.url
            .replace('{transport_driver}', parsedArgs.transport_driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
update.put = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
update.patch = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
    const updateForm = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
        updateForm.put = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:78
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
        updateForm.patch = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
export const destroy = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/drivers/{transport_driver}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
destroy.url = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_driver: typeof args.transport_driver === 'object'
                ? args.transport_driver.id
                : args.transport_driver,
                }

    return destroy.definition.url
            .replace('{transport_driver}', parsedArgs.transport_driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
destroy.delete = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
    const destroyForm = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportDriverController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportDriverController.php:99
 * @route '/api/v1/transport/drivers/{transport_driver}'
 */
        destroyForm.delete = (args: { transport_driver: string | number | { id: string | number } } | [transport_driver: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TransportDriverController = { index, store, show, update, destroy }

export default TransportDriverController