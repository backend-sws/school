import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/streams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::index
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:12
 * @route '/api/v1/streams'
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
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:46
 * @route '/api/v1/streams'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/streams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:46
 * @route '/api/v1/streams'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:46
 * @route '/api/v1/streams'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:46
 * @route '/api/v1/streams'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::store
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:46
 * @route '/api/v1/streams'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
export const show = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/streams/{stream}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
show.url = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stream: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    stream: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stream: args.stream,
                }

    return show.definition.url
            .replace('{stream}', parsedArgs.stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
show.get = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
show.head = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
    const showForm = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
        showForm.get = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::show
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:67
 * @route '/api/v1/streams/{stream}'
 */
        showForm.head = (args: { stream: string | number } | [stream: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
export const update = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/streams/{stream}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
update.url = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stream: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stream: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stream: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stream: typeof args.stream === 'object'
                ? args.stream.id
                : args.stream,
                }

    return update.definition.url
            .replace('{stream}', parsedArgs.stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
update.put = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
update.patch = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
    const updateForm = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
        updateForm.put = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::update
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:73
 * @route '/api/v1/streams/{stream}'
 */
        updateForm.patch = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:87
 * @route '/api/v1/streams/{stream}'
 */
export const destroy = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/streams/{stream}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:87
 * @route '/api/v1/streams/{stream}'
 */
destroy.url = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stream: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stream: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stream: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stream: typeof args.stream === 'object'
                ? args.stream.id
                : args.stream,
                }

    return destroy.definition.url
            .replace('{stream}', parsedArgs.stream.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:87
 * @route '/api/v1/streams/{stream}'
 */
destroy.delete = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:87
 * @route '/api/v1/streams/{stream}'
 */
    const destroyForm = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\StreamController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/StreamController.php:87
 * @route '/api/v1/streams/{stream}'
 */
        destroyForm.delete = (args: { stream: number | { id: number } } | [stream: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const streams = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default streams