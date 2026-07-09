import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:16
 * @route '/api/v1/lms/courses'
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
 * @route '/api/v1/lms/courses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/courses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
 * @route '/api/v1/lms/courses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
 * @route '/api/v1/lms/courses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
 * @route '/api/v1/lms/courses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:44
 * @route '/api/v1/lms/courses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
export const show = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/courses/{lms_course}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
show.url = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_course: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_course: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_course: typeof args.lms_course === 'object'
                ? args.lms_course.id
                : args.lms_course,
                }

    return show.definition.url
            .replace('{lms_course}', parsedArgs.lms_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
show.get = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
show.head = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
    const showForm = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
        showForm.get = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:86
 * @route '/api/v1/lms/courses/{lms_course}'
 */
        showForm.head = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
export const update = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/lms/courses/{lms_course}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
update.url = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_course: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_course: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_course: typeof args.lms_course === 'object'
                ? args.lms_course.id
                : args.lms_course,
                }

    return update.definition.url
            .replace('{lms_course}', parsedArgs.lms_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
update.put = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
update.patch = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
    const updateForm = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
        updateForm.put = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:95
 * @route '/api/v1/lms/courses/{lms_course}'
 */
        updateForm.patch = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
 * @route '/api/v1/lms/courses/{lms_course}'
 */
export const destroy = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/courses/{lms_course}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
 * @route '/api/v1/lms/courses/{lms_course}'
 */
destroy.url = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_course: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_course: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_course: typeof args.lms_course === 'object'
                ? args.lms_course.id
                : args.lms_course,
                }

    return destroy.definition.url
            .replace('{lms_course}', parsedArgs.lms_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
 * @route '/api/v1/lms/courses/{lms_course}'
 */
destroy.delete = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
 * @route '/api/v1/lms/courses/{lms_course}'
 */
    const destroyForm = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsCourseController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsCourseController.php:133
 * @route '/api/v1/lms/courses/{lms_course}'
 */
        destroyForm.delete = (args: { lms_course: number | { id: number } } | [lms_course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const courses = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default courses