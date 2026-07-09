import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/feedbacks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::index
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:27
 * @route '/api/v1/feedbacks'
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
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
 * @route '/api/v1/feedbacks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/feedbacks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
 * @route '/api/v1/feedbacks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
 * @route '/api/v1/feedbacks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
 * @route '/api/v1/feedbacks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::store
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:67
 * @route '/api/v1/feedbacks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
export const show = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/feedbacks/{feedback}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
show.url = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    feedback: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        feedback: args.feedback,
                }

    return show.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
show.get = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
show.head = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
    const showForm = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
        showForm.get = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::show
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:92
 * @route '/api/v1/feedbacks/{feedback}'
 */
        showForm.head = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
export const update = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/feedbacks/{feedback}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
update.url = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    feedback: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        feedback: args.feedback,
                }

    return update.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
update.put = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
update.patch = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
    const updateForm = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
        updateForm.put = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::update
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:0
 * @route '/api/v1/feedbacks/{feedback}'
 */
        updateForm.patch = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
 * @route '/api/v1/feedbacks/{feedback}'
 */
export const destroy = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/feedbacks/{feedback}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
 * @route '/api/v1/feedbacks/{feedback}'
 */
destroy.url = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    feedback: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        feedback: args.feedback,
                }

    return destroy.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
 * @route '/api/v1/feedbacks/{feedback}'
 */
destroy.delete = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
 * @route '/api/v1/feedbacks/{feedback}'
 */
    const destroyForm = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Grievance\FeedbackController::destroy
 * @see app/Http/Controllers/Api/V1/Grievance/FeedbackController.php:130
 * @route '/api/v1/feedbacks/{feedback}'
 */
        destroyForm.delete = (args: { feedback: string | number } | [feedback: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const feedbacks = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default feedbacks