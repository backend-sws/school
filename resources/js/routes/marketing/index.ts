import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '//127.0.0.1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\MainLandingController::__invoke
 * @see app/Http/Controllers/Web/MainLandingController.php:17
 * @route '//127.0.0.1'
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