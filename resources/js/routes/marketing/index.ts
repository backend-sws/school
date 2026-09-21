import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/landing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '/landing'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
const marketing = {
    home: Object.assign(home, home),
}

export default marketing