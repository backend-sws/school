import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::index
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:12
 * @route '/api/v1/subject-groups'
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
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
 * @route '/api/v1/subject-groups'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/subject-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
 * @route '/api/v1/subject-groups'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
 * @route '/api/v1/subject-groups'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
 * @route '/api/v1/subject-groups'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::store
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:30
 * @route '/api/v1/subject-groups'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
export const show = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/subject-groups/{subject_group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
show.url = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_group: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject_group: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject_group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject_group: typeof args.subject_group === 'object'
                ? args.subject_group.id
                : args.subject_group,
                }

    return show.definition.url
            .replace('{subject_group}', parsedArgs.subject_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
show.get = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
show.head = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
    const showForm = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
        showForm.get = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::show
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:41
 * @route '/api/v1/subject-groups/{subject_group}'
 */
        showForm.head = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
export const update = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/subject-groups/{subject_group}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
update.url = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_group: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject_group: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject_group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject_group: typeof args.subject_group === 'object'
                ? args.subject_group.id
                : args.subject_group,
                }

    return update.definition.url
            .replace('{subject_group}', parsedArgs.subject_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
update.put = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
update.patch = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
    const updateForm = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
        updateForm.put = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::update
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:46
 * @route '/api/v1/subject-groups/{subject_group}'
 */
        updateForm.patch = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
 * @route '/api/v1/subject-groups/{subject_group}'
 */
export const destroy = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/subject-groups/{subject_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
 * @route '/api/v1/subject-groups/{subject_group}'
 */
destroy.url = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject_group: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject_group: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject_group: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject_group: typeof args.subject_group === 'object'
                ? args.subject_group.id
                : args.subject_group,
                }

    return destroy.definition.url
            .replace('{subject_group}', parsedArgs.subject_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
 * @route '/api/v1/subject-groups/{subject_group}'
 */
destroy.delete = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
 * @route '/api/v1/subject-groups/{subject_group}'
 */
    const destroyForm = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::destroy
 * @see app/Http/Controllers/Api/V1/Organization/SubjectGroupController.php:57
 * @route '/api/v1/subject-groups/{subject_group}'
 */
        destroyForm.delete = (args: { subject_group: string | number | { id: string | number } } | [subject_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const subjectGroups = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default subjectGroups