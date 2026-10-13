import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
export const availableStudents = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableStudents.url(args, options),
    method: 'get',
})

availableStudents.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/available-students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
availableStudents.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return availableStudents.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
availableStudents.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableStudents.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
availableStudents.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableStudents.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
    const availableStudentsForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: availableStudents.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
        availableStudentsForm.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: availableStudents.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::availableStudents
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:106
 * @route '/api/v1/lms/classes/{lms_class}/available-students'
 */
        availableStudentsForm.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: availableStudents.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    availableStudents.form = availableStudentsForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
export const index = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class}/enrollments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
index.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
index.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
index.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
    const indexForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
        indexForm.get = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
        indexForm.head = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:48
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
export const store = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class}/enrollments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:48
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
store.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:48
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
store.post = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:48
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
    const storeForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:48
 * @route '/api/v1/lms/classes/{lms_class}/enrollments'
 */
        storeForm.post = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:88
 * @route '/api/v1/lms/classes/{lms_class}/enrollments/{user_id}'
 */
export const destroy = (args: { lms_class: string | number | { id: string | number }, user_id: string | number } | [lms_class: string | number | { id: string | number }, user_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/classes/{lms_class}/enrollments/{user_id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:88
 * @route '/api/v1/lms/classes/{lms_class}/enrollments/{user_id}'
 */
destroy.url = (args: { lms_class: string | number | { id: string | number }, user_id: string | number } | [lms_class: string | number | { id: string | number }, user_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                    user_id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                                user_id: args.user_id,
                }

    return destroy.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace('{user_id}', parsedArgs.user_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:88
 * @route '/api/v1/lms/classes/{lms_class}/enrollments/{user_id}'
 */
destroy.delete = (args: { lms_class: string | number | { id: string | number }, user_id: string | number } | [lms_class: string | number | { id: string | number }, user_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:88
 * @route '/api/v1/lms/classes/{lms_class}/enrollments/{user_id}'
 */
    const destroyForm = (args: { lms_class: string | number | { id: string | number }, user_id: string | number } | [lms_class: string | number | { id: string | number }, user_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsClassEnrollmentController.php:88
 * @route '/api/v1/lms/classes/{lms_class}/enrollments/{user_id}'
 */
        destroyForm.delete = (args: { lms_class: string | number | { id: string | number }, user_id: string | number } | [lms_class: string | number | { id: string | number }, user_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LmsClassEnrollmentController = { availableStudents, index, store, destroy }

export default LmsClassEnrollmentController