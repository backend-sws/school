import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
export const classes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: classes.url(options),
    method: 'get',
})

classes.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/classes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
classes.url = (options?: RouteQueryOptions) => {
    return classes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
classes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: classes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
classes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: classes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
    const classesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: classes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
        classesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: classes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::classes
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:26
 * @route '/api/v1/attendance/classes'
 */
        classesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: classes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    classes.form = classesForm
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
export const allocationsForClass = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allocationsForClass.url(args, options),
    method: 'get',
})

allocationsForClass.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/classes/{lms_class_id}/allocations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
allocationsForClass.url = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                }

    return allocationsForClass.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
allocationsForClass.get = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allocationsForClass.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
allocationsForClass.head = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allocationsForClass.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
    const allocationsForClassForm = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: allocationsForClass.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
        allocationsForClassForm.get = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: allocationsForClass.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::allocationsForClass
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:72
 * @route '/api/v1/attendance/classes/{lms_class_id}/allocations'
 */
        allocationsForClassForm.head = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: allocationsForClass.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    allocationsForClass.form = allocationsForClassForm
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
export const getDaily = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDaily.url(options),
    method: 'get',
})

getDaily.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/daily',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
getDaily.url = (options?: RouteQueryOptions) => {
    return getDaily.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
getDaily.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDaily.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
getDaily.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDaily.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
    const getDailyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDaily.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
        getDailyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDaily.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::getDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:110
 * @route '/api/v1/attendance/daily'
 */
        getDailyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDaily.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDaily.form = getDailyForm
/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::submitDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:201
 * @route '/api/v1/attendance/daily'
 */
export const submitDaily = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitDaily.url(options),
    method: 'post',
})

submitDaily.definition = {
    methods: ["post"],
    url: '/api/v1/attendance/daily',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::submitDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:201
 * @route '/api/v1/attendance/daily'
 */
submitDaily.url = (options?: RouteQueryOptions) => {
    return submitDaily.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::submitDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:201
 * @route '/api/v1/attendance/daily'
 */
submitDaily.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitDaily.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::submitDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:201
 * @route '/api/v1/attendance/daily'
 */
    const submitDailyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitDaily.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Attendance\AttendanceController::submitDaily
 * @see app/Http/Controllers/Api/V1/Attendance/AttendanceController.php:201
 * @route '/api/v1/attendance/daily'
 */
        submitDailyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitDaily.url(options),
            method: 'post',
        })
    
    submitDaily.form = submitDailyForm
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
const AttendanceController = { classes, allocationsForClass, getDaily, submitDaily, updateRecord, destroyRecord, reportsDaily, reportsSummary }

export default AttendanceController