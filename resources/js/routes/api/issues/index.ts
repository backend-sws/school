import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/issues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::index
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:15
 * @route '/api/v1/library/issues'
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
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
 * @route '/api/v1/library/issues'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/library/issues',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
 * @route '/api/v1/library/issues'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
 * @route '/api/v1/library/issues'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
 * @route '/api/v1/library/issues'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::store
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:47
 * @route '/api/v1/library/issues'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
export const show = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/library/issues/{library_issue}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
show.url = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { library_issue: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    library_issue: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        library_issue: typeof args.library_issue === 'object'
                ? args.library_issue.id
                : args.library_issue,
                }

    return show.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
show.get = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
show.head = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
    const showForm = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
        showForm.get = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::show
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:87
 * @route '/api/v1/library/issues/{library_issue}'
 */
        showForm.head = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
export const update = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/library/issues/{library_issue}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
update.url = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { library_issue: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    library_issue: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        library_issue: typeof args.library_issue === 'object'
                ? args.library_issue.id
                : args.library_issue,
                }

    return update.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
update.put = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
update.patch = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
    const updateForm = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
        updateForm.put = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::update
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:96
 * @route '/api/v1/library/issues/{library_issue}'
 */
        updateForm.patch = (args: { library_issue: string | number | { id: string | number } } | [library_issue: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
 * @route '/api/v1/library/issues/{library_issue}'
 */
export const destroy = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/library/issues/{library_issue}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
 * @route '/api/v1/library/issues/{library_issue}'
 */
destroy.url = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { library_issue: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    library_issue: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        library_issue: args.library_issue,
                }

    return destroy.definition.url
            .replace('{library_issue}', parsedArgs.library_issue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
 * @route '/api/v1/library/issues/{library_issue}'
 */
destroy.delete = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
 * @route '/api/v1/library/issues/{library_issue}'
 */
    const destroyForm = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Library\LibraryIssueController::destroy
 * @see app/Http/Controllers/Api/V1/Library/LibraryIssueController.php:0
 * @route '/api/v1/library/issues/{library_issue}'
 */
        destroyForm.delete = (args: { library_issue: string | number } | [library_issue: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const issues = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default issues