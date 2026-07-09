import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:17
 * @route '/api/v1/transport/assignments'
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:48
 * @route '/api/v1/transport/assignments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/transport/assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:48
 * @route '/api/v1/transport/assignments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:48
 * @route '/api/v1/transport/assignments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:48
 * @route '/api/v1/transport/assignments'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:48
 * @route '/api/v1/transport/assignments'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
export const show = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/assignments/{transport_assignment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
show.url = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_assignment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_assignment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_assignment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_assignment: typeof args.transport_assignment === 'object'
                ? args.transport_assignment.id
                : args.transport_assignment,
                }

    return show.definition.url
            .replace('{transport_assignment}', parsedArgs.transport_assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
show.get = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
show.head = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
    const showForm = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
        showForm.get = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:74
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
        showForm.head = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
export const update = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/transport/assignments/{transport_assignment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
update.url = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_assignment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_assignment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_assignment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_assignment: typeof args.transport_assignment === 'object'
                ? args.transport_assignment.id
                : args.transport_assignment,
                }

    return update.definition.url
            .replace('{transport_assignment}', parsedArgs.transport_assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
update.put = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
update.patch = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
    const updateForm = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
        updateForm.put = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:85
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
        updateForm.patch = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:109
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
export const destroy = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/transport/assignments/{transport_assignment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:109
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
destroy.url = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transport_assignment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transport_assignment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transport_assignment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transport_assignment: typeof args.transport_assignment === 'object'
                ? args.transport_assignment.id
                : args.transport_assignment,
                }

    return destroy.definition.url
            .replace('{transport_assignment}', parsedArgs.transport_assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:109
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
destroy.delete = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:109
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
    const destroyForm = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Transport/TransportAssignmentController.php:109
 * @route '/api/v1/transport/assignments/{transport_assignment}'
 */
        destroyForm.delete = (args: { transport_assignment: string | number | { id: string | number } } | [transport_assignment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TransportAssignmentController = { index, store, show, update, destroy }

export default TransportAssignmentController