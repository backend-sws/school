import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
export const plans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})

plans.definition = {
    methods: ["get","head"],
    url: '/billing/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
plans.url = (options?: RouteQueryOptions) => {
    return plans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
plans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
plans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: plans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
    const plansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: plans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
        plansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::plans
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
        plansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    plans.form = plansForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::checkout
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:56
 * @route '/billing/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::checkout
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:56
 * @route '/billing/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::checkout
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:56
 * @route '/billing/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::checkout
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:56
 * @route '/billing/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::checkout
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:56
 * @route '/billing/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
export const success = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})

success.definition = {
    methods: ["get","post","head"],
    url: '/billing/success',
} satisfies RouteDefinition<["get","post","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
success.url = (options?: RouteQueryOptions) => {
    return success.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
success.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
success.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: success.url(options),
    method: 'post',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
success.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
    const successForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: success.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
        successForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
        successForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: success.url(options),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::success
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
        successForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    success.form = successForm
const billing = {
    plans: Object.assign(plans, plans),
checkout: Object.assign(checkout, checkout),
success: Object.assign(success, success),
}

export default billing