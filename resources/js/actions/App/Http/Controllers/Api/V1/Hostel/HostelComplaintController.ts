import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/complaints',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:12
 * @route '/api/v1/hostel/complaints'
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:55
 * @route '/api/v1/hostel/complaints'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hostel/complaints',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:55
 * @route '/api/v1/hostel/complaints'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:55
 * @route '/api/v1/hostel/complaints'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:55
 * @route '/api/v1/hostel/complaints'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:55
 * @route '/api/v1/hostel/complaints'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
export const show = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/complaints/{hostel_complaint}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
show.url = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_complaint: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_complaint: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_complaint: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_complaint: typeof args.hostel_complaint === 'object'
                ? args.hostel_complaint.id
                : args.hostel_complaint,
                }

    return show.definition.url
            .replace('{hostel_complaint}', parsedArgs.hostel_complaint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
show.get = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
show.head = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
    const showForm = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
        showForm.get = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:85
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
        showForm.head = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
export const update = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/complaints/{hostel_complaint}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
update.url = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_complaint: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_complaint: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_complaint: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_complaint: typeof args.hostel_complaint === 'object'
                ? args.hostel_complaint.id
                : args.hostel_complaint,
                }

    return update.definition.url
            .replace('{hostel_complaint}', parsedArgs.hostel_complaint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
update.put = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
update.patch = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
    const updateForm = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
        updateForm.put = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:100
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
        updateForm.patch = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:121
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
export const destroy = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/complaints/{hostel_complaint}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:121
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
destroy.url = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_complaint: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_complaint: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_complaint: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_complaint: typeof args.hostel_complaint === 'object'
                ? args.hostel_complaint.id
                : args.hostel_complaint,
                }

    return destroy.definition.url
            .replace('{hostel_complaint}', parsedArgs.hostel_complaint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:121
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
destroy.delete = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:121
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
    const destroyForm = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelComplaintController.php:121
 * @route '/api/v1/hostel/complaints/{hostel_complaint}'
 */
        destroyForm.delete = (args: { hostel_complaint: string | number | { id: string | number } } | [hostel_complaint: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const HostelComplaintController = { index, store, show, update, destroy }

export default HostelComplaintController