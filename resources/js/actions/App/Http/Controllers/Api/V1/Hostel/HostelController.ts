import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/hostels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:13
 * @route '/api/v1/hostel/hostels'
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:80
 * @route '/api/v1/hostel/hostels'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hostel/hostels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:80
 * @route '/api/v1/hostel/hostels'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:80
 * @route '/api/v1/hostel/hostels'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:80
 * @route '/api/v1/hostel/hostels'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:80
 * @route '/api/v1/hostel/hostels'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
export const show = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/hostels/{hostel}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
show.url = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel: typeof args.hostel === 'object'
                ? args.hostel.id
                : args.hostel,
                }

    return show.definition.url
            .replace('{hostel}', parsedArgs.hostel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
show.get = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
show.head = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
    const showForm = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
        showForm.get = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:111
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
        showForm.head = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
export const update = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/hostels/{hostel}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
update.url = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel: typeof args.hostel === 'object'
                ? args.hostel.id
                : args.hostel,
                }

    return update.definition.url
            .replace('{hostel}', parsedArgs.hostel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
update.put = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
update.patch = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
    const updateForm = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
        updateForm.put = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:125
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
        updateForm.patch = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:157
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
export const destroy = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/hostels/{hostel}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:157
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
destroy.url = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel: typeof args.hostel === 'object'
                ? args.hostel.id
                : args.hostel,
                }

    return destroy.definition.url
            .replace('{hostel}', parsedArgs.hostel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:157
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
destroy.delete = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:157
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
    const destroyForm = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelController.php:157
 * @route '/api/v1/hostel/hostels/{hostel}'
 */
        destroyForm.delete = (args: { hostel: string | number | { id: string | number } } | [hostel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const HostelController = { index, store, show, update, destroy }

export default HostelController