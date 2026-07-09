import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/leave-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::index
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:12
 * @route '/api/v1/hr/leave-types'
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
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:18
 * @route '/api/v1/hr/leave-types'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hr/leave-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:18
 * @route '/api/v1/hr/leave-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:18
 * @route '/api/v1/hr/leave-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:18
 * @route '/api/v1/hr/leave-types'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::store
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:18
 * @route '/api/v1/hr/leave-types'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
export const show = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/leave-types/{leave_type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
show.url = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    leave_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave_type: args.leave_type,
                }

    return show.definition.url
            .replace('{leave_type}', parsedArgs.leave_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
show.get = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
show.head = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
    const showForm = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
        showForm.get = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::show
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:0
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
        showForm.head = (args: { leave_type: string | number } | [leave_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
export const update = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hr/leave-types/{leave_type}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
update.url = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_type: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave_type: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave_type: typeof args.leave_type === 'object'
                ? args.leave_type.id
                : args.leave_type,
                }

    return update.definition.url
            .replace('{leave_type}', parsedArgs.leave_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
update.put = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
update.patch = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
    const updateForm = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
        updateForm.put = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::update
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:32
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
        updateForm.patch = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::destroy
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:48
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
export const destroy = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hr/leave-types/{leave_type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::destroy
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:48
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
destroy.url = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_type: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave_type: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave_type: typeof args.leave_type === 'object'
                ? args.leave_type.id
                : args.leave_type,
                }

    return destroy.definition.url
            .replace('{leave_type}', parsedArgs.leave_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::destroy
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:48
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
destroy.delete = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::destroy
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:48
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
    const destroyForm = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\LeaveTypeController::destroy
 * @see app/Http/Controllers/Api/V1/HR/LeaveTypeController.php:48
 * @route '/api/v1/hr/leave-types/{leave_type}'
 */
        destroyForm.delete = (args: { leave_type: number | { id: number } } | [leave_type: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LeaveTypeController = { index, store, show, update, destroy }

export default LeaveTypeController