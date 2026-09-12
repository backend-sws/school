import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
export const lookup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lookup.url(options),
    method: 'get',
})

lookup.definition = {
    methods: ["get","head"],
    url: '/api/v1/gate-security/passes/lookup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
lookup.url = (options?: RouteQueryOptions) => {
    return lookup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
lookup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lookup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
lookup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lookup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
    const lookupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lookup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
        lookupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lookup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::lookup
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:253
 * @route '/api/v1/gate-security/passes/lookup'
 */
        lookupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lookup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lookup.form = lookupForm
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/api/v1/gate-security/passes/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
    const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
        analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::analytics
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:290
 * @route '/api/v1/gate-security/passes/analytics'
 */
        analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/gate-security/passes/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::exportMethod
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:334
 * @route '/api/v1/gate-security/passes/export'
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
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::checkout
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:216
 * @route '/api/v1/gate-security/passes/{id}/checkout'
 */
export const checkout = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/api/v1/gate-security/passes/{id}/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::checkout
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:216
 * @route '/api/v1/gate-security/passes/{id}/checkout'
 */
checkout.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return checkout.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::checkout
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:216
 * @route '/api/v1/gate-security/passes/{id}/checkout'
 */
checkout.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::checkout
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:216
 * @route '/api/v1/gate-security/passes/{id}/checkout'
 */
    const checkoutForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::checkout
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:216
 * @route '/api/v1/gate-security/passes/{id}/checkout'
 */
        checkoutForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(args, options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/gate-security/passes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::index
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:16
 * @route '/api/v1/gate-security/passes'
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
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::store
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:86
 * @route '/api/v1/gate-security/passes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/gate-security/passes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::store
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:86
 * @route '/api/v1/gate-security/passes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::store
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:86
 * @route '/api/v1/gate-security/passes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::store
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:86
 * @route '/api/v1/gate-security/passes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::store
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:86
 * @route '/api/v1/gate-security/passes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
export const show = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/gate-security/passes/{gate_pass}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
show.url = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gate_pass: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gate_pass: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gate_pass: args.gate_pass,
                }

    return show.definition.url
            .replace('{gate_pass}', parsedArgs.gate_pass.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
show.get = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
show.head = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
    const showForm = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
        showForm.get = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::show
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:143
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
        showForm.head = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
export const update = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/gate-security/passes/{gate_pass}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
update.url = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gate_pass: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gate_pass: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gate_pass: args.gate_pass,
                }

    return update.definition.url
            .replace('{gate_pass}', parsedArgs.gate_pass.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
update.put = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
update.patch = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
    const updateForm = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
        updateForm.put = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::update
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:160
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
        updateForm.patch = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::destroy
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:238
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
export const destroy = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/gate-security/passes/{gate_pass}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::destroy
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:238
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
destroy.url = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gate_pass: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gate_pass: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gate_pass: args.gate_pass,
                }

    return destroy.definition.url
            .replace('{gate_pass}', parsedArgs.gate_pass.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::destroy
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:238
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
destroy.delete = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::destroy
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:238
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
    const destroyForm = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GateSecurity\GatePassController::destroy
 * @see app/Http/Controllers/Api/V1/GateSecurity/GatePassController.php:238
 * @route '/api/v1/gate-security/passes/{gate_pass}'
 */
        destroyForm.delete = (args: { gate_pass: string | number } | [gate_pass: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GatePassController = { lookup, analytics, exportMethod, checkout, index, store, show, update, destroy, export: exportMethod }

export default GatePassController