import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::index
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:39
 * @route '/api/v1/fee-payments'
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
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:71
 * @route '/api/v1/fee-payments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/fee-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:71
 * @route '/api/v1/fee-payments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:71
 * @route '/api/v1/fee-payments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:71
 * @route '/api/v1/fee-payments'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::store
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:71
 * @route '/api/v1/fee-payments'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
export const show = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/fee-payments/{fee_payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
show.url = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_payment: args.fee_payment,
                }

    return show.definition.url
            .replace('{fee_payment}', parsedArgs.fee_payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
show.get = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
show.head = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
    const showForm = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
        showForm.get = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::show
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:111
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
        showForm.head = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
export const update = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/fee-payments/{fee_payment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
update.url = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_payment: args.fee_payment,
                }

    return update.definition.url
            .replace('{fee_payment}', parsedArgs.fee_payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
update.put = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
update.patch = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
    const updateForm = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
        updateForm.put = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::update
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
        updateForm.patch = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:174
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
export const destroy = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fee-payments/{fee_payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:174
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
destroy.url = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee_payment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fee_payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fee_payment: args.fee_payment,
                }

    return destroy.definition.url
            .replace('{fee_payment}', parsedArgs.fee_payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:174
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
destroy.delete = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:174
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
    const destroyForm = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::destroy
 * @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:174
 * @route '/api/v1/fee-payments/{fee_payment}'
 */
        destroyForm.delete = (args: { fee_payment: string | number } | [fee_payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const feePayments = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default feePayments