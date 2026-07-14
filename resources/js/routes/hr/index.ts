import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import payroll from './payroll'
/**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
export const attendance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(options),
    method: 'get',
})

attendance.definition = {
    methods: ["get","head"],
    url: '/hr/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
attendance.url = (options?: RouteQueryOptions) => {
    return attendance.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
attendance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
attendance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: attendance.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
    const attendanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: attendance.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
        attendanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:275
 * @route '/hr/attendance'
 */
        attendanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    attendance.form = attendanceForm
/**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
export const leaveTypes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveTypes.url(options),
    method: 'get',
})

leaveTypes.definition = {
    methods: ["get","head"],
    url: '/hr/leave-types',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
leaveTypes.url = (options?: RouteQueryOptions) => {
    return leaveTypes.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
leaveTypes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveTypes.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
leaveTypes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveTypes.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
    const leaveTypesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: leaveTypes.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
        leaveTypesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leaveTypes.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:276
 * @route '/hr/leave-types'
 */
        leaveTypesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leaveTypes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    leaveTypes.form = leaveTypesForm
/**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
export const leaveRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveRequests.url(options),
    method: 'get',
})

leaveRequests.definition = {
    methods: ["get","head"],
    url: '/hr/leave-requests',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
leaveRequests.url = (options?: RouteQueryOptions) => {
    return leaveRequests.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
leaveRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveRequests.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
leaveRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveRequests.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
    const leaveRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: leaveRequests.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
        leaveRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leaveRequests.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:277
 * @route '/hr/leave-requests'
 */
        leaveRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leaveRequests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    leaveRequests.form = leaveRequestsForm
const hr = {
    payroll: Object.assign(payroll, payroll),
attendance: Object.assign(attendance, attendance),
leaveTypes: Object.assign(leaveTypes, leaveTypes),
leaveRequests: Object.assign(leaveRequests, leaveRequests),
}

export default hr