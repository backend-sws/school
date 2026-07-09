import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
 */
export const occupancy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})

occupancy.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/reports/occupancy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
 */
occupancy.url = (options?: RouteQueryOptions) => {
    return occupancy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
 */
occupancy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
 */
occupancy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: occupancy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
 */
    const occupancyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: occupancy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
 */
        occupancyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::occupancy
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:50
 * @route '/api/v1/hostel/reports/occupancy'
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
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/v1/hostel/reports/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Hostel\HostelReportController::summary
 * @see app/Http/Controllers/Api/V1/Hostel/HostelReportController.php:14
 * @route '/api/v1/hostel/reports/summary'
 */
        summaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    summary.form = summaryForm
const HostelReportController = { occupancy, summary }

export default HostelReportController