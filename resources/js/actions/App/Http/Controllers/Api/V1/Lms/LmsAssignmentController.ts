import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
export const index = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
index.url = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
index.get = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
index.head = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
    const indexForm = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
        indexForm.get = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::index
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:17
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
        indexForm.head = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:44
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
export const store = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:44
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
store.url = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:44
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
store.post = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:44
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
    const storeForm = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::store
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:44
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments'
 */
        storeForm.post = (args: { lms_class_id: string | number } | [lms_class_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
export const show = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
show.url = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                id: args.id,
                }

    return show.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
show.get = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
show.head = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
    const showForm = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
        showForm.get = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::show
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:91
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
        showForm.head = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:105
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
export const update = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:105
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
update.url = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                id: args.id,
                }

    return update.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:105
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
update.put = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:105
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
    const updateForm = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::update
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:105
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
        updateForm.put = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:133
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
export const destroy = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:133
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
destroy.url = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    lms_class_id: args[0],
                    id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class_id: args.lms_class_id,
                                id: args.id,
                }

    return destroy.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:133
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
destroy.delete = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:133
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
    const destroyForm = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentController.php:133
 * @route '/api/v1/lms/classes/{lms_class_id}/assignments/{id}'
 */
        destroyForm.delete = (args: { lms_class_id: string | number, id: string | number } | [lms_class_id: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LmsAssignmentController = { index, store, show, update, destroy }

export default LmsAssignmentController