import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/my-organisation/institutions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\CreateInstitutionController::create
 * @see app/Http/Controllers/Web/CreateInstitutionController.php:16
 * @route '/my-organisation/institutions/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
const institutions = {
    create: Object.assign(create, create),
}

export default institutions