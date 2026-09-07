import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
export const index = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
index.url = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
index.get = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
index.head = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
    const indexForm = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
        indexForm.get = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::index
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:23
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
        indexForm.head = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::store
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:43
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
export const store = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::store
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:43
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
store.url = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace('{student_user}', parsedArgs.student_user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::store
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:43
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
store.post = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::store
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:43
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
    const storeForm = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::store
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:43
 * @route '/api/v1/lms/classes/{lms_class}/students/{student_user}/leaves'
 */
        storeForm.post = (args: { lms_class: number | { id: number }, student_user: number | { id: number } } | [lms_class: number | { id: number }, student_user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::updateStatus
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:190
 * @route '/api/v1/lms/leaves/{leave}/status'
 */
export const updateStatus = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/lms/leaves/{leave}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::updateStatus
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:190
 * @route '/api/v1/lms/leaves/{leave}/status'
 */
updateStatus.url = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave: typeof args.leave === 'object'
                ? args.leave.id
                : args.leave,
                }

    return updateStatus.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::updateStatus
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:190
 * @route '/api/v1/lms/leaves/{leave}/status'
 */
updateStatus.patch = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::updateStatus
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:190
 * @route '/api/v1/lms/leaves/{leave}/status'
 */
    const updateStatusForm = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::updateStatus
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:190
 * @route '/api/v1/lms/leaves/{leave}/status'
 */
        updateStatusForm.patch = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:243
 * @route '/api/v1/lms/leaves/{leave}'
 */
export const destroy = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/leaves/{leave}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:243
 * @route '/api/v1/lms/leaves/{leave}'
 */
destroy.url = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave: typeof args.leave === 'object'
                ? args.leave.id
                : args.leave,
                }

    return destroy.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:243
 * @route '/api/v1/lms/leaves/{leave}'
 */
destroy.delete = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:243
 * @route '/api/v1/lms/leaves/{leave}'
 */
    const destroyForm = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\StudentLeaveApplicationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/StudentLeaveApplicationController.php:243
 * @route '/api/v1/lms/leaves/{leave}'
 */
        destroyForm.delete = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const StudentLeaveApplicationController = { index, store, updateStatus, destroy }

export default StudentLeaveApplicationController