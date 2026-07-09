import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:136
 * @route '/onboarding/plan'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/onboarding/plan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:136
 * @route '/onboarding/plan'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:136
 * @route '/onboarding/plan'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:136
 * @route '/onboarding/plan'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::store
 * @see app/Http/Controllers/Web/OnboardingController.php:136
 * @route '/onboarding/plan'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const plan = {
    store: Object.assign(store, store),
}

export default plan