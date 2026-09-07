import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
export const studentsSummary = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentsSummary.url(args, options),
    method: 'get',
})

studentsSummary.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/students-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
studentsSummary.url = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return studentsSummary.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
studentsSummary.get = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentsSummary.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
studentsSummary.head = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentsSummary.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
    const studentsSummaryForm = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentsSummary.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
        studentsSummaryForm.get = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentsSummary.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::studentsSummary
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:29
 * @route '/api/v1/lms/classes/{lms_class}/students-summary'
 */
        studentsSummaryForm.head = (args: { lms_class: number | { id: number } } | [lms_class: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentsSummary.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentsSummary.form = studentsSummaryForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
export const student360 = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student360.url(args, options),
    method: 'get',
})

student360.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/students/{student_user}/360',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
student360.url = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                    student_user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                                student_user: typeof args.student_user === 'object'
                ? args.student_user.id
                : args.student_user,
                }

    return student360.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
student360.get = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student360.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
student360.head = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: student360.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
    const student360Form = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: student360.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
        student360Form.get = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student360.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::student360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:230
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/360'
 */
        student360Form.head = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student360.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    student360.form = student360Form
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
export const globalStudent360 = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: globalStudent360.url(args, options),
    method: 'get',
})

globalStudent360.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/students/{student_user}/global-360',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
globalStudent360.url = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student_user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student_user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student_user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student_user: typeof args.student_user === 'object'
                ? args.student_user.id
                : args.student_user,
                }

    return globalStudent360.definition.url
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
globalStudent360.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: globalStudent360.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
globalStudent360.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: globalStudent360.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
    const globalStudent360Form = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: globalStudent360.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
        globalStudent360Form.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: globalStudent360.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
        globalStudent360Form.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: globalStudent360.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    globalStudent360.form = globalStudent360Form
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
export const lifetimeHistory = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lifetimeHistory.url(args, options),
    method: 'get',
})

lifetimeHistory.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/students/{student_user}/lifetime-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
lifetimeHistory.url = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student_user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student_user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student_user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student_user: typeof args.student_user === 'object'
                ? args.student_user.id
                : args.student_user,
                }

    return lifetimeHistory.definition.url
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
lifetimeHistory.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lifetimeHistory.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
lifetimeHistory.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lifetimeHistory.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
    const lifetimeHistoryForm = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lifetimeHistory.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
        lifetimeHistoryForm.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lifetimeHistory.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
        lifetimeHistoryForm.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lifetimeHistory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lifetimeHistory.form = lifetimeHistoryForm
const ClassStudentRosterController = { studentsSummary, student360, globalStudent360, lifetimeHistory }

export default ClassStudentRosterController