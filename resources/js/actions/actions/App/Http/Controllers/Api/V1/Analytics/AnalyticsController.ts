import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Analytics\AnalyticsController::show
* @see app/Http/Controllers/Api/V1/Analytics/AnalyticsController.php:26
* @route '/api/v1/analytics/{type}'
*/
export const show = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/analytics/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Analytics\AnalyticsController::show
* @see app/Http/Controllers/Api/V1/Analytics/AnalyticsController.php:26
* @route '/api/v1/analytics/{type}'
*/
show.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return show.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Analytics\AnalyticsController::show
* @see app/Http/Controllers/Api/V1/Analytics/AnalyticsController.php:26
* @route '/api/v1/analytics/{type}'
*/
show.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Analytics\AnalyticsController::show
* @see app/Http/Controllers/Api/V1/Analytics/AnalyticsController.php:26
* @route '/api/v1/analytics/{type}'
*/
show.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const AnalyticsController = { show }

export default AnalyticsController