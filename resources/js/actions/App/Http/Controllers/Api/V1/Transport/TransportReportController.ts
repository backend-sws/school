import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
export const manifest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifest.url(options),
    method: 'get',
})

manifest.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/reports/manifest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
manifest.url = (options?: RouteQueryOptions) => {
    return manifest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
manifest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifest.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
manifest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manifest.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
    const manifestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manifest.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
        manifestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manifest.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::manifest
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:15
 * @route '/api/v1/transport/reports/manifest'
 */
        manifestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manifest.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manifest.form = manifestForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
export const occupancy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})

occupancy.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/reports/occupancy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
occupancy.url = (options?: RouteQueryOptions) => {
    return occupancy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
occupancy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
occupancy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: occupancy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
    const occupancyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: occupancy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
        occupancyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Transport/TransportReportController.php:69
 * @route '/api/v1/transport/reports/occupancy'
 */
        occupancyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    occupancy.form = occupancyForm
const TransportReportController = { manifest, occupancy }

export default TransportReportController