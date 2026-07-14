import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::onboard
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:72
 * @route '/super-admin/onboard'
 */
export const onboard = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: onboard.url(options),
    method: 'post',
})

onboard.definition = {
    methods: ["post"],
    url: '/super-admin/onboard',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::onboard
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:72
 * @route '/super-admin/onboard'
 */
onboard.url = (options?: RouteQueryOptions) => {
    return onboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::onboard
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:72
 * @route '/super-admin/onboard'
 */
onboard.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: onboard.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::onboard
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:72
 * @route '/super-admin/onboard'
 */
    const onboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: onboard.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::onboard
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:72
 * @route '/super-admin/onboard'
 */
        onboardForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: onboard.url(options),
            method: 'post',
        })
    
    onboard.form = onboardForm
const superAdmin = {
    onboard: Object.assign(onboard, onboard),
}

export default superAdmin