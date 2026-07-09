import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
export const custom = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: custom.url(options),
    method: 'get',
})

custom.definition = {
    methods: ["get","head"],
    url: '/verify-email',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
custom.url = (options?: RouteQueryOptions) => {
    return custom.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
custom.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: custom.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
custom.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: custom.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
    const customForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: custom.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
        customForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: custom.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
        customForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: custom.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    custom.form = customForm
const email = {
    custom: Object.assign(custom, custom),
}

export default email