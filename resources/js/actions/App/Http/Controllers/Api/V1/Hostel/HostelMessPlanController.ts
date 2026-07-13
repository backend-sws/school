import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/mess-plans/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:64
 * @route '/api/v1/hostel/mess-plans/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/mess-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:12
 * @route '/api/v1/hostel/mess-plans'
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:81
 * @route '/api/v1/hostel/mess-plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hostel/mess-plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:81
 * @route '/api/v1/hostel/mess-plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:81
 * @route '/api/v1/hostel/mess-plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:81
 * @route '/api/v1/hostel/mess-plans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:81
 * @route '/api/v1/hostel/mess-plans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
export const show = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/mess-plans/{hostel_mess_plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
show.url = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_mess_plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_mess_plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_mess_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_mess_plan: typeof args.hostel_mess_plan === 'object'
                ? args.hostel_mess_plan.id
                : args.hostel_mess_plan,
                }

    return show.definition.url
            .replace('{hostel_mess_plan}', parsedArgs.hostel_mess_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
show.get = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
show.head = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
    const showForm = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
        showForm.get = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:104
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
        showForm.head = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
export const update = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/mess-plans/{hostel_mess_plan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
update.url = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_mess_plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_mess_plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_mess_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_mess_plan: typeof args.hostel_mess_plan === 'object'
                ? args.hostel_mess_plan.id
                : args.hostel_mess_plan,
                }

    return update.definition.url
            .replace('{hostel_mess_plan}', parsedArgs.hostel_mess_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
update.put = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
update.patch = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
    const updateForm = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
        updateForm.put = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:113
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
        updateForm.patch = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:133
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
export const destroy = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/mess-plans/{hostel_mess_plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:133
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
destroy.url = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_mess_plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_mess_plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_mess_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_mess_plan: typeof args.hostel_mess_plan === 'object'
                ? args.hostel_mess_plan.id
                : args.hostel_mess_plan,
                }

    return destroy.definition.url
            .replace('{hostel_mess_plan}', parsedArgs.hostel_mess_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:133
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
destroy.delete = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:133
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
    const destroyForm = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelMessPlanController.php:133
 * @route '/api/v1/hostel/mess-plans/{hostel_mess_plan}'
 */
        destroyForm.delete = (args: { hostel_mess_plan: string | number | { id: string | number } } | [hostel_mess_plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const HostelMessPlanController = { exportMethod, index, store, show, update, destroy, export: exportMethod }

export default HostelMessPlanController