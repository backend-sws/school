import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/billing/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::index
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:22
 * @route '/billing/plans'
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
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
export const paymentSuccess = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentSuccess.url(options),
    method: 'get',
})

paymentSuccess.definition = {
    methods: ["get","post","head"],
    url: '/billing/success',
} satisfies RouteDefinition<["get","post","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
paymentSuccess.url = (options?: RouteQueryOptions) => {
    return paymentSuccess.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
paymentSuccess.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentSuccess.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
paymentSuccess.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paymentSuccess.url(options),
    method: 'post',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
paymentSuccess.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentSuccess.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
    const paymentSuccessForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentSuccess.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
        paymentSuccessForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentSuccess.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
        paymentSuccessForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: paymentSuccess.url(options),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\BillingController::paymentSuccess
 * @see app/Http/Controllers/Api/V1/Organization/BillingController.php:82
 * @route '/billing/success'
 */
        paymentSuccessForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentSuccess.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentSuccess.form = paymentSuccessForm
const BillingController = { index, checkout, paymentSuccess }

export default BillingController