import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
export const notice = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notice.url(options),
    method: 'get',
})

notice.definition = {
    methods: ["get","head"],
    url: '/onboarding/verify-notice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
notice.url = (options?: RouteQueryOptions) => {
    return notice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
notice.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notice.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
notice.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notice.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
    const noticeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notice.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
        noticeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notice.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::notice
 * @see app/Http/Controllers/Web/OnboardingController.php:221
 * @route '/onboarding/verify-notice'
 */
        noticeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notice.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notice.form = noticeForm