import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/onboarding/account',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const account = {
    store: Object.assign(store, store),
}

export default account