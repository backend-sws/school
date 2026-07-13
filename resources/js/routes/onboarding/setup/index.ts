import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/onboarding/setup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const setup = {
    store: Object.assign(store, store),
}

export default setup