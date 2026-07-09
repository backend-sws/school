import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:20
 * @route '/api/v1/lms/classes'
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:106
 * @route '/api/v1/lms/classes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
export const show = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
show.url = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return show.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
show.get = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
show.head = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
    const showForm = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        showForm.get = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:167
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        showForm.head = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
export const update = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/lms/classes/{lms_class}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
update.url = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return update.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
update.put = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
update.patch = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
    const updateForm = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        updateForm.put = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:190
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        updateForm.patch = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
export const destroy = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/classes/{lms_class}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
destroy.url = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return destroy.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
destroy.delete = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
    const destroyForm = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassController.php:234
 * @route '/api/v1/lms/classes/{lms_class}'
 */
        destroyForm.delete = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const classes = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default classes