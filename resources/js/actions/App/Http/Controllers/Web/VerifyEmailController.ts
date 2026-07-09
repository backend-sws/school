import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
const VerifyEmailController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VerifyEmailController.url(options),
    method: 'get',
})

VerifyEmailController.definition = {
    methods: ["get","head"],
    url: '/verify-email',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
VerifyEmailController.url = (options?: RouteQueryOptions) => {
    return VerifyEmailController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
VerifyEmailController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VerifyEmailController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
VerifyEmailController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: VerifyEmailController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
    const VerifyEmailControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: VerifyEmailController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
        VerifyEmailControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: VerifyEmailController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\VerifyEmailController::__invoke
 * @see app/Http/Controllers/Web/VerifyEmailController.php:20
 * @route '/verify-email'
 */
        VerifyEmailControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: VerifyEmailController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    VerifyEmailController.form = VerifyEmailControllerForm
export default VerifyEmailController