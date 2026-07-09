import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::__invoke
* @see app/Http/Controllers/Web/CreateInstitutionController.php:16
* @route '/my-organisation/institutions/create'
*/
export const __invoke = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})

__invoke.definition = {
    methods: ["get","head"],
    url: '/my-organisation/institutions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::__invoke
* @see app/Http/Controllers/Web/CreateInstitutionController.php:16
* @route '/my-organisation/institutions/create'
*/
__invoke.url = (options?: RouteQueryOptions) => {
    return __invoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::__invoke
* @see app/Http/Controllers/Web/CreateInstitutionController.php:16
* @route '/my-organisation/institutions/create'
*/
__invoke.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::__invoke
* @see app/Http/Controllers/Web/CreateInstitutionController.php:16
* @route '/my-organisation/institutions/create'
*/
__invoke.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: __invoke.url(options),
    method: 'head',
})

const CreateInstitutionController = { __invoke }

export default CreateInstitutionController