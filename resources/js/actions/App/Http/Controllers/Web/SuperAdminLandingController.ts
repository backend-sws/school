import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
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
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
 * @route '/super-admin'
 */
__invoke.url = (options?: RouteQueryOptions) => {
    return __invoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
 * @route '/super-admin'
 */
__invoke.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
 * @route '/super-admin'
 */
__invoke.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: __invoke.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
 * @route '/super-admin'
 */
    const __invokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: __invoke.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
 * @route '/super-admin'
 */
        __invokeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: __invoke.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::__invoke
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:19
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
const SuperAdminLandingController = { __invoke }

export default SuperAdminLandingController