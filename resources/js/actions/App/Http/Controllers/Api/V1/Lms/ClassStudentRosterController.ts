import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
const globalStudent36076a4f8a9841682272968e364ec5a14f0 = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: globalStudent36076a4f8a9841682272968e364ec5a14f0.url(args, options),
    method: 'get',
})

globalStudent36076a4f8a9841682272968e364ec5a14f0.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/{student_user}/global-360',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
globalStudent36076a4f8a9841682272968e364ec5a14f0.url = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return globalStudent36076a4f8a9841682272968e364ec5a14f0.definition.url
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
globalStudent36076a4f8a9841682272968e364ec5a14f0.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: globalStudent36076a4f8a9841682272968e364ec5a14f0.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
globalStudent36076a4f8a9841682272968e364ec5a14f0.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: globalStudent36076a4f8a9841682272968e364ec5a14f0.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
    const globalStudent36076a4f8a9841682272968e364ec5a14f0Form = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: globalStudent36076a4f8a9841682272968e364ec5a14f0.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
        globalStudent36076a4f8a9841682272968e364ec5a14f0Form.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: globalStudent36076a4f8a9841682272968e364ec5a14f0.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/students/{student_user}/global-360'
 */
        globalStudent36076a4f8a9841682272968e364ec5a14f0Form.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: globalStudent36076a4f8a9841682272968e364ec5a14f0.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    globalStudent36076a4f8a9841682272968e364ec5a14f0.form = globalStudent36076a4f8a9841682272968e364ec5a14f0Form
    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
const globalStudent360eb1075d1aa588d16b165ba52ec1e6183 = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url(args, options),
    method: 'get',
})

globalStudent360eb1075d1aa588d16b165ba52ec1e6183.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/students/{student_user}/global-360',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return globalStudent360eb1075d1aa588d16b165ba52ec1e6183.definition.url
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
globalStudent360eb1075d1aa588d16b165ba52ec1e6183.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
globalStudent360eb1075d1aa588d16b165ba52ec1e6183.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
    const globalStudent360eb1075d1aa588d16b165ba52ec1e6183Form = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
        globalStudent360eb1075d1aa588d16b165ba52ec1e6183Form.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:244
 * @route '/api/v1/lms/students/{student_user}/global-360'
 */
        globalStudent360eb1075d1aa588d16b165ba52ec1e6183Form.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: globalStudent360eb1075d1aa588d16b165ba52ec1e6183.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    globalStudent360eb1075d1aa588d16b165ba52ec1e6183.form = globalStudent360eb1075d1aa588d16b165ba52ec1e6183Form

/**
* Multiple routes resolve to \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::globalStudent360, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `globalStudent360['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const globalStudent360 = {
    '/api/v1/students/{student_user}/global-360': globalStudent36076a4f8a9841682272968e364ec5a14f0,
    '/api/v1/lms/students/{student_user}/global-360': globalStudent360eb1075d1aa588d16b165ba52ec1e6183,
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
const lifetimeHistory0516f07d65ba8f483984d156c0dd1420 = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url(args, options),
    method: 'get',
})

lifetimeHistory0516f07d65ba8f483984d156c0dd1420.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/{student_user}/lifetime-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return lifetimeHistory0516f07d65ba8f483984d156c0dd1420.definition.url
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
lifetimeHistory0516f07d65ba8f483984d156c0dd1420.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
lifetimeHistory0516f07d65ba8f483984d156c0dd1420.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
    const lifetimeHistory0516f07d65ba8f483984d156c0dd1420Form = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
        lifetimeHistory0516f07d65ba8f483984d156c0dd1420Form.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/students/{student_user}/lifetime-history'
 */
        lifetimeHistory0516f07d65ba8f483984d156c0dd1420Form.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lifetimeHistory0516f07d65ba8f483984d156c0dd1420.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lifetimeHistory0516f07d65ba8f483984d156c0dd1420.form = lifetimeHistory0516f07d65ba8f483984d156c0dd1420Form
    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
const lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9 = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url(args, options),
    method: 'get',
})

lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/students/{student_user}/lifetime-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.definition.url
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
    const lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9Form = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
        lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9Form.get = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory
 * @see app/Http/Controllers/Api/V1/Lms/ClassStudentRosterController.php:283
 * @route '/api/v1/lms/students/{student_user}/lifetime-history'
 */
        lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9Form.head = (args: { student_user: number | { id: number } } | [student_user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9.form = lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9Form

/**
* Multiple routes resolve to \App\Http\Controllers\Api\V1\Lms\ClassStudentRosterController::lifetimeHistory, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `lifetimeHistory['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const lifetimeHistory = {
    '/api/v1/students/{student_user}/lifetime-history': lifetimeHistory0516f07d65ba8f483984d156c0dd1420,
    '/api/v1/lms/students/{student_user}/lifetime-history': lifetimeHistorye69e66ed3023fa30c5114ecbb30e6fe9,
}

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
const ClassStudentRosterController = { globalStudent360, lifetimeHistory, studentsSummary, student360 }

export default ClassStudentRosterController