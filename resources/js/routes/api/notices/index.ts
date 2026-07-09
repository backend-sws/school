import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::index
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:61
 * @route '/api/v1/notices'
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
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::store
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:126
 * @route '/api/v1/notices'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/notices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::store
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:126
 * @route '/api/v1/notices'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::store
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:126
 * @route '/api/v1/notices'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::store
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:126
 * @route '/api/v1/notices'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::store
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:126
 * @route '/api/v1/notices'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
export const show = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/notices/{notice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
show.url = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notice: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notice: args.notice,
                }

    return show.definition.url
            .replace('{notice}', parsedArgs.notice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
show.get = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
show.head = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
    const showForm = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
        showForm.get = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::show
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:0
 * @route '/api/v1/notices/{notice}'
 */
        showForm.head = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
export const update = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/notices/{notice}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
update.url = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notice: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notice: args.notice,
                }

    return update.definition.url
            .replace('{notice}', parsedArgs.notice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
update.put = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
update.patch = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
    const updateForm = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
        updateForm.put = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::update
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:239
 * @route '/api/v1/notices/{notice}'
 */
        updateForm.patch = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::destroy
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:306
 * @route '/api/v1/notices/{notice}'
 */
export const destroy = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/notices/{notice}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::destroy
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:306
 * @route '/api/v1/notices/{notice}'
 */
destroy.url = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notice: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notice: args.notice,
                }

    return destroy.definition.url
            .replace('{notice}', parsedArgs.notice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::destroy
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:306
 * @route '/api/v1/notices/{notice}'
 */
destroy.delete = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::destroy
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:306
 * @route '/api/v1/notices/{notice}'
 */
    const destroyForm = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Notices\NoticeController::destroy
 * @see app/Http/Controllers/Api/V1/Notices/NoticeController.php:306
 * @route '/api/v1/notices/{notice}'
 */
        destroyForm.delete = (args: { notice: string | number } | [notice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const notices = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default notices