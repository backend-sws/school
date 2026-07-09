import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Auth\PermissionController::index
 * @see app/Http/Controllers/Api/V1/Auth/PermissionController.php:33
 * @route '/api/v1/permissions'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const PermissionController = { index }

export default PermissionController