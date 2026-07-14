import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
export const __invoke = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})

__invoke.definition = {
    methods: ["get","head"],
    url: '/super-admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
__invoke.url = (options?: RouteQueryOptions) => {
    return __invoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
__invoke.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
__invoke.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: __invoke.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
    const __invokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: __invoke.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
        __invokeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: __invoke.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
        __invokeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: __invoke.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    __invoke.form = __invokeForm
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
const SuperAdminLandingController = { __invoke, onboard }

export default SuperAdminLandingController