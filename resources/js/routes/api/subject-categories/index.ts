import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:30
 * @route '/api/v1/subject-categories'
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
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
 * @route '/api/v1/subject-categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/subject-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
 * @route '/api/v1/subject-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
 * @route '/api/v1/subject-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
 * @route '/api/v1/subject-categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:76
 * @route '/api/v1/subject-categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
export const show = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-categories/{subject_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
show.url = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject_category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject_category: typeof args.subject_category === 'object'
                ? args.subject_category.id
                : args.subject_category,
                }

    return show.definition.url
            .replace('{subject_category}', parsedArgs.subject_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
show.get = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
show.head = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
    const showForm = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
        showForm.get = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:98
 * @route '/api/v1/subject-categories/{subject_category}'
 */
        showForm.head = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
export const update = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/subject-categories/{subject_category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
update.url = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject_category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject_category: typeof args.subject_category === 'object'
                ? args.subject_category.id
                : args.subject_category,
                }

    return update.definition.url
            .replace('{subject_category}', parsedArgs.subject_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
update.put = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
update.patch = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
    const updateForm = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
        updateForm.put = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:128
 * @route '/api/v1/subject-categories/{subject_category}'
 */
        updateForm.patch = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
 * @route '/api/v1/subject-categories/{subject_category}'
 */
export const destroy = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/subject-categories/{subject_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
 * @route '/api/v1/subject-categories/{subject_category}'
 */
destroy.url = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject_category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject_category: typeof args.subject_category === 'object'
                ? args.subject_category.id
                : args.subject_category,
                }

    return destroy.definition.url
            .replace('{subject_category}', parsedArgs.subject_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
 * @route '/api/v1/subject-categories/{subject_category}'
 */
destroy.delete = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
 * @route '/api/v1/subject-categories/{subject_category}'
 */
    const destroyForm = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectCategoryController.php:151
 * @route '/api/v1/subject-categories/{subject_category}'
 */
        destroyForm.delete = (args: { subject_category: number | { id: number } } | [subject_category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const subjectCategories = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default subjectCategories