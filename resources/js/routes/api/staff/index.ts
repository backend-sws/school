import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::index
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:17
 * @route '/api/v1/staff'
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
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::store
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:23
 * @route '/api/v1/staff'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/staff',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::store
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:23
 * @route '/api/v1/staff'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::store
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:23
 * @route '/api/v1/staff'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::store
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:23
 * @route '/api/v1/staff'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::store
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:23
 * @route '/api/v1/staff'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
export const show = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/staff/{staff}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
show.url = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staff: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    staff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staff: args.staff,
                }

    return show.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
show.get = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
show.head = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
    const showForm = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
        showForm.get = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::show
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:45
 * @route '/api/v1/staff/{staff}'
 */
        showForm.head = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
export const update = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/staff/{staff}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
update.url = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staff: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    staff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staff: args.staff,
                }

    return update.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
update.put = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
update.patch = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
    const updateForm = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
        updateForm.put = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::update
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:51
 * @route '/api/v1/staff/{staff}'
 */
        updateForm.patch = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::destroy
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:76
 * @route '/api/v1/staff/{staff}'
 */
export const destroy = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/staff/{staff}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::destroy
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:76
 * @route '/api/v1/staff/{staff}'
 */
destroy.url = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staff: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    staff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staff: args.staff,
                }

    return destroy.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::destroy
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:76
 * @route '/api/v1/staff/{staff}'
 */
destroy.delete = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::destroy
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:76
 * @route '/api/v1/staff/{staff}'
 */
    const destroyForm = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Staff\StaffController::destroy
 * @see app/Http/Controllers/Api/V1/Staff/StaffController.php:76
 * @route '/api/v1/staff/{staff}'
 */
        destroyForm.delete = (args: { staff: string | number } | [staff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const staff = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default staff