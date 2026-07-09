import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
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

export default VerifyEmailController