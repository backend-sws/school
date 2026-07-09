import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
 */
export const show = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
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
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
 */
show.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
 */
show.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
 */
    const showForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
 */
        showForm.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::show
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:28
 * @route '/api/v1/reports/{type}'
 */
        showForm.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
export const exportMethod = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/{type}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
exportMethod.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
exportMethod.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
exportMethod.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
    const exportMethodForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
        exportMethodForm.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Reports\ReportController::exportMethod
 * @see app/Http/Controllers/Api/V1/Reports/ReportController.php:47
 * @route '/api/v1/reports/{type}/export'
 */
        exportMethodForm.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const ReportController = { show, exportMethod, export: exportMethod }

export default ReportController