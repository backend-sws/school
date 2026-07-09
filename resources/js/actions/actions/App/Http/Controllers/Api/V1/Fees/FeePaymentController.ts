import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::collect
* @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
* @route '/api/v1/fee-payments/{payment}/collect'
*/
export const collect = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: collect.url(args, options),
    method: 'post',
})

collect.definition = {
    methods: ["post"],
    url: '/api/v1/fee-payments/{payment}/collect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::collect
* @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
* @route '/api/v1/fee-payments/{payment}/collect'
*/
collect.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: args.payment,
    }

    return collect.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\FeePaymentController::collect
* @see app/Http/Controllers/Api/V1/Fees/FeePaymentController.php:0
* @route '/api/v1/fee-payments/{payment}/collect'
*/
collect.post = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: collect.url(args, options),
    method: 'post',
})

const FeePaymentController = { index, store, show, update, destroy, collect }

export default FeePaymentController