import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/timetables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::index
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:23
 * @route '/api/v1/timetable/timetables'
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
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
 * @route '/api/v1/timetable/timetables'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/timetable/timetables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
 * @route '/api/v1/timetable/timetables'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
 * @route '/api/v1/timetable/timetables'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
 * @route '/api/v1/timetable/timetables'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::store
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:39
 * @route '/api/v1/timetable/timetables'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
export const show = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/timetable/timetables/{timetable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
show.url = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { timetable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    timetable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timetable: typeof args.timetable === 'object'
                ? args.timetable.id
                : args.timetable,
                }

    return show.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
show.get = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
show.head = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
    const showForm = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
        showForm.get = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::show
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:54
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
        showForm.head = (args: { timetable: number | { id: number } } | [timetable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
export const update = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/timetable/timetables/{timetable}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
update.url = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timetable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timetable: args.timetable,
                }

    return update.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
update.put = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
update.patch = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
    const updateForm = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
        updateForm.put = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::update
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
        updateForm.patch = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
export const destroy = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/timetable/timetables/{timetable}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
destroy.url = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timetable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timetable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timetable: args.timetable,
                }

    return destroy.definition.url
            .replace('{timetable}', parsedArgs.timetable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
destroy.delete = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
    const destroyForm = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Timetable\TimetableController::destroy
 * @see app/Http/Controllers/Api/V1/Timetable/TimetableController.php:0
 * @route '/api/v1/timetable/timetables/{timetable}'
 */
        destroyForm.delete = (args: { timetable: string | number } | [timetable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const timetables = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default timetables