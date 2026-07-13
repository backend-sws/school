import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/allocations/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::exportMethod
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:110
 * @route '/api/v1/hostel/allocations/export'
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/allocations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::index
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:15
 * @route '/api/v1/hostel/allocations'
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:127
 * @route '/api/v1/hostel/allocations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hostel/allocations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:127
 * @route '/api/v1/hostel/allocations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:127
 * @route '/api/v1/hostel/allocations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:127
 * @route '/api/v1/hostel/allocations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::store
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:127
 * @route '/api/v1/hostel/allocations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
export const show = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/allocations/{hostel_allocation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
show.url = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_allocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_allocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_allocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_allocation: typeof args.hostel_allocation === 'object'
                ? args.hostel_allocation.id
                : args.hostel_allocation,
                }

    return show.definition.url
            .replace('{hostel_allocation}', parsedArgs.hostel_allocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
show.get = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
show.head = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
    const showForm = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
        showForm.get = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::show
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:208
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
        showForm.head = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
export const update = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hostel/allocations/{hostel_allocation}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
update.url = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_allocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_allocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_allocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_allocation: typeof args.hostel_allocation === 'object'
                ? args.hostel_allocation.id
                : args.hostel_allocation,
                }

    return update.definition.url
            .replace('{hostel_allocation}', parsedArgs.hostel_allocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
update.put = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
update.patch = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
    const updateForm = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
        updateForm.put = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::update
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:224
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
        updateForm.patch = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:257
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
export const destroy = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hostel/allocations/{hostel_allocation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:257
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
destroy.url = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostel_allocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostel_allocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostel_allocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostel_allocation: typeof args.hostel_allocation === 'object'
                ? args.hostel_allocation.id
                : args.hostel_allocation,
                }

    return destroy.definition.url
            .replace('{hostel_allocation}', parsedArgs.hostel_allocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:257
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
destroy.delete = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:257
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
    const destroyForm = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelAllocationController.php:257
 * @route '/api/v1/hostel/allocations/{hostel_allocation}'
 */
        destroyForm.delete = (args: { hostel_allocation: string | number | { id: string | number } } | [hostel_allocation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const HostelAllocationController = { exportMethod, index, store, show, update, destroy, export: exportMethod }

export default HostelAllocationController