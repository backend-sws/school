import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::updateRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:289
 * @route '/api/v1/attendance/records/{id}'
 */
export const updateRecord = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRecord.url(args, options),
    method: 'put',
})

updateRecord.definition = {
    methods: ["put"],
    url: '/api/v1/attendance/records/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::updateRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:289
 * @route '/api/v1/attendance/records/{id}'
 */
updateRecord.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateRecord.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::updateRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:289
 * @route '/api/v1/attendance/records/{id}'
 */
updateRecord.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRecord.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::updateRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:289
 * @route '/api/v1/attendance/records/{id}'
 */
    const updateRecordForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRecord.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::updateRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:289
 * @route '/api/v1/attendance/records/{id}'
 */
        updateRecordForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRecord.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateRecord.form = updateRecordForm
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::destroyRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:322
 * @route '/api/v1/attendance/records/{id}'
 */
export const destroyRecord = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyRecord.url(args, options),
    method: 'delete',
})

destroyRecord.definition = {
    methods: ["delete"],
    url: '/api/v1/attendance/records/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::destroyRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:322
 * @route '/api/v1/attendance/records/{id}'
 */
destroyRecord.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroyRecord.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::destroyRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:322
 * @route '/api/v1/attendance/records/{id}'
 */
destroyRecord.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyRecord.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::destroyRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:322
 * @route '/api/v1/attendance/records/{id}'
 */
    const destroyRecordForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyRecord.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::destroyRecord
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:322
 * @route '/api/v1/attendance/records/{id}'
 */
        destroyRecordForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyRecord.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyRecord.form = destroyRecordForm
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
export const reportsDaily = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportsDaily.url(options),
    method: 'get',
})

reportsDaily.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/reports/daily',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
reportsDaily.url = (options?: RouteQueryOptions) => {
    return reportsDaily.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
reportsDaily.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportsDaily.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
reportsDaily.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportsDaily.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
    const reportsDailyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportsDaily.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
        reportsDailyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportsDaily.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:342
 * @route '/api/v1/attendance/reports/daily'
 */
        reportsDailyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportsDaily.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportsDaily.form = reportsDailyForm
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
export const reportsSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportsSummary.url(options),
    method: 'get',
})

reportsSummary.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/reports/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
reportsSummary.url = (options?: RouteQueryOptions) => {
    return reportsSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
reportsSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportsSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
reportsSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportsSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
    const reportsSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportsSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
        reportsSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportsSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::reportsSummary
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:373
 * @route '/api/v1/attendance/reports/summary'
 */
        reportsSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportsSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportsSummary.form = reportsSummaryForm
const AttendanceController = { updateRecord, destroyRecord, reportsDaily, reportsSummary }

export default AttendanceController