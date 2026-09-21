import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
const MainLandingController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MainLandingController.url(options),
    method: 'get',
})

MainLandingController.definition = {
    methods: ["get","head"],
    url: '/landing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
MainLandingController.url = (options?: RouteQueryOptions) => {
    return MainLandingController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
MainLandingController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MainLandingController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
MainLandingController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: MainLandingController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
    const MainLandingControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: MainLandingController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
        MainLandingControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: MainLandingController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
        MainLandingControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: MainLandingController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    MainLandingController.form = MainLandingControllerForm
export default MainLandingController