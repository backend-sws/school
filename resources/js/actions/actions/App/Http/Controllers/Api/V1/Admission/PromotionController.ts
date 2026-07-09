import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::eligible
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:24
* @route '/api/v1/promotions/eligible'
*/
export const eligible = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eligible.url(options),
    method: 'get',
})

eligible.definition = {
    methods: ["get","head"],
    url: '/api/v1/promotions/eligible',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::eligible
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:24
* @route '/api/v1/promotions/eligible'
*/
eligible.url = (options?: RouteQueryOptions) => {
    return eligible.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::eligible
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:24
* @route '/api/v1/promotions/eligible'
*/
eligible.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eligible.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::eligible
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:24
* @route '/api/v1/promotions/eligible'
*/
eligible.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eligible.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::promote
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:55
* @route '/api/v1/promotions/promote'
*/
export const promote = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: promote.url(options),
    method: 'post',
})

promote.definition = {
    methods: ["post"],
    url: '/api/v1/promotions/promote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::promote
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:55
* @route '/api/v1/promotions/promote'
*/
promote.url = (options?: RouteQueryOptions) => {
    return promote.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::promote
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:55
* @route '/api/v1/promotions/promote'
*/
promote.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: promote.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::bulkPromote
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:82
* @route '/api/v1/promotions/bulk-promote'
*/
export const bulkPromote = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPromote.url(options),
    method: 'post',
})

bulkPromote.definition = {
    methods: ["post"],
    url: '/api/v1/promotions/bulk-promote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::bulkPromote
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:82
* @route '/api/v1/promotions/bulk-promote'
*/
bulkPromote.url = (options?: RouteQueryOptions) => {
    return bulkPromote.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::bulkPromote
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:82
* @route '/api/v1/promotions/bulk-promote'
*/
bulkPromote.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPromote.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::rollback
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:121
* @route '/api/v1/promotions/{transition}/rollback'
*/
export const rollback = (args: { transition: number | { id: number } } | [transition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

rollback.definition = {
    methods: ["post"],
    url: '/api/v1/promotions/{transition}/rollback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::rollback
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:121
* @route '/api/v1/promotions/{transition}/rollback'
*/
rollback.url = (args: { transition: number | { id: number } } | [transition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transition: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transition: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transition: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transition: typeof args.transition === 'object'
        ? args.transition.id
        : args.transition,
    }

    return rollback.definition.url
            .replace('{transition}', parsedArgs.transition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::rollback
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:121
* @route '/api/v1/promotions/{transition}/rollback'
*/
rollback.post = (args: { transition: number | { id: number } } | [transition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::history
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:138
* @route '/api/v1/promotions/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api/v1/promotions/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::history
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:138
* @route '/api/v1/promotions/history'
*/
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::history
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:138
* @route '/api/v1/promotions/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Admission\PromotionController::history
* @see app/Http/Controllers/Api/V1/Admission/PromotionController.php:138
* @route '/api/v1/promotions/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

const PromotionController = { eligible, promote, bulkPromote, rollback, history }

export default PromotionController