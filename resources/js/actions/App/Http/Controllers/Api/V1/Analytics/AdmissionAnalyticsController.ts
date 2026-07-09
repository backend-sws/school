import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/admission-analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::index
 * @see app/Http/Controllers/Api/V1/Analytics/AdmissionAnalyticsController.php:36
 * @route '/api/v1/admission-analytics'
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
const AdmissionAnalyticsController = { index }

export default AdmissionAnalyticsController