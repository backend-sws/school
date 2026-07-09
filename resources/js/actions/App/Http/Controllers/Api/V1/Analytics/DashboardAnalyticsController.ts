import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard-stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/DashboardAnalyticsController.php:100
 * @route '/api/v1/dashboard-stats'
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
const DashboardAnalyticsController = { index }

export default DashboardAnalyticsController