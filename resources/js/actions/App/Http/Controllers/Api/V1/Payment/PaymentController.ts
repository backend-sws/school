import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::handleCallback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
export const handleCallback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleCallback.url(options),
    method: 'post',
})

handleCallback.definition = {
    methods: ["post"],
    url: '/api/v1/payments/payu/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::handleCallback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
handleCallback.url = (options?: RouteQueryOptions) => {
    return handleCallback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::handleCallback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
handleCallback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleCallback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::handleCallback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
    const handleCallbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleCallback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::handleCallback
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:186
 * @route '/api/v1/payments/payu/callback'
 */
        handleCallbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleCallback.url(options),
            method: 'post',
        })
    
    handleCallback.form = handleCallbackForm
/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::initiate
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:63
 * @route '/api/v1/student/payment/initiate'
 */
export const initiate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/api/v1/student/payment/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::initiate
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:63
 * @route '/api/v1/student/payment/initiate'
 */
initiate.url = (options?: RouteQueryOptions) => {
    return initiate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::initiate
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:63
 * @route '/api/v1/student/payment/initiate'
 */
initiate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::initiate
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:63
 * @route '/api/v1/student/payment/initiate'
 */
    const initiateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: initiate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Payment\PaymentController::initiate
 * @see app/Http/Controllers/Api/V1/Payment/PaymentController.php:63
 * @route '/api/v1/student/payment/initiate'
 */
        initiateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: initiate.url(options),
            method: 'post',
        })
    
    initiate.form = initiateForm
const PaymentController = { handleCallback, initiate }

export default PaymentController