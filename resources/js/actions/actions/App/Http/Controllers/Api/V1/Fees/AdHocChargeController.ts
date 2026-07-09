import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:48
* @route '/api/v1/fees/ad-hoc-charges'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/fees/ad-hoc-charges',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:48
* @route '/api/v1/fees/ad-hoc-charges'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:48
* @route '/api/v1/fees/ad-hoc-charges'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::index
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:48
* @route '/api/v1/fees/ad-hoc-charges'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
* @route '/api/v1/fees/ad-hoc-charges'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ad-hoc-charges',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
* @route '/api/v1/fees/ad-hoc-charges'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
* @route '/api/v1/fees/ad-hoc-charges'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:91
* @route '/api/v1/fees/ad-hoc-charges/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/fees/ad-hoc-charges/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:91
* @route '/api/v1/fees/ad-hoc-charges/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::destroy
* @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:91
* @route '/api/v1/fees/ad-hoc-charges/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const AdHocChargeController = { index, store, destroy }

export default AdHocChargeController