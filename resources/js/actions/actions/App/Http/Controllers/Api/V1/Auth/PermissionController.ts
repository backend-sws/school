import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
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

const PermissionController = { index }

export default PermissionController