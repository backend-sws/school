import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payroll-components',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:11
 * @route '/api/v1/hr/payroll-components'
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
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::store
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:18
 * @route '/api/v1/hr/payroll-components'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/hr/payroll-components',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::store
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:18
 * @route '/api/v1/hr/payroll-components'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::store
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:18
 * @route '/api/v1/hr/payroll-components'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::store
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:18
 * @route '/api/v1/hr/payroll-components'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::store
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:18
 * @route '/api/v1/hr/payroll-components'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
export const show = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payroll-components/{payroll_component}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
show.url = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_component: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_component: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_component: args.payroll_component,
                }

    return show.definition.url
            .replace('{payroll_component}', parsedArgs.payroll_component.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
show.get = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
show.head = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
    const showForm = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
        showForm.get = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::show
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:0
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
        showForm.head = (args: { payroll_component: string | number } | [payroll_component: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
export const update = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/hr/payroll-components/{payroll_component}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
update.url = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_component: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll_component: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll_component: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_component: typeof args.payroll_component === 'object'
                ? args.payroll_component.id
                : args.payroll_component,
                }

    return update.definition.url
            .replace('{payroll_component}', parsedArgs.payroll_component.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
update.put = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
update.patch = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
    const updateForm = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
        updateForm.put = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::update
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:36
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
        updateForm.patch = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:57
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
export const destroy = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hr/payroll-components/{payroll_component}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:57
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
destroy.url = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_component: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll_component: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll_component: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_component: typeof args.payroll_component === 'object'
                ? args.payroll_component.id
                : args.payroll_component,
                }

    return destroy.definition.url
            .replace('{payroll_component}', parsedArgs.payroll_component.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:57
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
destroy.delete = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:57
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
    const destroyForm = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollComponentController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollComponentController.php:57
 * @route '/api/v1/hr/payroll-components/{payroll_component}'
 */
        destroyForm.delete = (args: { payroll_component: number | { id: number } } | [payroll_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PayrollComponentController = { index, store, show, update, destroy }

export default PayrollComponentController