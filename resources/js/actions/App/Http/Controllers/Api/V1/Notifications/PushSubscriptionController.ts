import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::subscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:15
 * @route '/api/v1/notifications/push/subscribe'
 */
export const subscribe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

subscribe.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/push/subscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::subscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:15
 * @route '/api/v1/notifications/push/subscribe'
 */
subscribe.url = (options?: RouteQueryOptions) => {
    return subscribe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::subscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:15
 * @route '/api/v1/notifications/push/subscribe'
 */
subscribe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::subscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:15
 * @route '/api/v1/notifications/push/subscribe'
 */
    const subscribeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: subscribe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::subscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:15
 * @route '/api/v1/notifications/push/subscribe'
 */
        subscribeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: subscribe.url(options),
            method: 'post',
        })
    
    subscribe.form = subscribeForm
/**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::unsubscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:34
 * @route '/api/v1/notifications/push/unsubscribe'
 */
export const unsubscribe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsubscribe.url(options),
    method: 'post',
})

unsubscribe.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/push/unsubscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::unsubscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:34
 * @route '/api/v1/notifications/push/unsubscribe'
 */
unsubscribe.url = (options?: RouteQueryOptions) => {
    return unsubscribe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::unsubscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:34
 * @route '/api/v1/notifications/push/unsubscribe'
 */
unsubscribe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsubscribe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::unsubscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:34
 * @route '/api/v1/notifications/push/unsubscribe'
 */
    const unsubscribeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unsubscribe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::unsubscribe
 * @see app/Http/Controllers/Api/V1/Notifications/PushSubscriptionController.php:34
 * @route '/api/v1/notifications/push/unsubscribe'
 */
        unsubscribeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unsubscribe.url(options),
            method: 'post',
        })
    
    unsubscribe.form = unsubscribeForm
const PushSubscriptionController = { subscribe, unsubscribe }

export default PushSubscriptionController