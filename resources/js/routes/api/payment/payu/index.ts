import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::callback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

callback.definition = {
    methods: ["post"],
    url: '/api/v1/payments/payu/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::callback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::callback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
callback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::callback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: callback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::callback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
        callbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: callback.url(options),
            method: 'post',
        })
    
    callback.form = callbackForm
const payu = {
    callback: Object.assign(callback, callback),
}

export default payu