import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
export const ledger = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ledger.url(options),
    method: 'get',
})

ledger.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/staff-attendance/ledger',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
ledger.url = (options?: RouteQueryOptions) => {
    return ledger.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
ledger.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ledger.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
ledger.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ledger.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
    const ledgerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ledger.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
        ledgerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ledger.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:76
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
        ledgerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ledger.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ledger.form = ledgerForm
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/staff-attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:14
 * @route '/api/v1/hr/staff-attendance'
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
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:44
 * @route '/api/v1/hr/staff-attendance'
 */
export const mark = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mark.url(options),
    method: 'post',
})

mark.definition = {
    methods: ["post"],
    url: '/api/v1/hr/staff-attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:44
 * @route '/api/v1/hr/staff-attendance'
 */
mark.url = (options?: RouteQueryOptions) => {
    return mark.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:44
 * @route '/api/v1/hr/staff-attendance'
 */
mark.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mark.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:44
 * @route '/api/v1/hr/staff-attendance'
 */
    const markForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: mark.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:44
 * @route '/api/v1/hr/staff-attendance'
 */
        markForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: mark.url(options),
            method: 'post',
        })
    
    mark.form = markForm
const StaffAttendanceController = { ledger, index, mark }

export default StaffAttendanceController