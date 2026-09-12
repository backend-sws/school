import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
export const fleetAnalytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fleetAnalytics.url(options),
    method: 'get',
})

fleetAnalytics.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicles/fleet-analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
fleetAnalytics.url = (options?: RouteQueryOptions) => {
    return fleetAnalytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
fleetAnalytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fleetAnalytics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
fleetAnalytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fleetAnalytics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
    const fleetAnalyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: fleetAnalytics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
        fleetAnalyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fleetAnalytics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:137
 * @route '/api/v1/transport/vehicles/fleet-analytics'
 */
        fleetAnalyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fleetAnalytics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    fleetAnalytics.form = fleetAnalyticsForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
export const fleetAuditLogs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fleetAuditLogs.url(options),
    method: 'get',
})

fleetAuditLogs.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicles/fleet-audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
fleetAuditLogs.url = (options?: RouteQueryOptions) => {
    return fleetAuditLogs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
fleetAuditLogs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fleetAuditLogs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
fleetAuditLogs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fleetAuditLogs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
    const fleetAuditLogsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: fleetAuditLogs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
        fleetAuditLogsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fleetAuditLogs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::fleetAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:335
 * @route '/api/v1/transport/vehicles/fleet-audit-logs'
 */
        fleetAuditLogsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fleetAuditLogs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    fleetAuditLogs.form = fleetAuditLogsForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
export const vehicleAnalytics = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vehicleAnalytics.url(args, options),
    method: 'get',
})

vehicleAnalytics.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicles/{id}/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
vehicleAnalytics.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return vehicleAnalytics.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
vehicleAnalytics.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vehicleAnalytics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
vehicleAnalytics.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vehicleAnalytics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
    const vehicleAnalyticsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vehicleAnalytics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
        vehicleAnalyticsForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vehicleAnalytics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAnalytics
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:17
 * @route '/api/v1/transport/vehicles/{id}/analytics'
 */
        vehicleAnalyticsForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vehicleAnalytics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vehicleAnalytics.form = vehicleAnalyticsForm
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
export const vehicleAuditLogs = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vehicleAuditLogs.url(args, options),
    method: 'get',
})

vehicleAuditLogs.definition = {
    methods: ["get","head"],
    url: '/api/v1/transport/vehicles/{id}/audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
vehicleAuditLogs.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return vehicleAuditLogs.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
vehicleAuditLogs.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vehicleAuditLogs.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
vehicleAuditLogs.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vehicleAuditLogs.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
    const vehicleAuditLogsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vehicleAuditLogs.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
        vehicleAuditLogsForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vehicleAuditLogs.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Transport\TransportVehicleAnalyticsController::vehicleAuditLogs
 * @see app/Http/Controllers/Api/V1/Transport/TransportVehicleAnalyticsController.php:303
 * @route '/api/v1/transport/vehicles/{id}/audit-logs'
 */
        vehicleAuditLogsForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vehicleAuditLogs.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vehicleAuditLogs.form = vehicleAuditLogsForm
const TransportVehicleAnalyticsController = { fleetAnalytics, fleetAuditLogs, vehicleAnalytics, vehicleAuditLogs }

export default TransportVehicleAnalyticsController