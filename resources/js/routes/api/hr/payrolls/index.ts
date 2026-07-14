import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payrolls',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::index
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:23
 * @route '/api/v1/hr/payrolls'
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
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:142
 * @route '/api/v1/hr/payrolls/{payroll}'
 */
export const destroy = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/hr/payrolls/{payroll}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:142
 * @route '/api/v1/hr/payrolls/{payroll}'
 */
destroy.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return destroy.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:142
 * @route '/api/v1/hr/payrolls/{payroll}'
 */
destroy.delete = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:142
 * @route '/api/v1/hr/payrolls/{payroll}'
 */
    const destroyForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::destroy
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:142
 * @route '/api/v1/hr/payrolls/{payroll}'
 */
        destroyForm.delete = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::generate
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:32
 * @route '/api/v1/hr/payrolls/generate'
 */
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/api/v1/hr/payrolls/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::generate
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:32
 * @route '/api/v1/hr/payrolls/generate'
 */
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::generate
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:32
 * @route '/api/v1/hr/payrolls/generate'
 */
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::generate
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:32
 * @route '/api/v1/hr/payrolls/generate'
 */
    const generateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::generate
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:32
 * @route '/api/v1/hr/payrolls/generate'
 */
        generateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generate.url(options),
            method: 'post',
        })
    
    generate.form = generateForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::markPaid
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:51
 * @route '/api/v1/hr/payrolls/{payroll}/mark-paid'
 */
export const markPaid = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markPaid.url(args, options),
    method: 'post',
})

markPaid.definition = {
    methods: ["post"],
    url: '/api/v1/hr/payrolls/{payroll}/mark-paid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::markPaid
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:51
 * @route '/api/v1/hr/payrolls/{payroll}/mark-paid'
 */
markPaid.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return markPaid.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::markPaid
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:51
 * @route '/api/v1/hr/payrolls/{payroll}/mark-paid'
 */
markPaid.post = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markPaid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::markPaid
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:51
 * @route '/api/v1/hr/payrolls/{payroll}/mark-paid'
 */
    const markPaidForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markPaid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::markPaid
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:51
 * @route '/api/v1/hr/payrolls/{payroll}/mark-paid'
 */
        markPaidForm.post = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markPaid.url(args, options),
            method: 'post',
        })
    
    markPaid.form = markPaidForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
export const payslips = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(args, options),
    method: 'get',
})

payslips.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payrolls/{payroll}/payslips',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
payslips.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return payslips.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
payslips.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
payslips.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslips.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
    const payslipsForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payslips.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
        payslipsForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslips.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::payslips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:131
 * @route '/api/v1/hr/payrolls/{payroll}/payslips'
 */
        payslipsForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslips.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payslips.form = payslipsForm
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
export const slips = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slips.url(args, options),
    method: 'get',
})

slips.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/payrolls/{payroll}/slips',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
slips.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return slips.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
slips.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slips.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
slips.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: slips.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
    const slipsForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: slips.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
        slipsForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: slips.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\PayrollController::slips
 * @see app/Http/Controllers/Api/V1/HR/PayrollController.php:65
 * @route '/api/v1/hr/payrolls/{payroll}/slips'
 */
        slipsForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: slips.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    slips.form = slipsForm
const payrolls = {
    index: Object.assign(index, index),
destroy: Object.assign(destroy, destroy),
generate: Object.assign(generate, generate),
markPaid: Object.assign(markPaid, markPaid),
payslips: Object.assign(payslips, payslips),
slips: Object.assign(slips, slips),
}

export default payrolls